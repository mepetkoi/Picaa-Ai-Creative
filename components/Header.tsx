
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-3xl font-bold text-primary">Picaa</h1>
        <p className="text-slate-500">Your AI-Powered Creative Suite</p>
      </div>
    </header>
  );
};

export default Header;
