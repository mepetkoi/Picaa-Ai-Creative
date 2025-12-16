
import React from 'react';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = "Generating... Please wait." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
       <div className="w-12 h-12 border-4 border-t-primary border-slate-200 rounded-full animate-spin"></div>
       <p className="text-slate-600">{message}</p>
    </div>
  );
};

export default Loader;
