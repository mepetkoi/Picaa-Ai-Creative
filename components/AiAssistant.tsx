
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { startChat, sendMessageStream } from '../services/geminiService';
import { PaperAirplaneIcon, SparklesIcon } from './icons/Icons';
import type { Chat } from '@google/genai';

const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatRef.current = startChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const modelMessage: ChatMessage = { role: 'model', text: '' };
    setMessages(prev => [...prev, modelMessage]);

    try {
        if (chatRef.current) {
            const stream = await sendMessageStream(chatRef.current, input);
            let text = '';
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                if(chunkText) {
                    text += chunkText;
                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1].text = text;
                        return newMessages;
                    });
                }
            }
        }
    } catch (error) {
      console.error(error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length-1].text = "Maaf, terjadi kesalahan. Coba lagi nanti.";
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6">
      <div className="flex items-center mb-4">
        <SparklesIcon className="w-6 h-6 text-primary mr-2" />
        <h3 className="text-xl font-semibold">AI Assistant</h3>
      </div>
      <div className="h-64 overflow-y-auto pr-2 mb-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-secondary text-slate-800'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
         {isLoading && messages[messages.length - 1]?.role === 'model' && messages[messages.length - 1]?.text === '' && (
          <div className="flex justify-start">
            <div className="bg-secondary text-slate-800 px-4 py-2 rounded-xl">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanya apa saja..."
          className="flex-grow p-3 border border-slate-300 rounded-l-lg focus:ring-2 focus:ring-primary focus:outline-none bg-white"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-primary text-white p-3 rounded-r-lg disabled:bg-slate-400 hover:bg-primary-dark transition-colors"
        >
          <PaperAirplaneIcon className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default AiAssistant;
