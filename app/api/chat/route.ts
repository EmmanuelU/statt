export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, content } = await req.json();

    // 1. Native Fetch to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.2', // Updated to GPT-5.2
        stream: true,
        messages: [
          {
            role: 'system',
            content: content || 'You are a helpful assistant.'
          },
          ...messages
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(errorText, { status: response.status });
    }

    if (!response.body) {
      throw new Error("No response body from OpenAI");
    }

    // 2. Transform SSE (Server-Sent Events) to Plain Text
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith('data: ')) continue;

              const data = trimmed.replace('data: ', '');
              if (data === '[DONE]') continue;

              try {
                const json = JSON.parse(data);
                const text = json.choices[0]?.delta?.content || '';
                if (text) {
                  controller.enqueue(encoder.encode(text));
                }
              } catch (e) {
                // Ignore parse errors for specific lines
              }
            }
          }
        } catch (e) {
          controller.error(e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream);

  } catch (error) {
    console.error("API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}