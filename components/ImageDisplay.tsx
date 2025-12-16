
import React from 'react';
import { ArrowDownTrayIcon } from './icons/Icons';

interface ImageDisplayProps {
  imageUrl: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl }) => {
  return (
    <div className="relative group">
      <img src={imageUrl} alt="Generated content" className="rounded-lg shadow-lg w-full" />
      <a
        href={imageUrl}
        download="picaa-generation.png"
        className="absolute bottom-4 right-4 bg-primary text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary-dark"
        aria-label="Download Image"
      >
        <ArrowDownTrayIcon className="w-6 h-6" />
      </a>
    </div>
  );
};

export default ImageDisplay;
