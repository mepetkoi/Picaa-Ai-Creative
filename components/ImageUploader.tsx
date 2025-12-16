
import React, { useRef, useState } from 'react';
import { ArrowUpTrayIcon, XCircleIcon } from './icons/Icons';

// Constants for validation
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

interface ImageUploaderProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
    maxImages?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onImagesChange, maxImages = 4 }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;
        
        setError(null); // Clear previous errors

        const filesToProcess = Array.from(files).slice(0, maxImages - images.length);
        
        if (files.length > 0 && filesToProcess.length === 0) {
            setError(`Anda hanya dapat mengunggah maksimal ${maxImages} gambar.`);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // Perform validation before reading files
        for (const file of filesToProcess) {
            if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                setError(`Format file tidak didukung. Harap gunakan PNG, JPG, atau WEBP.`);
                if (fileInputRef.current) fileInputRef.current.value = '';
                return; // Stop processing
            }
            if (file.size > MAX_FILE_SIZE_BYTES) {
                setError(`Ukuran file melebihi batas ${MAX_FILE_SIZE_MB}MB.`);
                if (fileInputRef.current) fileInputRef.current.value = '';
                return; // Stop processing
            }
        }
        
        const newImages = [...images];
        let filesProcessed = 0;

        if (filesToProcess.length === 0) {
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        filesToProcess.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (typeof e.target?.result === 'string') {
                    newImages.push(e.target.result);
                }
                filesProcessed++;
                if (filesProcessed === filesToProcess.length) {
                    onImagesChange(newImages);
                }
            };
            reader.readAsDataURL(file);
        });

        // Clear the input value to allow re-uploading the same file
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveImage = (index: number) => {
        onImagesChange(images.filter((_, i) => i !== index));
        setError(null); // Clear error when an image is removed
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };
    
    const renderSlots = () => {
        const slots = [];
        for (let i = 0; i < maxImages; i++) {
            if (i < images.length) {
                slots.push(
                    <div key={i} className="relative aspect-square">
                        <img src={images[i]} alt={`upload-preview-${i}`} className="w-full h-full object-cover rounded-lg" />
                        <button
                            onClick={() => handleRemoveImage(i)}
                            className="absolute -top-2 -right-2 bg-white rounded-full text-red-500 hover:text-red-700 transition-colors"
                            aria-label={`Remove image ${i + 1}`}
                        >
                            <XCircleIcon className="w-7 h-7" />
                        </button>
                    </div>
                );
            } else if (i === images.length) {
                slots.push(
                    <button
                        key="uploader"
                        onClick={triggerFileInput}
                        className="aspect-square w-full border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-primary transition-colors"
                        aria-label="Upload images"
                    >
                        <ArrowUpTrayIcon className="w-8 h-8 mb-1" />
                        <span className="text-sm font-semibold">Unggah</span>
                    </button>
                );
            } else {
                 slots.push(
                    <div key={i} className="aspect-square w-full border-2 border-dashed border-slate-200 rounded-lg bg-slate-50"></div>
                );
            }
        }
        return slots;
    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept={ALLOWED_FILE_TYPES.join(',')}
                multiple
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               {renderSlots()}
            </div>
            {error && (
                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}
        </div>
    );
};

export default ImageUploader;
