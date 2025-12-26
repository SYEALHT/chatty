import { NextRequest, NextResponse } from 'next/server';
import {
  saveAvatar,
  getAvatar,
  getAllAvatars,
  deleteAvatar,
  getMemories,
  clearMemory,
} from '@/lib/avatarEngine';
import { validateAvatar } from '@/lib/utils';
import { Avatar } from '@/types';

export async function GET(request: NextRequest) {
  const avatarId = request.nextUrl.searchParams.get('id');

  if (avatarId) {
    const avatar = getAvatar(avatarId);
    if (!avatar) {
      return NextResponse.json({ error: 'Avatar not found' }, { status: 404 });
    }

    const memories = getMemories(avatarId);
    return NextResponse.json({ avatar, memories });
  }

  // List all avatars
  const avatars = getAllAvatars();
  return NextResponse.json({ avatars });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, avatar, avatarId } = body;

    if (action === 'create' || action === 'update') {
      const validation = validateAvatar(avatar);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.errors }, { status: 400 });
      }

      saveAvatar(avatar);
      return NextResponse.json({ success: true, avatar }, { status: 201 });
    }

    if (action === 'delete') {
      if (!avatarId) {
        return NextResponse.json({ error: 'avatarId is required' }, { status: 400 });
      }
      deleteAvatar(avatarId);
      return NextResponse.json({ success: true });
    }

    if (action === 'clearMemory') {
      if (!avatarId) {
        return NextResponse.json({ error: 'avatarId is required' }, { status: 400 });
      }
      clearMemory(avatarId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Avatars API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
