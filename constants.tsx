
import React from 'react';
import { Project } from './types';
import { 
    PaintBrushIcon, BookOpenIcon, AcademicCapIcon, HomeIcon, BuildingOfficeIcon, UserGroupIcon, CameraIcon, SparklesIcon, HeartIcon, TicketIcon, WandIcon, DocumentMagnifyingGlassIcon, MicrophoneIcon 
} from './components/icons/Icons';

export const PROJECTS: Project[] = [
  {
    id: 'image-analysis',
    title: 'Analisis Gambar',
    description: 'Unggah gambar dan ajukan pertanyaan tentang isinya kepada AI.',
    icon: <DocumentMagnifyingGlassIcon className="w-8 h-8 text-primary" />,
  },
  {
    id: 'audio-transcription',
    title: 'Transkripsi Audio',
    description: 'Rekam suara Anda dan ubah menjadi teks secara otomatis.',
    icon: <MicrophoneIcon className="w-8 h-8 text-primary" />,
  },
  {
    id: 'edit',
    title: 'Edit Foto',
    description: 'Unggah gambar dari perangkat Anda untuk diedit dan disempurnakan oleh AI.',
    icon: <WandIcon className="w-8 h-8 text-primary" />,
  },
  {
    id: 'coloring',
    title: 'Buku Mewarnai',
    description: 'Buat halaman mewarnai yang unik untuk anak-anak dan orang dewasa.',
    icon: <PaintBrushIcon className="w-8 h-8 text-primary" />,
  },
  {
    id: 'story',
    title: 'Buku Cerita',
    description: 'Hasilkan cerita anak-anak yang menarik dengan ilustrasi.',
    icon: <BookOpenIcon className="w-8 h-8 text-primary" />,
  },
  {
    id: 'worksheet',
    title: 'Worksheet Anak',
    description: 'Buat lembar kerja pendidikan untuk PAUD, TK, dan SD.',
    icon: <AcademicCapIcon className="w-8 h-8 text-primary" />,
  },
  {
    id: 'interior',
    title: 'Desain Interior',
    description: 'Dapatkan ide dan visualisasi desain interior untuk rumah Anda.',
    icon: <HomeIcon className="w-8 h-8 text-primary" />,
  },
  {
    id: 'architecture',
    title: 'Arsitektur',
    description: 'Rencanakan denah rumah impian Anda dengan detail dan ukuran.',
    icon: <BuildingOfficeIcon className="w-8 h-8 text-primary" />,
  },
  {
    id: 'ugc',
    title: 'Gambar UGC',
    description: 'Hasilkan gambar bergaya User-Generated Content untuk pemasaran.',
    icon: <UserGroupIcon className="w-8 h-8 text-primary" />,
  },
  {
    id: 'product',
    title: 'Foto Produk Profesional',
    description: 'Buat foto produk yang menakjubkan untuk e-commerce Anda.',
    icon: <CameraIcon className="w-8 h-8 text-primary" />,
  },
  {
    id: 'family',
    title: 'Foto Keluarga',
    description: 'Hasilkan potret keluarga yang indah dalam berbagai gaya.',
    icon: <HeartIcon className="w-8 h-8 text-primary" />,
  },
  {
    id: 'wedding',
    title: 'Foto Wedding',
    description: 'Ciptakan foto pernikahan romantis dan tak terlupakan.',
    icon: <SparklesIcon className="w-8 h-8 text-primary" />,
  },
  {
    id: 'photobooth',
    title: 'Photo Booth',
    description: 'Buat strip foto photo booth yang seru dan kreatif.',
    icon: <TicketIcon className="w-8 h-8 text-primary" />,
  },
];