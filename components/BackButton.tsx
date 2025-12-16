
import React from 'react';
import { Page } from '../types';
import { ArrowLeftIcon } from './icons/Icons';

interface BackButtonProps {
  navigateTo: (page: Page) => void;
}

const BackButton: React.FC<BackButtonProps> = ({ navigateTo }) => {
  return (
    <button
      onClick={() => navigateTo('home')}
      className="flex items-center text-primary hover:text-primary-dark font-semibold mb-6"
    >
      <ArrowLeftIcon className="w-5 h-5 mr-2" />
      Kembali ke Beranda
    </button>
  );
};

export default BackButton;
