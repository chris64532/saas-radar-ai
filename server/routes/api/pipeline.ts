import { runPipeline } from "../../../src/lib/pipeline";

export default defineEventHandler(async (event) => {
  const secret = getHeader(event, "x-cron-secret");
  if (secret !== process.env["CRON_SECRET"]) {
    setResponseStatus(event, 401);
    return { error: "Unauthorized" };
  }

  try {
    const result = await runPipeline();
    return { ok: true, ...result };
  } catch (err) {
    setResponseStatus(event, 500);
    return { ok: false, error: (err as Error).message };
  }
});
