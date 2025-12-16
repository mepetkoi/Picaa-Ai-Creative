
import React, { useState } from 'react';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import { ArrowDownTrayIcon } from './icons/Icons';

export interface ImageInfo {
    url: string;
    filename: string;
}

type DownloadFormat = 'png' | 'jpg' | 'pdf';

interface DownloadControllerProps {
    getImages: () => ImageInfo[];
    projectName: string;
}

const DownloadController: React.FC<DownloadControllerProps> = ({ getImages, projectName }) => {
    const [format, setFormat] = useState<DownloadFormat>('png');
    const [isDownloading, setIsDownloading] = useState(false);

    const getFinalImageBlob = async (url: string, format: 'png' | 'jpg'): Promise<Blob> => {
        if (format === 'png' && url.startsWith('data:image/png')) {
            const res = await fetch(url);
            return await res.blob();
        }

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return reject(new Error('Could not get canvas context'));
                }
                if (format === 'jpg') {
                    // Add a white background for JPGs to avoid black background on transparent PNGs
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Canvas toBlob failed'));
                    }
                }, `image/${format}`, format === 'jpg' ? 0.9 : undefined);
            };
            img.onerror = (err) => reject(err);
            img.src = url;
        });
    };
    
    const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    const handleDownload = async () => {
        setIsDownloading(true);
        const images = getImages();
        if (images.length === 0) {
            setIsDownloading(false);
            return;
        }

        try {
            if (format === 'pdf') {
                const doc = new jsPDF({ orientation: 'p', unit: 'px', format: 'a4' });
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                const margin = 20;

                for (let i = 0; i < images.length; i++) {
                    if (i > 0) doc.addPage();
                    const imgData = await getFinalImageBlob(images[i].url, 'png'); // Use PNG for PDF for quality
                    const blobUrl = URL.createObjectURL(imgData);
                    
                    const dims = await getImageDimensions(blobUrl);
                    const ratio = dims.width / dims.height;

                    let imgWidth = pageWidth - margin * 2;
                    let imgHeight = imgWidth / ratio;

                    if (imgHeight > pageHeight - margin * 2) {
                        imgHeight = pageHeight - margin * 2;
                        imgWidth = imgHeight * ratio;
                    }

                    const x = (pageWidth - imgWidth) / 2;
                    const y = (pageHeight - imgHeight) / 2;

                    doc.addImage(blobUrl, 'PNG', x, y, imgWidth, imgHeight);
                    URL.revokeObjectURL(blobUrl);
                }
                doc.save(`${projectName}.pdf`);
            } else {
                const zip = new JSZip();
                const promises = images.map(async (image) => {
                    const blob = await getFinalImageBlob(image.url, format);
                    const filename = image.filename.replace(/\.[^/.]+$/, `.${format}`);
                    zip.file(filename, blob);
                });

                await Promise.all(promises);
                const zipBlob = await zip.generateAsync({ type: 'blob' });

                const link = document.createElement('a');
                link.href = URL.createObjectURL(zipBlob);
                link.download = `${projectName}.zip`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            }
        } catch (error) {
            console.error("Download failed:", error);
            alert("Gagal mengunduh file. Silakan coba lagi.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="mt-8 mb-6 p-4 bg-secondary rounded-lg border border-primary/20">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <div className="flex items-center gap-2">
                    <ArrowDownTrayIcon className="w-6 h-6 text-primary" />
                    <label htmlFor="format-select" className="font-semibold text-slate-700">Download Semua Hasil</label>
                 </div>
                <select
                    id="format-select"
                    value={format}
                    onChange={(e) => setFormat(e.target.value as DownloadFormat)}
                    className="p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary bg-white"
                    aria-label="Pilih format download"
                >
                    <option value="png">PNG</option>
                    <option value="jpg">JPG</option>
                    <option value="pdf">PDF</option>
                </select>
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-slate-400 w-full sm:w-auto"
                >
                    {isDownloading ? 'Mengunduh...' : `Unduh (.${format === 'pdf' ? 'pdf' : 'zip'})`}
                </button>
            </div>
        </div>
    );
};

export default DownloadController;
