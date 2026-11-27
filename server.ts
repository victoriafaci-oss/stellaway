import "dotenv/config";
import express from "express";
import path from "path";
import { registerApiRoutes } from "./src/lib/registerApiRoutes";

async function startServer() {
  const app = express();
  const isProd = process.env.NODE_ENV === "production";
  const PORT = isProd && process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());
  app.use(express.static(path.join(process.cwd(), "public")));

  registerApiRoutes(app);

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(
      express.static(distPath, {
        setHeaders: (res, filePath) => {
          if (
            filePath.endsWith("sw.js") ||
            filePath.endsWith("version.json") ||
            filePath.endsWith("manifest.json") ||
            filePath.endsWith("index.html")
          ) {
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
          }
        },
      })
    );
    app.use((_req, res) => {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });

  server.on("error", (err: any) => {
    console.error("Server listen error:", err);
  });
}

startServer();
