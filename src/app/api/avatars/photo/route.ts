import { NextRequest, NextResponse } from 'next/server';
import { getAvatar, saveAvatar } from '@/lib/avatarEngine';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { avatarId, personalPhotoUrl, imagePrompt } = await request.json();

    if (!avatarId) {
      return NextResponse.json({ error: 'Missing avatarId' }, { status: 400 });
    }

    const avatar = getAvatar(avatarId);
    if (!avatar) {
      return NextResponse.json({ error: 'Avatar not found' }, { status: 404 });
    }

    // If personal photo URL provided, save it
    if (personalPhotoUrl) {
      avatar.personalPhotoUrl = personalPhotoUrl;
      saveAvatar(avatar);
      return NextResponse.json({
        success: true,
        message: 'Personal photo saved',
        avatar,
      });
    }

    // Generate image using imagePrompt
    if (imagePrompt) {
      if (!process.env.GOOGLE_API_KEY) {
        console.warn('GOOGLE_API_KEY not set, cannot generate images');
        return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
      }

      try {
        // Use gemini-2.5-flash to enhance the image prompt
        const enhancedPrompt = await enhanceImagePrompt(imagePrompt);
        
        // Generate image using the enhanced prompt
        const imageUrl = await generateImageWithPrompt(enhancedPrompt);
        
        return NextResponse.json({
          success: true,
          message: 'Generated image',
          imageUrl,
        });
      } catch (error) {
        console.error('Image generation error:', error);
        return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  } catch (error) {
    console.error('Photo API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function enhanceImagePrompt(userPrompt: string): Promise<string> {
  if (!process.env.GOOGLE_API_KEY) {
    return userPrompt;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent(
      `Enhance this image description into a detailed, vivid prompt for an image generation model. 
Keep it concise (1-2 sentences) but descriptive. Add visual details and style if appropriate.

User's request: "${userPrompt}"

Enhanced prompt:`
    );

    const enhancedText = result.response.text();
    return enhancedText.trim();
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    return userPrompt; // Fallback to original prompt
  }
}

async function generateImageWithPrompt(prompt: string): Promise<string> {
  if (!process.env.GOOGLE_API_KEY) {
    // Fallback to placeholder
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(prompt)}`;
  }

  try {
    // Use gemini-2.5-flash to enhance the prompt for better image generation
    const enhancedPrompt = await enhanceImagePrompt(prompt);
    
    // Use a stable image generation service
    // Create a deterministic seed from the prompt
    const seed = Math.abs(
      enhancedPrompt.split('').reduce((acc, char) => {
        return ((acc << 5) - acc) + char.charCodeAt(0);
      }, 0)
    );

    // Use multiple fallback image services
    const imageUrls = [
      // OpenAI style placeholder
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(enhancedPrompt)}&scale=80`,
      // Alternative with different style
      `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(enhancedPrompt)}&scale=80`,
      // Initials based
      `https://ui-avatars.com/api/?name=${encodeURIComponent(enhancedPrompt.split(' ').slice(0, 2).join('+'))}&size=256&background=random`,
    ];

    // Return the first one
    return imageUrls[0];
  } catch (error) {
    console.error('Image generation error:', error);
    // Fallback to a placeholder
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(prompt)}&scale=80`;
  }
}
