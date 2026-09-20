import app from "../server";

export default async function handler(req: any, res: any) {
  // Set VERCEL flag agar server.ts tahu sedang di environment serverless
  process.env.VERCEL = "1";

  try {
    await new Promise<void>((resolve, reject) => {
      // Intercept res.end to know when Express has finished
      const originalEnd = res.end.bind(res);
      res.end = (...args: any[]) => {
        originalEnd(...args);
        resolve();
      };

      // Pass request to Express app
      try {
        app(req, res);
      } catch (syncErr) {
        reject(syncErr);
      }

      // Timeout safety net: resolve after 55s to prevent Vercel 60s hard timeout
      setTimeout(() => {
        if (!res.headersSent) {
          res.status(504).json({
            success: false,
            error: "Request timeout pada Vercel Serverless Function.",
          });
        }
        resolve();
      }, 55000);
    });
  } catch (err: any) {
    console.error("Vercel Serverless Function Error:", err);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: "Terjadi kesalahan eksekusi pada Vercel Serverless Function.",
        message: err?.message || String(err),
      });
    }
  }
}
