
import React, { useState } from 'react';
import { Page, GenerationResult } from '../../types';
import { generateImage } from '../../services/geminiService';
import Loader from '../Loader';
import ImageDisplay from '../ImageDisplay';
import ProjectPageLayout from '../ProjectPageLayout';
import DownloadController, { ImageInfo } from '../DownloadController';
import ImageUploader from '../ImageUploader';

const ProductPhotoPage: React.FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => {
  const [product, setProduct] = useState('a luxury watch');
  const [background, setBackground] = useState('on a clean white background');
  const [aspectRatio, setAspectRatio] = useState('1:1');
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
      basePrompt = `Using the uploaded image(s) of a product, create a professional product photograph. The product description is "${product}". Place the product ${background}. The style should be: studio lighting, sharp focus, high resolution, commercial.`;
    } else {
      basePrompt = `Professional product photography of ${product}, ${background}. Studio lighting, sharp focus, high resolution, commercial style.`;
    }
    
    const promises = Array.from({ length: sheetCount }, () => 
        generateImage(basePrompt, aspectRatio, uploadedImages)
    );

    try {
        const generatedImages = await Promise.all(promises);
        setResults(generatedImages);
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
        filename: `product-photo-${index + 1}.png`
      }));
  };

  return (
    <ProjectPageLayout
      title="Foto Produk Profesional"
      description="Hasilkan foto produk berkualitas studio untuk bisnis Anda."
      navigateTo={navigateTo}
    >
      <div className="space-y-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Unggah Gambar Referensi (Opsional)</h3>
          <p className="text-sm text-slate-500 mb-3">Unggah gambar produk Anda untuk hasil yang lebih akurat.</p>
          <ImageUploader images={uploadedImages} onImagesChange={setUploadedImages} maxImages={4} />
        </div>
        <div>
          <label htmlFor="product" className="block text-sm font-medium text-slate-700 mb-1">Nama Produk</label>
          <input id="product" type="text" value={product} onChange={(e) => setProduct(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md bg-white" placeholder="Contoh: sebuah jam tangan mewah" />
        </div>
        <div>
          <label htmlFor="background" className="block text-sm font-medium text-slate-700 mb-1">Latar Belakang</label>
          <input id="background" type="text" value={background} onChange={(e) => setBackground(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md bg-white" placeholder="Contoh: di atas latar belakang putih bersih" />
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
        {loading ? 'Memotret...' : 'Buat Foto Produk'}
      </button>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      
      <div className="mt-8">
        {loading && <Loader />}
        {results.length > 0 && (
          <div>
            <DownloadController getImages={getImagesForDownload} projectName="picaa-product-photo" />
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

export default ProductPhotoPage;