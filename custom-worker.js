// Custom Worker entry point (see wrangler.jsonc `main`).
//
// A Cloudflare Cron Trigger invokes the Worker's scheduled() export, not an
// HTTP fetch — the default OpenNext-generated worker only exports fetch(), so
// the daily cron trigger below previously fired into the void. This wraps
// that generated handler and adds scheduled(), which calls
// /api/cron/fee-reminders (via the WORKER_SELF_REFERENCE service binding,
// see wrangler.jsonc) the same way an external scheduler would.
// @ts-ignore `.open-next/worker.js` is generated at build time
import { default as handler } from "./.open-next/worker.js";

export default {
  fetch: handler.fetch,

  async scheduled(event, env, ctx) {
    const request = new Request(`${env.NEXT_PUBLIC_SITE_URL}/api/cron/fee-reminders`, {
      headers: { "x-cron-secret": env.CRON_SECRET },
    });
    const response = await env.WORKER_SELF_REFERENCE.fetch(request);
    if (!response.ok) {
      console.error(`Fee reminder cron failed: ${response.status} ${await response.text()}`);
    }
  },
};

// @ts-ignore `.open-next/worker.js` is generated at build time
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js";
