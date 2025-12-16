
import React, { useState, useRef } from 'react';
import { Page } from '../../types';
import { transcribeAudio } from '../../services/geminiService';
import Loader from '../Loader';
import ProjectPageLayout from '../ProjectPageLayout';
import { MicrophoneIcon } from '../icons/Icons';

const AudioTranscriptionPage: React.FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    setError('');
    setTranscript('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = async () => {
        setLoading(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];
        try {
          const result = await transcribeAudio(audioBlob);
          setTranscript(result);
        } catch (err) {
          setError('Gagal mentranskripsikan audio. Coba lagi.');
        } finally {
            setLoading(false);
            // Stop all tracks to turn off the microphone indicator
            stream.getTracks().forEach(track => track.stop());
        }
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      setError('Tidak dapat mengakses mikrofon. Pastikan Anda telah memberikan izin.');
      console.error(err);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <ProjectPageLayout
      title="Transkripsi Audio"
      description="Ubah ucapan menjadi teks dengan mudah menggunakan AI."
      navigateTo={navigateTo}
    >
      <div className="flex flex-col items-center space-y-6">
        <p className="text-slate-600 text-center">
          Tekan tombol rekam untuk mulai berbicara. Tekan berhenti setelah selesai untuk mendapatkan transkripsi.
        </p>
        
        <div className="flex items-center space-x-4">
            {!isRecording ? (
                <button 
                    onClick={handleStartRecording} 
                    disabled={loading}
                    className="flex items-center justify-center bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors disabled:bg-slate-400"
                    aria-label="Start Recording"
                >
                    <MicrophoneIcon className="w-6 h-6 mr-2"/>
                    Rekam
                </button>
            ) : (
                <button 
                    onClick={handleStopRecording} 
                    className="flex items-center justify-center bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors"
                    aria-label="Stop Recording"
                >
                    <div className="w-6 h-6 mr-2 flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                    </div>
                    Berhenti
                </button>
            )}
        </div>
        
        {isRecording && (
             <div className="flex items-center text-red-500">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                <span>Merekam...</span>
            </div>
        )}

      </div>

      {error && <p className="text-red-500 mt-6 text-center">{error}</p>}
      
      <div className="mt-8">
        {loading && <Loader message="Mentranskripsikan..." />}
        {transcript && (
          <div className="prose max-w-none p-4 bg-secondary rounded-lg mt-4 border border-primary/20">
              <h3 className="font-semibold text-lg">Hasil Transkripsi:</h3>
              <p className="whitespace-pre-wrap">{transcript}</p>
          </div>
        )}
      </div>
    </ProjectPageLayout>
  );
};

export default AudioTranscriptionPage;