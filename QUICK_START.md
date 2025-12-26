# 🚀 Chatty - Quick Start Guide

Your AI Avatar chat platform is **ready to use** with Google Gemini!

## Step 1: Get Your API Key (2 minutes)

1. Go to: **https://makersuite.google.com/app/apikey**
2. Sign in with Google
3. Click **"Create API Key"** → **"Create new free API key in new project"**
4. Copy the key

## Step 2: Add API Key to Project

Open `.env.local` and paste:

```
GOOGLE_API_KEY=your_copied_key_here
```

**No quotes needed!**

## Step 3: Restart Dev Server

```bash
npm run dev
```

Server will pick up the environment variable. You should see:
```
- Environments: .env.local
```

## Step 4: Chat!

1. Open http://localhost:3000
2. Click **"+ New Avatar"**
3. Create a character (e.g., name: "Luna", traits: mysterious, thoughtful)
4. Click into chat and start talking

**Your avatar will now:**
✨ Generate real responses from Gemini  
✨ Maintain personality consistency  
✨ Remember conversations (if memory enabled)  
✨ Feel present and emotionally grounded  

---

## Example Avatars to Try

### 🎭 Luna (Mysterious)
- Traits: mysterious, thoughtful, poetic
- Personality: "Enigmatic guide who sees deeper meaning in everything"
- Communication: expressive
- Memory: Enabled

### 🎮 Echo (Playful)
- Traits: playful, curious, witty
- Personality: "Spirited companion who finds joy in discovery"
- Communication: casual
- Memory: Enabled

### 💙 Sage (Empathetic)
- Traits: warm, empathetic, calm
- Personality: "Listening presence that honors what you share"
- Communication: expressive
- Memory: Enabled

---

## What's Included?

- ✅ **TypeScript** - Full type safety
- ✅ **Next.js 14** - Full-stack React
- ✅ **Tailwind CSS** - Modern dark UI
- ✅ **Gemini API** - Real LLM responses
- ✅ **Avatar Builder** - 5-step character wizard
- ✅ **Memory System** - Conversation history
- ✅ **System Instructions** - Personality injection

---

## Troubleshooting

**No Gemini responses?**
- Check `.env.local` has your API key
- Restart `npm run dev`
- Check browser console for errors

**"Unauthorized" error?**
- Your API key might be invalid
- Get a new one at https://makersuite.google.com/app/apikey

**Rate limited?**
- Free tier: 60 requests/minute (fair use)
- Wait a minute and retry

---

## What's Next?

- **Deploy** → Vercel, Railway, AWS Lambda
- **Database** → PostgreSQL, MongoDB, Supabase
- **Voice** → ElevenLabs, Google Cloud TTS
- **Images** → DALL-E, Midjourney API
- **Auth** → NextAuth, Clerk

---

**Happy chatting!** 🌌
