export interface Avatar {
  id: string;
  name: string;
  personality: string;
  traits: string[];
  communicationStyle: 'short' | 'expressive' | 'poetic' | 'casual' | 'formal';
  emotionalDepth: number; // 1-10
  backstory?: string;
  appearance?: {
    description: string;
    imageUrl?: string;
  };
  voice?: {
    tone: 'soft' | 'energetic' | 'calm' | 'playful';
    voiceId?: string;
  };
  personalPhotoUrl?: string;
  memoryEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  avatarId: string;
  role: 'user' | 'avatar';
  content: string;
  timestamp: Date;
  hasVoice?: boolean;
  hasImage?: boolean;
  imageUrl?: string;
}

export interface Memory {
  id: string;
  avatarId: string;
  conversationId: string;
  category: 'name' | 'preference' | 'topic' | 'emotional_state' | 'story';
  content: string;
  createdAt: Date;
  lastReferenced?: Date;
}

export interface ChatSession {
  id: string;
  avatarId: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    emotionalContext?: string;
    topics?: string[];
  };
}

export interface PersonalityAttribute {
  trait: string;
  intensity: number; // 1-10
}
