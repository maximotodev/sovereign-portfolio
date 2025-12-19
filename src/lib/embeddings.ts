import { InferenceClient } from "@huggingface/inference";

// FIX: Use InferenceClient instead of HfInference
const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

export async function generateEmbedding(text: string) {
  try {
    const output = await client.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: text,
    });

    // The API can return nested arrays depending on input.
    // For single text input, we cast it to a number array.
    return output as number[];
  } catch (error) {
    console.error("Embedding Error:", error);
    throw error;
  }
}
