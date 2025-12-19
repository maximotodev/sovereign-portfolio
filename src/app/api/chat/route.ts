import { InferenceClient } from "@huggingface/inference";
import { createClient } from "@supabase/supabase-js";
import { PORTFOLIO_CONTEXT } from "@/lib/context";
import { pipeline } from "@xenova/transformers";

const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const maxDuration = 60;

// Singleton for Local Model
let extractor: any = null;

async function getExtractor() {
  if (!extractor) {
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return extractor;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages || [];
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    if (!lastUserMessage) {
      return new Response("No message provided", { status: 400 });
    }

    console.log(`🔍 User asked: "${lastUserMessage.substring(0, 50)}..."`);

    let retrievedContext = "";

    try {
      // 1. Generate Embedding LOCALLY
      const generateEmbedding = await getExtractor();
      const output = await generateEmbedding(lastUserMessage, {
        pooling: "mean",
        normalize: true,
      });
      // @ts-ignore
      const embedding = Array.from(output.data);

      // 2. Semantic Search
      const { data: documents } = await supabase.rpc("match_documents", {
        query_embedding: embedding,
        match_threshold: 0.1,
        match_count: 2,
      });

      retrievedContext =
        documents
          ?.map((doc: any) => doc.content)
          .join("\n\n")
          .substring(0, 1500) || "";

      if (documents?.length) console.log(`📚 Found ${documents.length} docs`);
    } catch (err) {
      console.error("Embedding/DB Error (Continuing without context):", err);
    }

    const systemPrompt = `
    ${PORTFOLIO_CONTEXT}

    === DATABASE KNOWLEDGE ===
    ${
      retrievedContext
        ? retrievedContext
        : "No specific database records found."
    }
    `;

    const stream = new ReadableStream({
      async start(controller) {
        const conversation = [
          { role: "system", content: systemPrompt },
          ...messages.map((m: any) => ({ role: m.role, content: m.content })),
        ];

        try {
          const streamResponse = hf.chatCompletionStream({
            model: "meta-llama/Meta-Llama-3-8B-Instruct",
            messages: conversation,
            max_tokens: 500,
            temperature: 0.7,
          });

          for await (const chunk of streamResponse) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
        } catch (apiError: any) {
          console.error("HF API Error:", apiError);
          const errorMsg = apiError?.message || "Model busy";
          controller.enqueue(
            new TextEncoder().encode(
              ` [System Error: ${errorMsg}. Please try again.]`
            )
          );
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error: any) {
    console.error("Route Handler Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
