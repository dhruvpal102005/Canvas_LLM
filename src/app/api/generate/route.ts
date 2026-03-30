import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Structure to support multiple providers (OpenRouter, Anthropic, etc.) easily later.
export async function POST(req: Request) {
  try {
    const { prompt, model } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      // Mock response if API key is missing for smooth UI flow during testing
      console.warn("OPENAI_API_KEY is missing. Returning a mocked response.");
      return NextResponse.json({ 
        text: `[Mocked Response] The model "${model}" received your prompt: "${prompt}".\n\nAdd your OPENAI_API_KEY to .env.local to get real responses.` 
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Validate if it's one of the supported models, otherwise fallback
    const validModel = ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'].includes(model) ? model : 'gpt-3.5-turbo';

    const completion = await openai.chat.completions.create({
      model: validModel,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = completion.choices[0]?.message.content || 'No response generated.';

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('API /generate error:', error);
    return NextResponse.json({ error: error.message || 'Error communicating with AI' }, { status: 500 });
  }
}
