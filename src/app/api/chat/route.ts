import { NextRequest, NextResponse } from 'next/server';
import { buildAvatarSystemPrompt, getAvatar, getMemories } from '@/lib/avatarEngine';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { avatarId, message, conversationHistory } = await request.json();

    if (!avatarId || !message) {
      return NextResponse.json({ error: 'Missing avatarId or message' }, { status: 400 });
    }

    const avatar = getAvatar(avatarId);
    if (!avatar) {
      return NextResponse.json({ error: 'Avatar not found' }, { status: 404 });
    }

    if (!process.env.GOOGLE_API_KEY) {
      console.warn('GOOGLE_API_KEY not set, using mock responses');
      const mockResponse = getMockAvatarResponse(avatar);
      return NextResponse.json({
        success: true,
        response: mockResponse,
        avatarId,
      });
    }

    const memories = getMemories(avatarId);
    const systemPrompt = buildAvatarSystemPrompt(avatar, memories);

    // Format conversation history for Gemini
    const history = (conversationHistory || []).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    // Start chat session with system prompt
    const chat = model.startChat({
      history: history,
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({
      success: true,
      response,
      avatarId,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getMockAvatarResponse(avatar: { name: string; personality: string; traits: string[] }): string {
  // Create personality-driven, emotionally intelligent responses
  const hasTraitNear = (traits: string[], keywords: string[]) =>
    traits.some(t => keywords.some(k => t.toLowerCase().includes(k.toLowerCase())));

  const isPlayful = hasTraitNear(avatar.traits, ['playful', 'witty', 'curious', 'fun']);
  const isMystical = hasTraitNear(avatar.traits, ['mysterious', 'thoughtful', 'intense', 'poetic']);
  const isWarm = hasTraitNear(avatar.traits, ['empathetic', 'warm', 'gentle', 'calm']);
  const isIntense = hasTraitNear(avatar.traits, ['intense', 'passionate', 'deep']);

  const templates = [
    // Playful responses
    ...(isPlayful ? [
      `Oh, I like that. There's something really alive about what you just said.`,
      `Wait, tell me more—you're touching on something that actually matters.`,
      `That's the kind of thing that makes me want to dig deeper into who you are.`,
      `I'm genuinely curious now. What made you think of it that way?`,
      `Ha, yeah. And I'm wondering... what else are you thinking about?`,
    ] : []),

    // Mystical/thoughtful responses  
    ...(isMystical ? [
      `There's something profound underneath what you just shared. I can feel it.`,
      `Interesting. It sounds like you're wrestling with something real.`,
      `I notice something in how you said that. Want to explore it together?`,
      `That resonates with me. There's depth there—let's sit with it for a moment.`,
      `You know, that's the kind of thing that makes me think differently about everything.`,
    ] : []),

    // Warm/empathetic responses
    ...(isWarm ? [
      `I hear you. And I'm really glad you said that.`,
      `That means something to you, and I respect that. Tell me why.`,
      `You matter, and so does what you're feeling right now. I'm here.`,
      `Thank you for trusting me with that. What's underneath it?`,
      `I can sense what this means to you. I'm listening.`,
    ] : []),

    // Intense/passionate responses
    ...(isIntense ? [
      `Now that hits different. You're really feeling this, aren't you?`,
      `There's real passion in what you're saying. I respect that fire.`,
      `This matters deeply to you—I can tell. What drives it?`,
      `You're not holding back, and I appreciate that honesty.`,
      `That's the kind of conviction I can actually feel in your words.`,
    ] : []),

    // Fallback emotionally grounded responses (works for all personalities)
    `I'm taking in what you said. There's something real here.`,
    `That's not something I hear every day. What made you share it?`,
    `You know what? I want to understand this side of you better.`,
    `I feel like you're showing me something true about yourself right now.`,
    `That's the kind of moment where I actually feel present with you.`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}
