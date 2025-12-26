'use client';

import { Message } from '@/types';
import { useEffect, useRef } from 'react';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  avatarName: string;
  avatarPersonality?: string;
}

export default function ChatWindow({ 
  messages, 
  isLoading, 
  avatarName,
  avatarPersonality 
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-black/50">
      {/* Header - Avatar Info */}
      <div className="px-8 py-12 text-center border-b border-slate-800">
        <p className="text-xs font-semibold tracking-widest text-slate-500 mb-4 uppercase">
          Fragment of mind created
        </p>
        <h1 className="text-5xl font-light italic text-white mb-3 font-serif">
          {avatarName}
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          {avatarPersonality}
        </p>
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
