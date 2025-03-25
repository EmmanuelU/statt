import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, content } = await req.json();
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content },
      ...messages,
    ],
    stream: true,
  });

  // Convert OpenAI stream to web ReadableStream
  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of completion) {

        const content = chunk.choices[0]?.delta?.content || '';
        //console.log(content)
        controller.enqueue(new TextEncoder().encode(content));
      }
      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
