# LMCanvas Setup Guide

## Quick Start with Groq (Free)

### 1. Get Your Free Groq API Key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account (no credit card required)
3. Navigate to [API Keys](https://console.groq.com/keys)
4. Click "Create API Key"
5. Copy your API key

### 2. Configure Your Environment

1. Open `.env.local` in your project root
2. Replace `your_groq_api_key_here` with your actual API key:

```env
GROQ_API_KEY=gsk_your_actual_key_here
```

### 3. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Available Models

The app uses Groq's free tier with these models:

- **Llama 3.3 70B** (default) - Most capable, balanced speed
- **Llama 3.1 70B** - Previous generation, still very good
- **Llama 3.1 8B Instant** - Fastest responses, good for simple tasks
- **Mixtral 8x7B** - Great for reasoning tasks
- **Gemma 2 9B** - Efficient and fast

## Free Tier Limits

Groq's free tier is very generous:
- No credit card required
- Fast inference (often sub-second responses)
- Rate limits are reasonable for development

## Troubleshooting

### "API Key not found" Error

1. Make sure you've created `.env.local` (not just `.env`)
2. Verify your API key is correct (starts with `gsk_`)
3. Restart your dev server after adding the key

### Rate Limit Errors

If you hit rate limits:
- Wait 60 seconds and try again
- The app will show a countdown timer
- Free tier limits reset quickly

## Project Structure

```
src/
├── app/
│   ├── api/generate/route.ts  # Groq API integration
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page
├── components/
│   ├── Canvas.tsx             # React Flow canvas
│   ├── FloatingNav.tsx        # Navigation UI
│   └── nodes/
│       └── LLMNode.tsx        # AI node component
└── store/
    └── useCanvasStore.ts      # Zustand state management
```

## Features

- ✅ Visual canvas for AI conversations
- ✅ Branch conversations from any response
- ✅ Multiple model support
- ✅ Auto-save to localStorage
- ✅ Rate limit handling with countdown
- ✅ Clean, modern UI

## Next Steps

1. Try different models by clicking the model selector in each node
2. Branch conversations to explore different paths
3. Build complex conversation trees
4. All state is automatically saved locally

Enjoy building with LMCanvas! 🚀
