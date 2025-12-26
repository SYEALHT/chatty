'use client';

import { Avatar } from '@/types';
import { useState } from 'react';

interface AvatarBuilderProps {
  onComplete: (avatar: Avatar) => void;
  isLoading: boolean;
}

type BuilderStep = 'style' | 'name' | 'personality' | 'traits' | 'communication' | 'review';

const AVATAR_STYLES = ['Mysterious', 'Playful', 'Empathetic', 'Intellectual', 'Passionate'];
const PERSONALITY_TYPES = [
  { name: 'Mysterious', desc: 'Enigmatic and thoughtful' },
  { name: 'Playful', desc: 'Spirited and fun' },
  { name: 'Empathetic', desc: 'Warm and caring' },
  { name: 'Intellectual', desc: 'Analytical and curious' },
  { name: 'Passionate', desc: 'Intense and bold' },
];
const TRAITS_OPTIONS = [
  'empathetic', 'playful', 'mysterious', 'calm', 'intense',
  'thoughtful', 'curious', 'warm', 'witty', 'gentle'
];
const COMMUNICATION_STYLES = ['short', 'expressive', 'poetic', 'casual', 'formal'] as const;

export default function AvatarBuilder({ onComplete, isLoading }: AvatarBuilderProps) {
  const [step, setStep] = useState<BuilderStep>('style');
  const [avatar, setAvatar] = useState<Partial<Avatar>>({
    emotionalDepth: 7,
    communicationStyle: 'expressive',
    memoryEnabled: true,
    traits: [],
  });
  const [nameInput, setNameInput] = useState('');
  const [personalityInput, setPersonalityInput] = useState('');
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

  const steps: BuilderStep[] = ['style', 'name', 'personality', 'traits', 'communication', 'review'];
  const currentStepIndex = steps.indexOf(step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleTraitToggle = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(selectedTraits.filter((t) => t !== trait));
    } else if (selectedTraits.length < 5) {
      setSelectedTraits([...selectedTraits, trait]);
    }
  };

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setStep(steps[prevIndex]);
    }
  };

  const handleComplete = async () => {
    const finalAvatar: Avatar = {
      id: Math.random().toString(36).substring(7),
      name: avatar.name || 'Unknown',
      personality: personalityInput,
      traits: selectedTraits,
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
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">{currentStepIndex + 1} of {steps.length}</p>
      </div>

      {/* Content */}
      <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700">
        {/* Style Selection */}
        {step === 'style' && (
          <div>
            <h2 className="text-3xl font-light italic text-white mb-2 font-serif">Choose a Vibe</h2>
            <p className="text-slate-400 mb-6">What aesthetic speaks to you?</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { name: 'Mysterious', color: 'from-purple-600 to-indigo-600', emoji: '🌙' },
                { name: 'Playful', color: 'from-pink-500 to-rose-500', emoji: '✨' },
                { name: 'Empathetic', color: 'from-green-500 to-emerald-500', emoji: '💫' },
                { name: 'Intellectual', color: 'from-blue-600 to-cyan-600', emoji: '🔮' },
              ].map((style) => (
                <button
                  key={style.name}
                  onClick={() => setAvatar({ ...avatar, name: style.name })}
                  className={`group relative overflow-hidden rounded-xl border-2 transition-all ${
                    avatar.name === style.name
                      ? 'border-pink-500'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className={`bg-gradient-to-br ${style.color} h-40 flex flex-col items-center justify-center`}>
                    <div className="text-5xl mb-2">{style.emoji}</div>
                    <div className="text-white font-semibold text-lg">{style.name}</div>
                  </div>
                  {avatar.name === style.name && (
                    <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                      <div className="text-3xl">✓</div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={!avatar.name || isLoading}
              className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Next
            </button>
          </div>
        )}

        {/* Name Input */}
        {step === 'name' && (
          <div>
            <h2 className="text-3xl font-light italic text-white mb-2 font-serif">What's their name?</h2>
            <p className="text-slate-400 mb-6">Choose something that feels right</p>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g., Luna, Echo, Sage..."
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 mb-6"
              onKeyPress={(e) => e.key === 'Enter' && nameInput.trim() && handleNext()}
            />
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Back
              </button>
              <button
                onClick={() => {
                  setAvatar({ ...avatar, name: nameInput.trim() });
                  handleNext();
                }}
                disabled={!nameInput.trim() || isLoading}
                className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Personality Selection */}
        {step === 'personality' && (
          <div>
            <h2 className="text-3xl font-light italic text-white mb-2 font-serif">Choose Personality</h2>
            <p className="text-slate-400 mb-6">Pick what resonates with you</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { name: 'Mysterious', desc: 'Enigmatic & thoughtful', color: 'from-purple-600 to-indigo-600', icon: '🌑' },
                { name: 'Playful', desc: 'Spirited & fun', color: 'from-pink-500 to-rose-500', icon: '🎭' },
                { name: 'Empathetic', desc: 'Warm & caring', color: 'from-green-500 to-emerald-500', icon: '💚' },
                { name: 'Intellectual', desc: 'Analytical & curious', color: 'from-blue-600 to-cyan-600', icon: '🧠' },
              ].map((p) => (
                <button
                  key={p.name}
                  onClick={() => setPersonalityInput(p.name)}
                  className={`group relative overflow-hidden rounded-xl border-2 transition-all ${
                    personalityInput === p.name
                      ? 'border-pink-500'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className={`bg-gradient-to-br ${p.color} h-40 flex flex-col items-center justify-center text-center px-4`}>
                    <div className="text-4xl mb-2">{p.icon}</div>
                    <div className="text-white font-semibold">{p.name}</div>
                    <div className="text-white/70 text-xs mt-1">{p.desc}</div>
                  </div>
                  {personalityInput === p.name && (
                    <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                      <div className="text-4xl">✓</div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!personalityInput || isLoading}
                className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Traits Selection */}
        {step === 'traits' && (
          <div>
            <h2 className="text-3xl font-light italic text-white mb-2 font-serif">Core Traits</h2>
            <p className="text-slate-400 mb-6">Choose up to 5 traits ({selectedTraits.length}/5)</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { name: 'empathetic', emoji: '💚' },
                { name: 'playful', emoji: '🎮' },
                { name: 'mysterious', emoji: '🌙' },
                { name: 'calm', emoji: '🧘' },
                { name: 'intense', emoji: '🔥' },
                { name: 'thoughtful', emoji: '🤔' },
                { name: 'curious', emoji: '🔍' },
                { name: 'warm', emoji: '☀️' },
                { name: 'witty', emoji: '⚡' },
                { name: 'gentle', emoji: '🌸' },
              ].map((trait) => (
                <button
                  key={trait.name}
                  onClick={() => handleTraitToggle(trait.name)}
                  disabled={selectedTraits.length >= 5 && !selectedTraits.includes(trait.name)}
                  className={`relative overflow-hidden rounded-lg border-2 py-4 px-2 transition-all text-center font-semibold ${
                    selectedTraits.includes(trait.name)
                      ? 'border-pink-500 bg-pink-500/20 text-white'
                      : 'border-slate-600 bg-slate-700/30 text-slate-300 hover:border-slate-500 disabled:opacity-30'
                  }`}
                >
                  <div className="text-2xl mb-1">{trait.emoji}</div>
                  <div className="text-xs">{trait.name}</div>
                  {selectedTraits.includes(trait.name) && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={selectedTraits.length === 0 || isLoading}
                className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Communication Style */}
        {step === 'communication' && (
          <div>
            <h2 className="text-3xl font-light italic text-white mb-2 font-serif">Communication Style</h2>
            <p className="text-slate-400 mb-6">How do they express themselves?</p>
            <div className="space-y-3 mb-6">
              {[
                { style: 'short' as const, desc: 'Brief, to the point', icon: '📝' },
                { style: 'expressive' as const, desc: 'Detailed and vivid', icon: '🎨' },
                { style: 'poetic' as const, desc: 'Lyrical and artistic', icon: '✒️' },
                { style: 'casual' as const, desc: 'Friendly and relaxed', icon: '💬' },
                { style: 'formal' as const, desc: 'Professional and refined', icon: '🎩' },
              ].map((item) => (
                <button
                  key={item.style}
                  onClick={() => setAvatar({ ...avatar, communicationStyle: item.style })}
                  className={`w-full px-4 py-4 rounded-lg border-2 text-left font-semibold transition-all flex items-center gap-4 ${
                    avatar.communicationStyle === item.style
                      ? 'border-pink-500 bg-pink-500/10 text-white'
                      : 'border-slate-600 bg-slate-700/30 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div className="text-3xl">{item.icon}</div>
                  <div>
                    <div className="font-semibold capitalize">{item.style}</div>
                    <div className="text-xs text-slate-400 font-normal">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <label className="flex items-center gap-3 text-slate-300 mb-6 cursor-pointer hover:text-white transition-all">
              <input
                type="checkbox"
                checked={avatar.memoryEnabled}
                onChange={(e) => setAvatar({ ...avatar, memoryEnabled: e.target.checked })}
                className="w-5 h-5 rounded bg-slate-700 border-slate-600 cursor-pointer"
              />
              <span className="text-sm">🧠 Remember our conversations</span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Review
              </button>
            </div>
          </div>
        )}

        {/* Review */}
        {step === 'review' && (
          <div>
            <h2 className="text-3xl font-light italic text-white mb-6 font-serif">Meet {avatar.name}!</h2>

            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg p-6 mb-6 border border-pink-500/30">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-xs mb-1">Name</p>
                  <p className="text-white font-semibold">{avatar.name}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Personality</p>
                  <p className="text-white font-semibold">{personalityInput}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Communication</p>
                  <p className="text-white font-semibold">{avatar.communicationStyle}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Memory</p>
                  <p className="text-white font-semibold">{avatar.memoryEnabled ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400 text-xs mb-2">Traits</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTraits.map((trait) => (
                      <span key={trait} className="bg-pink-600/50 text-pink-200 px-3 py-1 rounded-full text-xs">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Edit
              </button>
              <button
                onClick={handleComplete}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all"
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
