# 🔑 Gemini API Setup Guide

## Get Your Free API Key

1. **Go to Google AI Studio**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with your Google account

2. **Create an API Key**
   - Click "Create API Key"
   - Select "Create new free API key in new project"
   - Copy the API key

3. **Add to Environment**
   - Open `.env.local` in the root of this project
   - Paste your API key:
     ```
     GOOGLE_API_KEY=your_api_key_here
     ```

4. **Restart Dev Server**
   ```bash
   npm run dev
   ```

## What's Gemini?

Google's Gemini is a free LLM that powers intelligent responses for your avatars:

- **Multi-turn conversations** - Full context across messages
- **System instructions** - Personalities stay consistent
- **Fast** - Sub-second responses
- **Free tier** - 60 requests per minute (generous for testing)

## What Happens Now?

Once you add your API key:

✨ Your avatars will generate **real, context-aware responses**
- Not mock responses anymore
- Personality-driven by your system prompts
- Memory-aware if enabled
- Natural conversation flow

## Troubleshooting

**"API key not set"**
- Make sure `.env.local` has `GOOGLE_API_KEY=your_key`
- Restart dev server after adding key
- Check that the key is not wrapped in quotes

**"Rate limit exceeded"**
- Free tier: 60 requests/minute
- Wait a minute and try again
- For production, upgrade your Google Cloud project

**"Invalid API key"**
- Double-check your key at https://makersuite.google.com/app/apikey
- Generate a new one if needed
- Make sure there are no extra spaces in `.env.local`

## Next Steps

- Chat with your avatars!
- Create multiple characters with different personalities
- Watch how Gemini respects the system instructions
- Enable memory to see conversations persist

---

Built with Gemini. 🚀
