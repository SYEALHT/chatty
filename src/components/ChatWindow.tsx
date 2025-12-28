'use client';

import { Message } from '@/types';
import { useEffect, useRef, useState } from 'react';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  avatarName: string;
  avatarPersonality?: string;
  avatarId?: string;
  personalPhotoUrl?: string;
  onPhotoGenerated?: (photoUrl: string) => void;
}

export default function ChatWindow({ 
  messages, 
  isLoading, 
  avatarName,
  avatarPersonality,
  avatarId,
  personalPhotoUrl,
  onPhotoGenerated
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPhoto, setIsGeneratingPhoto] = useState(false);
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [photoInput, setPhotoInput] = useState('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSavePersonalPhoto = async () => {
    if (!avatarId || !photoInput.trim()) return;

    setIsGeneratingPhoto(true);
    try {
      const res = await fetch('/api/avatars/photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarId, personalPhotoUrl: photoInput }),
      });

      if (res.ok) {
        const data = await res.json();
        onPhotoGenerated?.(photoInput);
        setPhotoInput('');
        setShowPhotoInput(false);
      }
    } catch (error) {
      console.error('Failed to save personal photo:', error);
    } finally {
      setIsGeneratingPhoto(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/50">
      {/* Header - Avatar Info */}
      <div className="px-8 py-12 text-center border-b border-slate-800">
        {/* Avatar Photo Section */}
        <div className="flex justify-center mb-6">
          {personalPhotoUrl ? (
            <img 
              src={personalPhotoUrl} 
              alt={avatarName}
              className="w-24 h-24 rounded-lg object-cover shadow-lg border border-slate-700"
            />
          ) : (
            <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center shadow-lg border border-slate-700">
              <span className="text-4xl font-light text-white">
                {avatarName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <p className="text-xs font-semibold tracking-widest text-slate-500 mb-4 uppercase">
          Fragment of mind created
        </p>
        <h1 className="text-5xl font-light italic text-white mb-3 font-serif">
          {avatarName}
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed mb-4">
          {avatarPersonality}
        </p>

        {/* Photo Controls */}
        <div className="flex gap-2 justify-center flex-wrap">
          {!showPhotoInput ? (
            <button
              onClick={() => setShowPhotoInput(true)}
              disabled={isGeneratingPhoto || isLoading}
              className="text-xs px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors disabled:opacity-50"
            >
              📸 Add Personal Photo
            </button>
          ) : (
            <div className="w-full max-w-sm">
              <input
                type="text"
                placeholder="Paste photo URL..."
                value={photoInput}
                onChange={(e) => setPhotoInput(e.target.value)}
                className="w-full px-3 py-1 text-xs rounded bg-slate-700 text-white placeholder-slate-400 border border-slate-600 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex gap-2 mt-2 justify-center">
                <button
                  onClick={handleSavePersonalPhoto}
                  disabled={isGeneratingPhoto || !photoInput.trim()}
                  className="text-xs px-3 py-1 rounded bg-green-600 hover:bg-green-500 text-white transition-colors disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowPhotoInput(false);
                    setPhotoInput('');
                  }}
                  className="text-xs px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-slate-400 text-sm">
                Begin your conversation
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-md ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                {msg.role === 'avatar' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">
                      {avatarName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Message */}
                <div>
                  <div
                    className={`px-4 py-3 rounded-lg text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-100 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.imageUrl && (
                    <img 
                      src={msg.imageUrl}
                      alt="Generated image"
                      className="mt-2 max-w-sm rounded-lg shadow-lg border border-slate-700"
                    />
                  )}
                  <p className="text-xs text-slate-500 mt-2">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex-shrink-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  {avatarName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="bg-slate-800 px-4 py-3 rounded-lg rounded-bl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
