
import React from 'react';
import { Page } from '../types';
import BackButton from './BackButton';

interface ProjectPageLayoutProps {
  title: string;
  description: string;
  navigateTo: (page: Page) => void;
  children: React.ReactNode;
}

const ProjectPageLayout: React.FC<ProjectPageLayoutProps> = ({ title, description, navigateTo, children }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <BackButton navigateTo={navigateTo} />
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-slate-800">{title}</h2>
        <p className="text-lg text-slate-600 mt-2">{description}</p>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
        {children}
      </div>
    </div>
  );
};

export default ProjectPageLayout;
