
import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left w-full border border-slate-200 flex flex-col items-start"
    >
      <div className="bg-secondary p-3 rounded-full mb-4">
        {project.icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">{project.title}</h3>
      <p className="text-slate-500 text-sm flex-grow">{project.description}</p>
    </button>
  );
};

export default ProjectCard;
