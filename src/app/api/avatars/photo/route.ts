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
      if (!process.env.DEAPI_KEY) {
        console.warn('DEAPI_KEY not set, cannot generate images');
        return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
      }

      try {
        // Generate image directly without Gemini enhancement (to save quota)
        const imageUrl = await generateImageWithPrompt(imagePrompt);
        
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

async function generateImageWithPrompt(prompt: string): Promise<string> {
  try {
    const API_KEY = process.env.DEAPI_KEY;
    if (!API_KEY) {
      console.error("Missing DEAPI_KEY");
      return "";
    }

    // Add photorealistic keywords (skip Gemini to save quota)
    const enhancedPrompt = `${prompt}. Photorealistic portrait photograph with natural lighting, realistic skin texture, professional DSLR quality, shallow depth of field.`;
    
    // Generate a deterministic seed from the prompt
    const seed = Math.abs(
      enhancedPrompt.split('').reduce((acc, char) => {
        return ((acc << 5) - acc) + char.charCodeAt(0);
      }, 0)
    ) % 2147483647;
    
    // Build the request
    const response = await fetch("https://api.deapi.ai/api/v1/client/txt2img", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        model: "ZImageTurbo_INT8",
        prompt: enhancedPrompt,
        seed: seed,
        width: 1024,
        height: 1024,
        steps: 20,
      })
    });

    const json = await response.json();

    if (!json?.data?.output || json.data.output.length === 0) {
      console.error("No image returned", json);
      return "";
    }

    // The API returns an array of image URLs
    return json.data.output[0];
  } catch (err) {
    console.error("Image generation error:", err);
    return "";
  }
}
