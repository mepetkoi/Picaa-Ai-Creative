
import React, { useState } from 'react';
import { Page, GenerationResult } from '../../types';
import { generateImage } from '../../services/geminiService';
import Loader from '../Loader';
import ImageDisplay from '../ImageDisplay';
import ProjectPageLayout from '../ProjectPageLayout';
import DownloadController, { ImageInfo } from '../DownloadController';

interface ColoringBookPageProps {
  navigateTo: (page: Page) => void;
}

const ColoringBookPage: React.FC<ColoringBookPageProps> = ({ navigateTo }) => {
  const [subject, setSubject] = useState('a cute cat');
  const [style, setStyle] = useState('simple lines');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [sheetCount, setSheetCount] = useState(1);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setResults([]);
    const basePrompt = `A black and white coloring book page for children, with ${style}, featuring ${subject}. The image should have clean, bold outlines and no shading or color.`;
    
    const promises = Array.from({ length: sheetCount }, () => 
        generateImage(basePrompt, aspectRatio)
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
        filename: `coloring-page-${index + 1}.png`
      }));
  };

  return (
    <ProjectPageLayout
      title="Buku Mewarnai"
      description="Buat halaman mewarnai yang indah dalam hitungan detik."
      navigateTo={navigateTo}
    >
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Subjek Gambar</label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary bg-white"
            placeholder="Contoh: seekor kucing lucu, sebuah mobil balap"
          />
        </div>
        <div>
          <label htmlFor="style" className="block text-sm font-medium text-slate-700 mb-1">Gaya Garis</label>
          <select
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary bg-white"
          >
            <option value="simple lines">Garis Sederhana</option>
            <option value="detailed lines">Garis Detail</option>
            <option value="kawaii style">Gaya Kawaii</option>
            <option value="mandala style">Gaya Mandala</option>
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
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-slate-400"
      >
        {loading ? 'Membuat...' : 'Buat Halaman Mewarnai'}
      </button>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      
      <div className="mt-8">
        {loading && <Loader />}
        {results.length > 0 && (
          <div>
            <DownloadController getImages={getImagesForDownload} projectName="picaa-coloring-book" />
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

export default ColoringBookPage;