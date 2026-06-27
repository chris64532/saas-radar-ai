import { createAPIFileRoute } from "@tanstack/react-start/api";
import { runPipeline } from "@/lib/pipeline";

export const APIRoute = createAPIFileRoute("/api/pipeline")({
  GET: async ({ request }) => {
    const secret = request.headers.get("x-cron-secret");
    if (secret !== process.env["CRON_SECRET"]) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const result = await runPipeline();
      return new Response(JSON.stringify({ ok: true, ...result }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: (err as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});
