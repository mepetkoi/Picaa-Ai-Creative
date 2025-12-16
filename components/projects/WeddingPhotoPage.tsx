
import React, { useState } from 'react';
import { Page, GenerationResult } from '../../types';
import { generateImage } from '../../services/geminiService';
import Loader from '../Loader';
import ImageDisplay from '../ImageDisplay';
import ProjectPageLayout from '../ProjectPageLayout';
import DownloadController, { ImageInfo } from '../DownloadController';
import ImageUploader from '../ImageUploader';

const WeddingPhotoPage: React.FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => {
  const [couple, setCouple] = useState('a bride and groom');
  const [setting, setSetting] = useState('on a beautiful beach at sunset');
  const [style, setStyle] = useState('romantic and cinematic');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [sheetCount, setSheetCount] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setResults([]);

    let basePrompt: string;
    if (uploadedImages.length > 0) {
      basePrompt = `Using the uploaded photos as a reference for the couple's appearance, create a stunning wedding photograph of ${couple}, ${setting}. The style is ${style}, with dramatic lighting and beautiful colors. Photorealistic, high-end photography.`;
    } else {
      basePrompt = `A stunning wedding photograph of ${couple}, ${setting}. The style is ${style}, with dramatic lighting and beautiful colors. Photorealistic, high-end photography.`;
    }
    
    const promises = Array.from({ length: sheetCount }, () => 
        generateImage(basePrompt, aspectRatio, uploadedImages)
    );

    try {
        const generatedImages = await Promise.all(promises);
        setResults(generatedImages);
    // FIX: Corrected a syntax error in the catch block.
    } catch (err) {
      setError('Gagal membuat foto. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const getImagesForDownload = (): ImageInfo[] => {
    return results
      .filter(res => res.imageUrl)
      .map((res, index) => ({
        url: res.imageUrl!,
        filename: `wedding-photo-${index + 1}.png`
      }));
  };

  return (
    <ProjectPageLayout
      title="Foto Wedding"
      description="Abadikan momen pernikahan impian Anda."
      navigateTo={navigateTo}
    >
      <div className="space-y-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Unggah Gambar Referensi (Opsional)</h3>
          <p className="text-sm text-slate-500 mb-3">Unggah foto pasangan untuk hasil potret yang lebih personal.</p>
          <ImageUploader images={uploadedImages} onImagesChange={setUploadedImages} maxImages={4} />
        </div>
        <div>
          <label htmlFor="couple" className="block text-sm font-medium text-slate-700 mb-1">Subjek</label>
          <input id="couple" type="text" value={couple} onChange={(e) => setCouple(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md bg-white" placeholder="Contoh: sepasang pengantin" />
        </div>
        <div>
          <label htmlFor="setting" className="block text-sm font-medium text-slate-700 mb-1">Latar</label>
          <input id="setting" type="text" value={setting} onChange={(e) => setSetting(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md bg-white" placeholder="Contoh: di pantai saat matahari terbenam" />
        </div>
        <div>
          <label htmlFor="style" className="block text-sm font-medium text-slate-700 mb-1">Gaya Foto</label>
          <select id="style" value={style} onChange={(e) => setStyle(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md bg-white">
            <option>Romantic and cinematic</option>
            <option>Classic and elegant</option>
            <option>Photojournalistic and candid</option>
            <option>Light and airy</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="aspectRatio" className="block text-sm font-medium text-slate-700 mb-1">Rasio Aspek</label>
            <select
              id="aspectRatio"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary bg-white"
            >
              <option value="1:1">Kotak (1:1)</option>
              <option value="16:9">Lanskap (16:9)</option>
              <option value="9:16">Potret (9:16)</option>
              <option value="4:3">Lanskap (4:3)</option>
              <option value="3:4">Potret (3:4)</option>
            </select>
          </div>
          <div>
            <label htmlFor="sheetCount" className="block text-sm font-medium text-slate-700 mb-1">Jumlah Lembar</label>
            <select
              id="sheetCount"
              value={sheetCount}
              onChange={(e) => setSheetCount(Number(e.target.value))}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary bg-white"
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <button onClick={handleGenerate} disabled={loading} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-slate-400">
        {loading ? 'Memotret...' : 'Buat Foto Wedding'}
      </button>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      
      <div className="mt-8">
        {loading && <Loader />}
        {results.length > 0 && (
          <div>
            <DownloadController getImages={getImagesForDownload} projectName="picaa-wedding-photo" />
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

export default WeddingPhotoPage;