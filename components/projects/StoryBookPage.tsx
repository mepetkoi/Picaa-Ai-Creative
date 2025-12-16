
import React, { useState } from 'react';
import { Page, GenerationResult } from '../../types';
import { generateImage, generateText } from '../../services/geminiService';
import Loader from '../Loader';
import ProjectPageLayout from '../ProjectPageLayout';
import ImageDisplay from '../ImageDisplay';
import DownloadController, { ImageInfo } from '../DownloadController';

interface StoryBookPageProps {
  navigateTo: (page: Page) => void;
}

const StoryBookPage: React.FC<StoryBookPageProps> = ({ navigateTo }) => {
    const [topic, setTopic] = useState('a brave little fox');
    const [age, setAge] = useState('5-7');
    const [language, setLanguage] = useState('indonesian');
    const [aspectRatio, setAspectRatio] = useState('4:3');
    const [sheetCount, setSheetCount] = useState(1);
    const [results, setResults] = useState<GenerationResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('Membuat...');

    const handleGenerate = async () => {
        setLoading(true);
        setError('');
        setResults([]);

        try {
            // Step 1: Generate the full, continuous story text in the selected language.
            setLoadingMessage('Menulis cerita...');
            const storyPrompt = `Write a simple, continuous children's story for ages ${age} about ${topic} in ${language === 'english' ? 'English' : 'Indonesian'}. The story must be split into ${sheetCount} parts, one for each page. Each part should be only one or two short sentences. Use a unique separator "|||" between each part. Do not number the parts.`;
            const fullStory = await generateText(storyPrompt);
            const storyPages = fullStory.split('|||').map(p => p.trim()).filter(p => p.length > 0);

            if (storyPages.length === 0) {
                throw new Error("Could not generate story text.");
            }

            // Step 2: Generate an image for each part of the story with the text embedded.
            setLoadingMessage(`Membuat ${storyPages.length} ilustrasi...`);
            const imagePromises = storyPages.map(pageText => {
                const imagePrompt = `A whimsical, colorful children's storybook illustration showing: "${pageText}". The following text must be written clearly at the bottom of the image: "${pageText}"`;
                return generateImage(imagePrompt, aspectRatio);
            });

            const generatedContent = await Promise.all(imagePromises);
            setResults(generatedContent);

        } catch (err) {
            console.error(err);
            setError('Gagal membuat cerita dan gambar. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };
    
    const getImagesForDownload = (): ImageInfo[] => {
      return results
        .filter(res => res.imageUrl)
        .map((res, index) => ({
          url: res.imageUrl!,
          filename: `story-page-${index + 1}.png`
        }));
    };

    return (
        <ProjectPageLayout
            title="Buku Cerita"
            description="Ciptakan cerita anak-anak yang mempesona dengan satu klik."
            navigateTo={navigateTo}
        >
            <div className="space-y-4 mb-6">
                <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-1">Topik Cerita</label>
                    <input
                        id="topic"
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary bg-white"
                        placeholder="Contoh: seekor rubah kecil yang berani"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-1">Kelompok Usia</label>
                        <select
                            id="age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary bg-white"
                        >
                            <option value="3-4">3-4 tahun</option>
                            <option value="5-7">5-7 tahun</option>
                            <option value="8-10">8-10 tahun</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-slate-700 mb-1">Bahasa Narasi</label>
                        <select
                            id="language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary bg-white"
                        >
                            <option value="indonesian">Bahasa Indonesia</option>
                            <option value="english">English</option>
                        </select>
                    </div>
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
                        <label htmlFor="sheetCount" className="block text-sm font-medium text-slate-700 mb-1">Jumlah Halaman</label>
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
                {loading ? 'Membuat...' : 'Buat Buku Cerita'}
            </button>

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

            <div className="mt-8">
                {loading && <Loader message={loadingMessage} />}
                {results.length > 0 && (
                    <div>
                        <DownloadController getImages={getImagesForDownload} projectName="picaa-story-book" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {results.map((res, index) => (
                               <div key={index}>
                                 {res.imageUrl && <ImageDisplay imageUrl={res.imageUrl} />}
                               </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ProjectPageLayout>
    );
};

export default StoryBookPage;