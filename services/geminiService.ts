import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper to extract base64 data and mime type from data URL
const parseDataUrl = (dataUrl: string): { data: string; mimeType: string } | null => {
    const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!match) return null;
    return { mimeType: match[1], data: match[2] };
};

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error("Failed to convert blob to base64"));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const generateText = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    console.error("Error generating text:", error);
    throw new Error("Failed to generate text from Gemini API.");
  }
};

// FIX: Updated generateImage to handle both standard and "pro" image generation.
// It now accepts an optional imageSize parameter to select a higher-quality model.
export const generateImage = async (
    prompt: string, 
    aspectRatio: string,
    uploadedImages?: string[], // Array of data URLs
    imageSize?: '1K' | '2K' | '4K'
): Promise<{ imageUrl?: string, text?: string }> => {
    try {
        const parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = [];

        if (uploadedImages && uploadedImages.length > 0) {
            for (const imageUrl of uploadedImages) {
                const parsed = parseDataUrl(imageUrl);
                if (parsed) {
                    parts.push({
                        inlineData: {
                            mimeType: parsed.mimeType,
                            data: parsed.data,
                        },
                    });
                }
            }
        }
        
        parts.push({ text: prompt });

        const model = imageSize ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
        
        const imageConfig: { aspectRatio: string; imageSize?: '1K' | '2K' | '4K' } = {
            aspectRatio: aspectRatio,
        };
        if (imageSize) {
            imageConfig.imageSize = imageSize;
        }

        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: parts,
            },
            config: {
                imageConfig: imageConfig,
            },
        });

        let imageUrl: string | undefined;
        let text: string | undefined;

        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64EncodeString: string = part.inlineData.data;
                    imageUrl = `data:image/png;base64,${base64EncodeString}`;
                } else if (part.text) {
                    text = part.text;
                }
            }
        }
        
        if (!imageUrl && !text) {
             throw new Error("No content generated.");
        }

        return { imageUrl, text };
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image from Gemini API.");
    }
};

export const analyzeImage = async (prompt: string, image: string): Promise<string> => {
    try {
        const parsedImage = parseDataUrl(image);
        if (!parsedImage) {
            throw new Error("Invalid image format.");
        }

        const parts = [
            { inlineData: { mimeType: parsedImage.mimeType, data: parsedImage.data } },
            { text: prompt }
        ];

        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: { parts },
        });

        return response.text || "Tidak ada analisis yang dihasilkan.";
    } catch (error) {
        console.error("Error analyzing image:", error);
        throw new Error("Failed to analyze image with Gemini API.");
    }
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    try {
        const audioData = await blobToBase64(audioBlob);
        const audioPart = {
            inlineData: {
                mimeType: audioBlob.type,
                data: audioData,
            },
        };
        const promptPart = {
            text: "Transcribe this audio.",
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [promptPart, audioPart] },
        });
        
        return response.text || "Tidak dapat mentranskripsikan audio.";
    } catch (error) {
        console.error("Error transcribing audio:", error);
        throw new Error("Failed to transcribe audio with Gemini API.");
    }
};

export const startChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: 'You are Picaa, a friendly and helpful AI assistant for a creative suite. Answer user questions and help them solve problems related to the app\'s features like creating coloring books, stories, designs, and photos. Be concise and supportive.',
    },
  });
};

export const sendMessageStream = (chat: Chat, message: string): Promise<AsyncGenerator<GenerateContentResponse>> => {
    return chat.sendMessageStream({ message });
};