'use client';

import { useState, useEffect } from 'react';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import AvatarBuilder from '@/components/AvatarBuilder';
import { Avatar, Message } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);

  const selectedAvatar = avatars.find((a) => a.id === selectedAvatarId);

  useEffect(() => {
    fetchAvatars();
  }, []);

  const fetchAvatars = async () => {
    try {
      const res = await fetch('/api/avatars');
      const data = await res.json();
      setAvatars(data.avatars || []);
      if (data.avatars?.length > 0) {
        setSelectedAvatarId(data.avatars[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch avatars:', error);
    }
  };

  const handleCreateAvatar = async (avatar: Avatar) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/avatars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', avatar }),
      });

      if (res.ok) {
        const data = await res.json();
        setAvatars([...avatars, data.avatar]);
        setSelectedAvatarId(data.avatar.id);
        setShowBuilder(false);
        setMessages([]);
        setConversationHistory([]);
      }
    } catch (error) {
      console.error('Failed to create avatar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedAvatar) return;

    const userMessage: Message = {
      id: uuidv4(),
      conversationId: selectedAvatarId!,
      avatarId: selectedAvatarId!,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setConversationHistory((prev) => [...prev, { role: 'user', content }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avatarId: selectedAvatarId,
          message: content,
          conversationHistory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const avatarMessage: Message = {
          id: uuidv4(),
          conversationId: selectedAvatarId!,
          avatarId: selectedAvatarId!,
          role: 'avatar',
          content: data.response,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, avatarMessage]);
        setConversationHistory((prev) => [...prev, { role: 'assistant', content: data.response }]);
      }
    } catch (error) {
      console.error('Failed to get response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showBuilder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <button
          onClick={() => setShowBuilder(false)}
          className="mb-8 text-slate-400 hover:text-white transition-colors"
        >
          ← Back
        </button>
        <AvatarBuilder onComplete={handleCreateAvatar} isLoading={isLoading} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex h-screen">
        <div className="w-64 bg-slate-800 border-r border-slate-700 p-4 flex flex-col">
          <h1 className="text-2xl font-bold text-white mb-6">Chatty</h1>

          <button
            onClick={() => setShowBuilder(true)}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg mb-4 transition-all"
          >
            + New Avatar
          </button>

          <div className="flex-1 overflow-y-auto space-y-2">
            {avatars.length === 0 ? (
              <p className="text-slate-400 text-sm text-center mt-8">
                No avatars yet. Create one to get started!
              </p>
            ) : (
              avatars.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => {
                    setSelectedAvatarId(avatar.id);
                    setMessages([]);
                    setConversationHistory([]);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    selectedAvatarId === avatar.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <p className="font-semibold">{avatar.name}</p>
                  <p className="text-xs opacity-70">{avatar.traits.join(', ')}</p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedAvatar ? (
            <>
              <ChatWindow
                messages={messages}
                isLoading={isLoading}
                avatarName={selectedAvatar.name}
              />
              <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <p className="text-lg font-semibold text-purple-300 mb-4">
                  Welcome to Chatty
                </p>
                <p className="text-slate-400 mb-8">
                  Create your first avatar or select one from the sidebar to start chatting.
                </p>
                <button
                  onClick={() => setShowBuilder(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all"
                >
                  Create Avatar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
