import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Groq models - all available on free tier with generous limits
const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'llama-3.1-8b-instant',
  'mixtral-8x7b-32768',
  'gemma2-9b-it',
] as const;

type GroqModel = typeof GROQ_MODELS[number];

type GroqError = Error & {
  status?: number;
  code?: string;
};

async function generateWithGroq(
  apiKey: string,
  prompt: string,
  model: string,
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  const groq = new OpenAI({
    apiKey,
    baseURL: 'https://api.groq.com/openai/v1',
  });

  // Build messages array with conversation history
  const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
    ...(conversationHistory || []),
    {
      role: 'user',
      content: prompt,
    },
  ];

  const completion = await groq.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    max_tokens: 2048,
  });

  return completion.choices[0]?.message?.content || 'No response generated.';
}

export async function POST(req: Request) {
  try {
    const { prompt, model, conversationHistory } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      console.warn('GROQ_API_KEY is missing. Returning a mocked response.');
      return NextResponse.json({
        text: `[Mocked Response] The model "${model}" received your prompt: "${prompt}".\n\nAdd your GROQ_API_KEY to .env.local to get real responses.\n\nGet a free API key at: https://console.groq.com/keys`,
      });
    }

    // Use the requested model if it's valid, otherwise default to llama-3.3-70b-versatile
    const selectedModel = GROQ_MODELS.includes(model as GroqModel)
      ? model
      : 'llama-3.3-70b-versatile';

    console.log(`[generate] Using Groq model: ${selectedModel} with ${conversationHistory?.length || 0} history messages`);
    const text = await generateWithGroq(
      process.env.GROQ_API_KEY, 
      prompt, 
      selectedModel,
      conversationHistory
    );
    
    return NextResponse.json({ text });

  } catch (error: unknown) {
    console.error('API /generate error:', error);
    const groqErr = error as GroqError;
    
    // Handle rate limiting
    if (groqErr.status === 429 || groqErr.message?.includes('429')) {
      return NextResponse.json(
        {
          error: 'rate_limited',
          message: 'Rate limit reached. Please try again in a moment.',
          retryAfter: 60,
        },
        { status: 429 }
      );
    }

    // Handle authentication errors
    if (groqErr.status === 401 || groqErr.message?.includes('401')) {
      return NextResponse.json(
        {
          error: 'authentication_failed',
          message: 'Invalid API key. Get a free key at https://console.groq.com/keys',
        },
        { status: 401 }
      );
    }

    const message = groqErr.message || 'Error communicating with AI';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
