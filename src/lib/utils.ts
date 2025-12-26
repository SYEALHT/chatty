import { Avatar } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export function createDefaultAvatar(name: string): Avatar {
  return {
    id: uuidv4(),
    name,
    personality: 'Warm, thoughtful, curious about connecting with people.',
    traits: ['empathetic', 'thoughtful', 'present'],
    communicationStyle: 'expressive',
    emotionalDepth: 7,
    backstory: `I'm ${name}, a digital companion designed to be genuinely present in our conversations. I remember what matters to you and grow with every interaction.`,
    memoryEnabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function sanitizeAvatarName(name: string): string {
  return name.trim().substring(0, 50);
}

export function validateAvatar(avatar: Avatar): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!avatar.name || avatar.name.trim().length === 0) {
    errors.push('Avatar name is required');
  }

  if (avatar.emotionalDepth < 1 || avatar.emotionalDepth > 10) {
    errors.push('Emotional depth must be between 1 and 10');
  }

  if (avatar.traits.length === 0) {
    errors.push('At least one trait is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
