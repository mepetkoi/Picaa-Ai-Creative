
import React from 'react';
import { Page } from '../types';
import { PROJECTS } from '../constants';
import ProjectCard from './ProjectCard';
import AiAssistant from './AiAssistant';

interface HomePageProps {
  navigateTo: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigateTo }) => {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Selamat Datang di Picaa!</h2>
        <p className="text-lg text-slate-600">Pilih proyek untuk memulai atau tanyakan sesuatu pada asisten AI kami.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} onClick={() => navigateTo(project.id)} />
        ))}
      </div>

      <AiAssistant />
    </div>
  );
};

export default HomePage;
