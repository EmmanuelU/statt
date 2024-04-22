import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

export const runtime = 'edge'

export async function POST(req: Request) {

    const { messages, content, } = await req.json()

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        {
          role: 'system',
          content: content
        },
        ...messages
      ]
    })
  
    
  
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  
}
