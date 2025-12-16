
import type { ReactNode } from 'react';

export type Page =
  | 'home'
  | 'coloring'
  | 'story'
  | 'worksheet'
  | 'interior'
  | 'architecture'
  | 'ugc'
  | 'product'
  | 'family'
  | 'wedding'
  | 'photobooth'
  | 'edit'
  | 'image-analysis'
  | 'audio-transcription';

export interface Project {
  id: Page;
  title: string;
  description: string;
  // FIX: Use ReactNode to avoid global JSX namespace issues in a .ts file.
  icon: ReactNode;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface GenerationResult {
    imageUrl?: string;
    text?: string;
}