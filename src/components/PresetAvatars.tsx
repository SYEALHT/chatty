'use client';

import { PRESET_AVATARS, PRESET_AVATAR_COLORS } from '@/lib/presetAvatars';
import { Avatar } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface PresetAvatarsProps {
  onSelectPreset: (avatar: Avatar) => void;
  isLoading: boolean;
}

export default function PresetAvatars({ onSelectPreset, isLoading }: PresetAvatarsProps) {
  const handleSelectPreset = (presetAvatar: typeof PRESET_AVATARS[0]) => {
    const newAvatar: Avatar = {
      id: uuidv4(),
      ...presetAvatar,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onSelectPreset(newAvatar);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Meet Your Companions</h2>
        <p className="text-slate-300">Choose a preset character to get started instantly, or create your own.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRESET_AVATARS.map((preset) => {
          const colors = PRESET_AVATAR_COLORS[preset.name];
          return (
            <div
              key={preset.name}
              onClick={() => !isLoading && handleSelectPreset(preset)}
              className={`group cursor-pointer rounded-lg p-6 border border-slate-700 transition-all duration-300 hover:border-slate-500 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-slate-900/50'
              } bg-gradient-to-br from-slate-800/50 to-slate-900/50`}
            >
              {/* Color indicator */}
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colors.primary} mb-4 opacity-80 group-hover:opacity-100 transition-opacity`} />

              {/* Name */}
              <h3 className="text-xl font-bold text-white mb-2">{preset.name}</h3>

              {/* Personality snippet */}
              <p className={`text-sm ${colors.accent} mb-4 line-clamp-2`}>{preset.personality}</p>

              {/* Traits */}
              <div className="mb-4 flex flex-wrap gap-2">
                {preset.traits.slice(0, 3).map((trait) => (
                  <span
                    key={trait}
                    className={`text-xs px-2 py-1 rounded-full bg-slate-700/50 border border-slate-600 text-slate-300 group-hover:border-slate-500 transition-colors`}
                  >
                    {trait}
                  </span>
                ))}
                {preset.traits.length > 3 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-700/50 border border-slate-600 text-slate-400">
                    +{preset.traits.length - 3}
                  </span>
                )}
              </div>

              {/* Communication style */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  {preset.communicationStyle.charAt(0).toUpperCase() + preset.communicationStyle.slice(1)}
                </span>
                <span className="text-slate-400">
                  Depth: {preset.emotionalDepth}/10
                </span>
              </div>

              {/* Hover action */}
              <div className="mt-4 pt-4 border-t border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  disabled={isLoading}
                  className={`w-full py-2 rounded font-semibold text-sm bg-gradient-to-r ${colors.primary} text-white hover:opacity-90 transition-opacity disabled:opacity-50`}
                >
                  Select {preset.name}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create custom section */}
      <div className="mt-8 p-6 rounded-lg border border-dashed border-slate-600 bg-slate-800/30 text-center">
        <p className="text-slate-300 mb-4">Want someone completely unique?</p>
        <p className="text-sm text-slate-400">Create a custom avatar with your own personality traits and backstory.</p>
      </div>
    </div>
  );
}
