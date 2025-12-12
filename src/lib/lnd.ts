import lnService from "ln-service";

// In production, use Environment Variables!
const { lnd } = lnService.authenticatedLndGrpc({
  cert: process.env.LND_CERT, // Base64 encoded TLS cert
  macaroon: process.env.LND_MACAROON, // Base64 encoded Macaroon
  socket: process.env.LND_SOCKET, // e.g., 'your-node-url.com:10009'
});

export async function getNodeInfo() {
  try {
    const info = await lnService.getWalletInfo({ lnd });
    return {
      alias: info.alias,
      block_height: info.current_block_height,
      synced: info.is_synced_to_chain,
      version: info.version,
    };
  } catch (error) {
    console.error("LND Connection Error", error);
    return null;
  }
}
