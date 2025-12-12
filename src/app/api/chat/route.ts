import { InferenceClient } from "@huggingface/inference";
import { PORTFOLIO_CONTEXT } from "@/lib/context";

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.HUGGINGFACE_API_KEY) {
      return new Response("Missing API Key", { status: 500 });
    }

    // Construct the system prompt + user message history
    // Llama 3 works best when we just pass the messages array directly,
    // but we inject the System Prompt at the start.
    const conversation = [
      { role: "system", content: PORTFOLIO_CONTEXT },
      ...messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    console.log("Using Chat Completion endpoint with Llama-3-8B...");

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // SWITCHING MODEL TO: Meta-Llama-3-8B-Instruct
          // This model is universally supported on the Chat endpoint.
          const streamResponse = client.chatCompletionStream({
            model: "meta-llama/Meta-Llama-3-8B-Instruct",
            messages: conversation,
            max_tokens: 500,
            temperature: 0.7,
          });

          for await (const chunk of streamResponse) {
            // Chat Completion returns 'delta.content'
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }

          controller.close();
        } catch (err) {
          console.error("HF Stream Error:", err);
          // If Llama 3 fails, fallback error message to UI
          controller.enqueue(
            new TextEncoder().encode(" [Error: Model busy, please try again]")
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error: any) {
    console.error("Backend Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
