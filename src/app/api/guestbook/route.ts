import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("guestbook")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, pubkey, nostr_event_id, signature, username, avatar } =
      body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Content required" }, { status: 400 });
    }

    // Prepare payload (Trust the frontend provided username/avatar)
    const payload: any = {
      content,
      username: username || "Anonymous", // Use sent name, fallback to Anon
      avatar: avatar || null,
    };

    // Add crypto proofs if present
    if (pubkey) payload.pubkey = pubkey;
    if (nostr_event_id) payload.nostr_event_id = nostr_event_id;
    if (signature) payload.signature = signature;

    const { error } = await supabase.from("guestbook").insert([payload]);

    if (error) {
      console.error("DB Error:", error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to post" }, { status: 500 });
  }
}
