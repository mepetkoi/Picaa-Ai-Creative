
import React, { useState } from 'react';
import { Page } from '../../types';
import { analyzeImage } from '../../services/geminiService';
import Loader from '../Loader';
import ProjectPageLayout from '../ProjectPageLayout';
import ImageUploader from '../ImageUploader';

const ImageAnalysisPage: React.FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => {
  const [prompt, setPrompt] = useState('What is in this image? Describe it in detail.');
  const [uploadedImage, setUploadedImage] = useState<string[]>([]);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (uploadedImage.length === 0) {
      setError('Silakan unggah gambar terlebih dahulu.');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');
    
    try {
        const analysis = await analyzeImage(prompt, uploadedImage[0]);
        setResult(analysis);
    } catch (err) {
      setError('Gagal menganalisis gambar. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectPageLayout
      title="Analisis Gambar"
      description="Biarkan AI memahami dan menjelaskan gambar Anda."
      navigateTo={navigateTo}
    >
      <div className="space-y-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">1. Unggah Gambar Anda</h3>
          <p className="text-sm text-slate-500 mb-3">Pilih satu gambar dari perangkat Anda yang ingin dianalisis.</p>
          <ImageUploader images={uploadedImage} onImagesChange={setUploadedImage} maxImages={1} />
        </div>
        
        <div>
          <label htmlFor="prompt" className="block text-lg font-semibold text-slate-800 mb-2">2. Ajukan Pertanyaan</label>
          <textarea 
            id="prompt"
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)} 
            className="w-full p-2 border border-slate-300 rounded-md bg-white" 
            placeholder="Contoh: Ada apa di gambar ini? Berapa banyak objek di sini?"
            rows={3}
          />
        </div>
      </div>
      <button onClick={handleAnalyze} disabled={loading || uploadedImage.length === 0} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-slate-400">
        {loading ? 'Menganalisis...' : 'Analisis Gambar'}
      </button>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      
      <div className="mt-8">
        {loading && <Loader />}
        {result && (
          <div className="prose max-w-none p-4 bg-secondary rounded-lg mt-4 border border-primary/20">
              <h3 className="font-semibold text-lg">Hasil Analisis:</h3>
              <p className="whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </div>
    </ProjectPageLayout>
  );
};

export default ImageAnalysisPage;