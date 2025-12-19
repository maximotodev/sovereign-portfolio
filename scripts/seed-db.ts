import { createClient } from "@supabase/supabase-js";
import { POSTS, PROJECTS } from "../src/lib/data";
import * as dotenv from "dotenv";

// Load env vars from .env.local
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials in .env.local");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("🌱 Starting Sovereign Seed Process (Local CPU Mode)...");

  // 1. Dynamic import of the local AI library
  const { pipeline } = await import("@xenova/transformers");

  console.log("📥 Loading AI Model locally (this happens once)...");
  // This downloads a small model (~90MB) to your machine
  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );

  // Helper function: Text -> [Numbers]
  const generateLocalEmbedding = async (text: string) => {
    const output = await extractor(text, { pooling: "mean", normalize: true });
    // @ts-ignore
    return Array.from(output.data);
  };

  // 2. Process Blog Posts
  for (const post of POSTS) {
    console.log(`Processing Post: ${post.title}...`);
    try {
      const embedding = await generateLocalEmbedding(post.content);

      const { error } = await supabase.from("documents").insert({
        content: post.content,
        metadata: { type: "blog", title: post.title, slug: post.slug },
        embedding,
      });

      if (error) console.error("Supabase Error:", error.message);
    } catch (e) {
      console.error("Embedding Error:", e);
    }
  }

  // 3. Process Projects
  for (const project of PROJECTS) {
    console.log(`Processing Project: ${project.title}...`);
    const projectText = `Project: ${project.title}. Description: ${
      project.description
    }. Tags: ${project.tags.join(", ")}. Repo: ${project.repoUrl}`;

    try {
      const embedding = await generateLocalEmbedding(projectText);

      const { error } = await supabase.from("documents").insert({
        content: projectText,
        metadata: {
          type: "project",
          title: project.title,
          url: project.liveUrl,
        },
        embedding,
      });

      if (error) console.error("Supabase Error:", error.message);
    } catch (e) {
      console.error("Embedding Error:", e);
    }
  }

  console.log("✅ Seeding Complete!");
}

seed().catch(console.error);
