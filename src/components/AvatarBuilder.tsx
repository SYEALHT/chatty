'use client';

import { Avatar } from '@/types';
import { useState } from 'react';

interface AvatarBuilderProps {
  onComplete: (avatar: Avatar) => void;
  isLoading: boolean;
}

export default function AvatarBuilder({ onComplete, isLoading }: AvatarBuilderProps) {
  const [step, setStep] = useState<'name' | 'personality' | 'traits' | 'style' | 'review'>(
    'name'
  );
  const [avatar, setAvatar] = useState<Partial<Avatar>>({
    emotionalDepth: 7,
    communicationStyle: 'expressive',
    memoryEnabled: true,
  });

  const [nameInput, setNameInput] = useState('');
  const [personalityInput, setPersonalityInput] = useState('');
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

  const traits = [
    'empathetic',
    'playful',
    'mysterious',
    'calm',
    'intense',
    'thoughtful',
    'curious',
    'warm',
    'witty',
    'gentle',
  ];

  const styles: Array<'short' | 'expressive' | 'poetic' | 'casual' | 'formal'> = [
    'short',
    'expressive',
    'poetic',
    'casual',
    'formal',
  ];

  const handleNameNext = () => {
    if (nameInput.trim()) {
      setAvatar({ ...avatar, name: nameInput.trim() });
      setStep('personality');
    }
  };

  const handlePersonalityNext = () => {
    if (personalityInput.trim()) {
      setAvatar({ ...avatar, personality: personalityInput.trim() });
      setStep('traits');
    }
  };

  const handleTraitToggle = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(selectedTraits.filter((t) => t !== trait));
    } else {
      setSelectedTraits([...selectedTraits, trait]);
    }
  };

  const handleTraitsNext = () => {
    if (selectedTraits.length > 0) {
      setAvatar({ ...avatar, traits: selectedTraits });
      setStep('style');
    }
  };

  const handleStyleNext = () => {
    setStep('review');
  };

  const handleComplete = async () => {
    const finalAvatar: Avatar = {
      id: Math.random().toString(36).substring(7),
      name: avatar.name || 'Unknown',
      personality: avatar.personality || '',
      traits: avatar.traits || [],
      communicationStyle: avatar.communicationStyle || 'expressive',
      emotionalDepth: avatar.emotionalDepth || 7,
      memoryEnabled: avatar.memoryEnabled !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onComplete(finalAvatar);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-8 flex items-center justify-between">
        {['name', 'personality', 'traits', 'style', 'review'].map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step === s
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : ['name', 'personality', 'traits', 'style', 'review'].indexOf(step) >
                      i
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 text-slate-400'
              }`}
            >
              {i + 1}
            </div>
            {i < 4 && <div className="w-12 h-1 bg-slate-700 mx-2" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
        {step === 'name' && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">What&apos;s their name?</h2>
            <p className="text-slate-400 mb-6">Let&apos;s start with something that feels right.</p>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g., Luna, Alex, Sage..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
              onKeyPress={(e) => e.key === 'Enter' && handleNameNext()}
            />
            <button
              onClick={handleNameNext}
              disabled={!nameInput.trim() || isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Continue
            </button>
          </div>
        )}

        {step === 'personality' && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Describe their personality.</h2>
            <p className="text-slate-400 mb-6">
              How do they come across? What&apos;s their essence?
            </p>
            <textarea
              value={personalityInput}
              onChange={(e) => setPersonalityInput(e.target.value)}
              placeholder="e.g., Warm, mysterious, playful, deeply thoughtful..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 h-24"
            />
            <div className="flex gap-4">
              <button
                onClick={() => setStep('name')}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Back
              </button>
              <button
                onClick={handlePersonalityNext}
                disabled={!personalityInput.trim() || isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 'traits' && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Pick their core traits.</h2>
            <p className="text-slate-400 mb-6">Select what resonates.</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {traits.map((trait) => (
                <button
                  key={trait}
                  onClick={() => handleTraitToggle(trait)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedTraits.includes(trait)
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {trait}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setStep('personality')}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Back
              </button>
              <button
                onClick={handleTraitsNext}
                disabled={selectedTraits.length === 0 || isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 'style' && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">How do they communicate?</h2>
            <p className="text-slate-400 mb-6">Short messages or detailed, poetic responses?</p>
            <div className="space-y-3 mb-6">
              {styles.map((style) => (
                <button
                  key={style}
                  onClick={() => setAvatar({ ...avatar, communicationStyle: style })}
                  className={`w-full px-4 py-3 rounded-lg font-semibold text-left transition-all ${
                    avatar.communicationStyle === style
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={avatar.memoryEnabled}
                  onChange={(e) => setAvatar({ ...avatar, memoryEnabled: e.target.checked })}
                  className="w-5 h-5 rounded bg-slate-700 border-slate-600"
                />
                <span className="text-slate-300">Enable memory (remember past conversations)</span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('traits')}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Back
              </button>
              <button
                onClick={handleStyleNext}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Review
              </button>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Meet {avatar.name}!</h2>

            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-6 mb-6 border border-purple-500/30">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Name</p>
                  <p className="text-white font-semibold">{avatar.name}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Communication</p>
                  <p className="text-white font-semibold">
                    {avatar.communicationStyle?.charAt(0).toUpperCase()}
                    {avatar.communicationStyle?.slice(1)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400 text-sm">Personality</p>
                  <p className="text-white">{avatar.personality}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400 text-sm">Traits</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {avatar.traits?.map((trait) => (
                      <span
                        key={trait}
                        className="bg-blue-600/50 text-blue-200 px-3 py-1 rounded-full text-sm"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400 text-sm">Memory</p>
                  <p className="text-white">{avatar.memoryEnabled ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('style')}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Edit
              </button>
              <button
                onClick={handleComplete}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Create {avatar.name}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
