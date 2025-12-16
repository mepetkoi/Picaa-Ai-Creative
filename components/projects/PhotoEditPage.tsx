
import React, { useState } from 'react';
import { Page, GenerationResult } from '../../types';
import { generateImage } from '../../services/geminiService';
import Loader from '../Loader';
import ImageDisplay from '../ImageDisplay';
import ProjectPageLayout from '../ProjectPageLayout';
import DownloadController, { ImageInfo } from '../DownloadController';
import ImageUploader from '../ImageUploader';

const PhotoEditPage: React.FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => {
  const [prompt, setPrompt] = useState('make the background a beautiful beach at sunset');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [sheetCount, setSheetCount] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string[]>([]);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (uploadedImage.length === 0) {
      setError('Silakan unggah gambar terlebih dahulu.');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);
    
    const basePrompt = `Using the uploaded image as the base, edit it with the following instruction: "${prompt}".`;
    
    const promises = Array.from({ length: sheetCount }, () => 
        generateImage(basePrompt, aspectRatio, uploadedImage)
    );

    try {
        const generatedImages = await Promise.all(promises);
        setResults(generatedImages);
    } catch (err) {
      setError('Gagal mengedit gambar. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const getImagesForDownload = (): ImageInfo[] => {
    return results
      .filter(res => res.imageUrl)
      .map((res, index) => ({
        url: res.imageUrl!,
        filename: `photo-edit-${index + 1}.png`
      }));
  };

  return (
    <ProjectPageLayout
      title="Edit Foto"
      description="Unggah gambar Anda dan biarkan AI menyempurnakannya."
      navigateTo={navigateTo}
    >
      <div className="space-y-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">1. Unggah Gambar Anda</h3>
          <p className="text-sm text-slate-500 mb-3">Pilih satu gambar dari perangkat Anda yang ingin diedit.</p>
          <ImageUploader images={uploadedImage} onImagesChange={setUploadedImage} maxImages={1} />
        </div>
        
        <div>
          <label htmlFor="prompt" className="block text-lg font-semibold text-slate-800 mb-2">2. Instruksi Edit</label>
          <textarea 
            id="prompt"
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)} 
            className="w-full p-2 border border-slate-300 rounded-md bg-white" 
            placeholder="Contoh: hapus orang di latar belakang, ubah menjadi hitam putih"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="aspectRatio" className="block text-sm font-medium text-slate-700 mb-1">Rasio Aspek Hasil</label>
            <select
              id="aspectRatio"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary bg-white"
            >
              <option value="1:1">Sama seperti asli (Kotak 1:1)</option>
              <option value="16:9">Lanskap (16:9)</option>
              <option value="9:16">Potret (9:16)</option>
              <option value="4:3">Lanskap (4:3)</option>
              <option value="3:4">Potret (3:4)</option>
            </select>
          </div>
          <div>
            <label htmlFor="sheetCount" className="block text-sm font-medium text-slate-700 mb-1">Jumlah Hasil</label>
            <select
              id="sheetCount"
              value={sheetCount}
              onChange={(e) => setSheetCount(Number(e.target.value))}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary bg-white"
            >
              {Array.from({ length: 4 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <button onClick={handleGenerate} disabled={loading} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-slate-400">
        {loading ? 'Mengedit...' : 'Proses Gambar'}
      </button>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      
      <div className="mt-8">
        {loading && <Loader />}
        {results.length > 0 && (
          <div>
            <DownloadController getImages={getImagesForDownload} projectName="picaa-photo-edit" />
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

export default PhotoEditPage;