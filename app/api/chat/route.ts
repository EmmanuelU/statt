import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const runtime = 'edge';

// Define a type for the OpenAI stream chunk with optional promptFilterResults
interface OpenAIStreamChunkWithPromptFilterResults extends OpenAI.Chat.Completions.ChatCompletionChunk {
  promptFilterResults?: any; // Replace 'any' with the actual type if you know it
}

export async function POST(req: Request) {
  const { messages, content } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'system',
        content: content,
      },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response as any, {
    experimental_streamData: true,
  });

  return new StreamingTextResponse(stream);
}