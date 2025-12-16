
import React, { useState } from 'react';
import { Page, GenerationResult } from '../../types';
import { generateImage } from '../../services/geminiService';
import Loader from '../Loader';
import ImageDisplay from '../ImageDisplay';
import ProjectPageLayout from '../ProjectPageLayout';
import DownloadController, { ImageInfo } from '../DownloadController';

interface InteriorDesignPageProps {
  navigateTo: (page: Page) => void;
}

const InteriorDesignPage: React.FC<InteriorDesignPageProps> = ({ navigateTo }) => {
  const [room, setRoom] = useState('Living Room');
  const [style, setStyle] = useState('Modern Minimalist');
  const [colors, setColors] = useState('neutral colors with a touch of green');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [sheetCount, setSheetCount] = useState(1);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setResults([]);
    const basePrompt = `Photorealistic interior design photo of a ${style} ${room}, with ${colors}. High resolution, detailed, professional lighting.`;
    
    const promises = Array.from({ length: sheetCount }, () => 
        generateImage(basePrompt, aspectRatio)
    );

    try {
        const generatedImages = await Promise.all(promises);
        setResults(generatedImages);
    } catch (err) {
      setError('Gagal membuat desain. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const getImagesForDownload = (): ImageInfo[] => {
    return results
      .filter(res => res.imageUrl)
      .map((res, index) => ({
        url: res.imageUrl!,
        filename: `interior-design-${index + 1}.png`
      }));
  };

  return (
    <ProjectPageLayout
      title="Desain Interior"
      description="Visualisasikan ruang impian Anda dengan AI."
      navigateTo={navigateTo}
    >
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="room" className="block text-sm font-medium text-slate-700 mb-1">Jenis Ruangan</label>
          <select id="room" value={room} onChange={(e) => setRoom(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md bg-white">
            <option>Living Room</option>
            <option>Bedroom</option>
            <option>Kitchen</option>
            <option>Bathroom</option>
            <option>Home Office</option>
          </select>
        </div>
        <div>
          <label htmlFor="style" className="block text-sm font-medium text-slate-700 mb-1">Gaya Desain</label>
          <select id="style" value={style} onChange={(e) => setStyle(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md bg-white">
            <option>Modern Minimalist</option>
            <option>Bohemian</option>
            <option>Scandinavian</option>
            <option>Industrial</option>
            <option>Japandi</option>
          </select>
        </div>
        <div>
          <label htmlFor="colors" className="block text-sm font-medium text-slate-700 mb-1">Palet Warna</label>
          <input id="colors" type="text" value={colors} onChange={(e) => setColors(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md bg-white" placeholder="Contoh: warna netral dengan sentuhan hijau" />
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
        {loading ? 'Mendesain...' : 'Buat Desain'}
      </button>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      
      <div className="mt-8">
        {loading && <Loader />}
        {results.length > 0 && (
          <div>
            <DownloadController getImages={getImagesForDownload} projectName="picaa-interior-design" />
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

export default InteriorDesignPage;