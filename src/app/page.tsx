'use client';

import { useState, useEffect } from 'react';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import AvatarBuilder from '@/components/AvatarBuilder';
import PresetAvatars from '@/components/PresetAvatars';
import { Avatar, Message } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  
  // Store conversation history for each avatar
  const [conversationsByAvatar, setConversationsByAvatar] = useState<{
    [avatarId: string]: { messages: Message[]; history: any[] };
  }>({});

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
          imageUrl: data.imageUrl,
          hasImage: data.hasImage || false,
        };

        setMessages((prev) => [...prev, avatarMessage]);
        setConversationHistory((prev) => [...prev, { role: 'assistant', content: data.response }]);
        
        // Save conversation for this avatar
        setConversationsByAvatar((prev) => ({
          ...prev,
          [selectedAvatarId!]: { 
            messages: [...messages, userMessage, avatarMessage], 
            history: [...conversationHistory, { role: 'user', content }, { role: 'assistant', content: data.response }]
          },
        }));
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-950">
      <div className="flex h-screen">
        <div className="w-64 bg-gradient-to-b from-slate-900/80 to-black border-r border-slate-800 p-4 flex flex-col">
          <h1 className="text-2xl font-light italic text-white mb-8 font-serif">Chatty</h1>

          <button
            onClick={() => {
              setSelectedAvatarId(null);
              setMessages([]);
              setConversationHistory([]);
              setShowBuilder(false);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mb-6 transition-all text-sm"
          >
            + New Avatar
          </button>

          <div className="flex-1 overflow-y-auto space-y-2">
            {avatars.length === 0 ? (
              <p className="text-slate-400 text-xs text-center mt-8">
                No avatars yet. Create one to get started!
              </p>
            ) : (
              avatars.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => {
                    // Save current conversation before switching
                    if (selectedAvatarId) {
                      setConversationsByAvatar((prev) => ({
                        ...prev,
                        [selectedAvatarId]: { messages, history: conversationHistory },
                      }));
                    }
                    
                    // Switch to new avatar and restore its conversation
                    setSelectedAvatarId(avatar.id);
                    const savedConversation = conversationsByAvatar[avatar.id];
                    if (savedConversation) {
                      setMessages(savedConversation.messages);
                      setConversationHistory(savedConversation.history);
                    } else {
                      setMessages([]);
                      setConversationHistory([]);
                    }
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm ${
                    selectedAvatarId === avatar.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800/30 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <p className="font-semibold text-sm">{avatar.name}</p>
                  <p className="text-xs opacity-60 mt-1">{avatar.traits.slice(0, 2).join(', ')}</p>
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
                avatarPersonality={selectedAvatar.personality}
                avatarId={selectedAvatarId || undefined}
                personalPhotoUrl={selectedAvatar.personalPhotoUrl}
                onPhotoGenerated={(photoUrl) => {
                  // Update avatar with new photo
                  const updatedAvatars = avatars.map(a => 
                    a.id === selectedAvatarId 
                      ? { ...a, personalPhotoUrl: photoUrl }
                      : a
                  );
                  setAvatars(updatedAvatars);
                }}
              />
              <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
            </>
          ) : showBuilder ? null : (
            <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-slate-800 to-slate-900">
              <PresetAvatars 
                onSelectPreset={handleCreateAvatar} 
                onCreateCustom={() => setShowBuilder(true)}
                isLoading={isLoading} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
