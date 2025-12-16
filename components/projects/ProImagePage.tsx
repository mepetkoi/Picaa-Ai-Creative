import React, { useState } from 'react';
import { Page, GenerationResult } from '../../types';
// FIX: Changed import from non-existent 'generateProImage' to the consolidated 'generateImage' function.
import { generateImage } from '../../services/geminiService';
import Loader from '../Loader';
import ImageDisplay from '../ImageDisplay';
import ProjectPageLayout from '../ProjectPageLayout';
import DownloadController, { ImageInfo } from '../DownloadController';

const ProImagePage: React.FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => {
  const [prompt, setPrompt] = useState('a majestic lion with a crown of stars, cinematic fantasy art');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [sheetCount, setSheetCount] = useState(1);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setResults([]);
    
    // FIX: Updated the function call to use 'generateImage' and pass 'undefined' for the unused 'uploadedImages' parameter,
    // followed by the 'imageSize' for pro-quality generation.
    const promises = Array.from({ length: sheetCount }, () => 
        generateImage(prompt, aspectRatio, undefined, imageSize)
    );

    try {
        const generatedImages = await Promise.all(promises);
        setResults(generatedImages);
    } catch (err) {
      setError('Gagal membuat gambar. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const getImagesForDownload = (): ImageInfo[] => {
    return results
      .filter(res => res.imageUrl)
      .map((res, index) => ({
        url: res.imageUrl!,
        filename: `pro-image-${index + 1}.png`
      }));
  };

  return (
    <ProjectPageLayout
      title="Gambar Pro"
      description="Hasilkan gambar berkualitas tinggi dengan kontrol kreatif penuh."
      navigateTo={navigateTo}
    >
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 mb-1">Prompt Gambar</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary bg-white"
            placeholder="Jelaskan gambar yang ingin Anda buat..."
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="aspectRatio" className="block text-sm font-medium text-slate-700 mb-1">Rasio Aspek</label>
            <select
              id="aspectRatio"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md bg-white"
            >
              <option value="16:9">Lanskap (16:9)</option>
              <option value="9:16">Potret (9:16)</option>
              <option value="1:1">Kotak (1:1)</option>
              <option value="4:3">Lanskap (4:3)</option>
              <option value="3:4">Potret (3:4)</option>
              <option value="3:2">Lanskap (3:2)</option>
              <option value="2:3">Potret (2:3)</option>
              <option value="21:9">Sinematik (21:9)</option>
            </select>
          </div>
          <div>
            <label htmlFor="imageSize" className="block text-sm font-medium text-slate-700 mb-1">Ukuran Gambar</label>
            <select
              id="imageSize"
              value={imageSize}
              onChange={(e) => setImageSize(e.target.value as '1K' | '2K' | '4K')}
              className="w-full p-2 border border-slate-300 rounded-md bg-white"
            >
              <option value="1K">1K (1024px)</option>
              <option value="2K">2K (2048px)</option>
              <option value="4K">4K (4096px)</option>
            </select>
          </div>
          <div>
            <label htmlFor="sheetCount" className="block text-sm font-medium text-slate-700 mb-1">Jumlah Gambar</label>
            <select
              id="sheetCount"
              value={sheetCount}
              onChange={(e) => setSheetCount(Number(e.target.value))}
              className="w-full p-2 border border-slate-300 rounded-md bg-white"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-slate-400"
      >
        {loading ? 'Membuat...' : 'Buat Gambar Pro'}
      </button>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      
      <div className="mt-8">
        {loading && <Loader />}
        {results.length > 0 && (
          <div>
            <DownloadController getImages={getImagesForDownload} projectName="picaa-pro-image" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.map((res, index) => (
                res.imageUrl && <ImageDisplay key={index} imageUrl={res.imageUrl} />
              ))}
            </div>
          </div>
        )}
      </div>
    </ProjectPageLayout>
  );
};

export default ProImagePage;