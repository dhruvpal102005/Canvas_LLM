import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SUPPORTED_MODELS = ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'] as const;
type SupportedModel = typeof SUPPORTED_MODELS[number];

export async function POST(req: Request) {
  try {
    const { prompt, model } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is missing. Returning a mocked response.');
      return NextResponse.json({
        text: `[Mocked Response] The model "${model}" received your prompt: "${prompt}".\n\nAdd your GEMINI_API_KEY to .env to get real responses.`,
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const validModel: SupportedModel = SUPPORTED_MODELS.includes(model as SupportedModel)
      ? (model as SupportedModel)
      : 'gemini-2.0-flash';

    const geminiModel = genAI.getGenerativeModel({ model: validModel });

    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error: unknown) {
    console.error('API /generate error:', error);
    const message = error instanceof Error ? error.message : 'Error communicating with AI';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
