import { SimplePool } from "nostr-tools";

// We use a pool to connect to multiple relays simultaneously
export const pool = new SimplePool();
export const RELAYS = [
  "wss://relay.damus.io",
  "wss://relay.primal.net",
  "wss://nos.lol",
];

export async function getProfile(pubkey: string) {
  try {
    const event = await pool.get(RELAYS, {
      kinds: [0], // Kind 0 is Metadata
      authors: [pubkey],
    });
    return event ? JSON.parse(event.content) : null;
  } catch (e) {
    console.error("Nostr Error:", e);
    return null;
  }
}
