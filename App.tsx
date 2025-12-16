
import React, { useState, useCallback } from 'react';
import { Page } from './types';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ColoringBookPage from './components/projects/ColoringBookPage';
import StoryBookPage from './components/projects/StoryBookPage';
import WorksheetPage from './components/projects/WorksheetPage';
import InteriorDesignPage from './components/projects/InteriorDesignPage';
import ArchitecturePage from './components/projects/ArchitecturePage';
import UgcImagePage from './components/projects/UgcImagePage';
import ProductPhotoPage from './components/projects/ProductPhotoPage';
import FamilyPhotoPage from './components/projects/FamilyPhotoPage';
import WeddingPhotoPage from './components/projects/WeddingPhotoPage';
import PhotoBoothPage from './components/projects/PhotoBoothPage';
import PhotoEditPage from './components/projects/PhotoEditPage';
import ImageAnalysisPage from './components/projects/ImageAnalysisPage';
import AudioTranscriptionPage from './components/projects/AudioTranscriptionPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage navigateTo={navigateTo} />;
      case 'coloring':
        return <ColoringBookPage navigateTo={navigateTo} />;
      case 'story':
        return <StoryBookPage navigateTo={navigateTo} />;
      case 'worksheet':
        return <WorksheetPage navigateTo={navigateTo} />;
      case 'interior':
        return <InteriorDesignPage navigateTo={navigateTo} />;
      case 'architecture':
        return <ArchitecturePage navigateTo={navigateTo} />;
      case 'ugc':
        return <UgcImagePage navigateTo={navigateTo} />;
      case 'product':
        return <ProductPhotoPage navigateTo={navigateTo} />;
      case 'family':
        return <FamilyPhotoPage navigateTo={navigateTo} />;
      case 'wedding':
        return <WeddingPhotoPage navigateTo={navigateTo} />;
      case 'photobooth':
        return <PhotoBoothPage navigateTo={navigateTo} />;
      case 'edit':
        return <PhotoEditPage navigateTo={navigateTo} />;
      case 'image-analysis':
        return <ImageAnalysisPage navigateTo={navigateTo} />;
      case 'audio-transcription':
        return <AudioTranscriptionPage navigateTo={navigateTo} />;
      default:
        return <HomePage navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;