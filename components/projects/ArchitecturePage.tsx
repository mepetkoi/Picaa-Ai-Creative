
import React, { useState } from 'react';
import { Page, GenerationResult } from '../../types';
import { generateImage } from '../../services/geminiService';
import Loader from '../Loader';
import ImageDisplay from '../ImageDisplay';
import ProjectPageLayout from '../ProjectPageLayout';
import DownloadController, { ImageInfo } from '../DownloadController';

interface ArchitecturePageProps {
  navigateTo: (page: Page) => void;
}

interface ArchitectureResult {
    image3dUrl?: string;
    floorPlan?: GenerationResult;
}

const ArchitecturePage: React.FC<ArchitecturePageProps> = ({ navigateTo }) => {
  const [details, setDetails] = useState('a modern minimalist house with 3 bedrooms, 2 bathrooms, an open kitchen, and a small garden');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [sheetCount, setSheetCount] = useState(1);
  const [results, setResults] = useState<ArchitectureResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('Merancang...');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setResults([]);
    
    try {
        setLoadingMessage(`Membuat ${sheetCount} render 3D...`);
        const prompt3d = `Photorealistic, high-resolution 3D architectural render of the exterior of ${details}. Professional lighting, beautiful environment.`;
        const promises3d = Array.from({ length: sheetCount }, () => 
            generateImage(prompt3d, aspectRatio)
        );
        const generated3dImages = await Promise.all(promises3d);

        setLoadingMessage(`Membuat ${sheetCount} denah lantai...`);
        const promptFloorPlan = `Generate a simple, clear, black and white 2D architectural floor plan image for ${details}. The floor plan should show room layouts, dimensions in meters, and labels. Also, provide a brief textual description of the layout and total area.`;
        const promisesFloorPlan = Array.from({ length: sheetCount }, () => 
            generateImage(promptFloorPlan, '4:3')
        );
        const generatedFloorPlans = await Promise.all(promisesFloorPlan);

        const combinedResults = generated3dImages.map((img3d, index) => ({
            image3dUrl: img3d.imageUrl,
            floorPlan: generatedFloorPlans[index],
        }));

        setResults(combinedResults);

    } catch (err) {
      setError('Gagal membuat denah. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const getImagesForDownload = (): ImageInfo[] => {
    const images: ImageInfo[] = [];
    results.forEach((res, index) => {
        if (res.image3dUrl) {
            images.push({
                url: res.image3dUrl,
                filename: `design-${index + 1}-3d-view.png`
            });
        }
        if (res.floorPlan?.imageUrl) {
            images.push({
                url: res.floorPlan.imageUrl,
                filename: `design-${index + 1}-floor-plan.png`
            });
        }
    });
    return images;
  };

  return (
    <ProjectPageLayout
      title="Arsitektur"
      description="Rencanakan denah rumah Anda secara detail."
      navigateTo={navigateTo}
    >
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="details" className="block text-sm font-medium text-slate-700 mb-1">Detail Rumah</label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={4}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary bg-white"
            placeholder="Contoh: rumah modern minimalis dengan 3 kamar tidur..."
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="aspectRatio" className="block text-sm font-medium text-slate-700 mb-1">Rasio Aspek (Tampilan 3D)</label>
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
            <label htmlFor="sheetCount" className="block text-sm font-medium text-slate-700 mb-1">Jumlah Desain</label>
            <select
              id="sheetCount"
              value={sheetCount}
              onChange={(e) => setSheetCount(Number(e.target.value))}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary bg-white"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <button onClick={handleGenerate} disabled={loading} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-slate-400">
        {loading ? 'Merancang...' : 'Buat Desain Rumah'}
      </button>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      
      <div className="mt-8">
        {loading && <Loader message={loadingMessage} />}
        {results.length > 0 && (
           <div>
            <DownloadController getImages={getImagesForDownload} projectName="picaa-architecture" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {results.map((res, index) => (
                <div key={index} className="space-y-6 bg-slate-50 p-4 rounded-xl border">
                    <div>
                        <h3 className="font-semibold text-lg mb-2 text-slate-700">Tampilan 3D</h3>
                        {res.image3dUrl && <ImageDisplay imageUrl={res.image3dUrl} />}
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-2 text-slate-700">Denah Lantai</h3>
                        {res.floorPlan?.imageUrl && <ImageDisplay imageUrl={res.floorPlan.imageUrl} />}
                        {res.floorPlan?.text && (
                            <div className="prose max-w-none p-4 bg-secondary rounded-lg mt-4">
                                <h4 className="font-semibold text-base">Deskripsi Denah</h4>
                                <p className="whitespace-pre-wrap text-sm">{res.floorPlan.text}</p>
                            </div>
                        )}
                    </div>
                </div>
              ))}
           </div>
           </div>
        )}
      </div>
    </ProjectPageLayout>
  );
};

export default ArchitecturePage;