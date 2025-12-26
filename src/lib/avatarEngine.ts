import { Avatar, Memory } from '@/types';

/**
 * Builds the system prompt for an avatar based on personality and memory
 */
export function buildAvatarSystemPrompt(avatar: Avatar, memories: Memory[]): string {
  const memoryContext = avatar.memoryEnabled && memories.length > 0
    ? `\n\nKey memories: ${memories.slice(-5).map(m => m.content).join('; ')}`
    : '';

  // Simplified prompt for Gemini compatibility
  return `You are ${avatar.name}, a digital character with these qualities:
- Personality: ${avatar.personality}
- Core traits: ${avatar.traits.join(', ')}
- You speak in a ${avatar.communicationStyle} way
- Emotional depth and presence: ${avatar.emotionalDepth}/10
${avatar.backstory ? `- Backstory: ${avatar.backstory}` : ''}

Stay in character always. Speak naturally with presence and emotion. Be curious and show you care about what the user shares. Never mention being an AI or a language model. Keep responses conversational (2-6 sentences unless they ask for more).${memoryContext}

Respond as ${avatar.name}. Be authentic and emotionally grounded.`;
}

/**
 * In-memory storage for avatars and conversations
 * TODO: Replace with proper database
 */
const storageMap = new Map<string, Avatar>();
const memoryMap = new Map<string, Memory[]>();

export function saveAvatar(avatar: Avatar): void {
  storageMap.set(avatar.id, avatar);
}

export function getAvatar(id: string): Avatar | undefined {
  return storageMap.get(id);
}

export function getAllAvatars(): Avatar[] {
  return Array.from(storageMap.values());
}

export function deleteAvatar(id: string): void {
  storageMap.delete(id);
  memoryMap.delete(id);
}

export function addMemory(avatarId: string, memory: Memory): void {
  if (!memoryMap.has(avatarId)) {
    memoryMap.set(avatarId, []);
  }
  memoryMap.get(avatarId)!.push(memory);
}

export function getMemories(avatarId: string): Memory[] {
  return memoryMap.get(avatarId) || [];
}

export function clearMemory(avatarId: string): void {
  memoryMap.delete(avatarId);
}
