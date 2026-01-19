import express from "express";
import { mongoHealth } from "./db/mongo";
import documentRoutes from "./routes/documents.routes";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "ai-document-intelligence",
      timestamp: new Date().toISOString(),
      mongo: mongoHealth(),
    });
  });

  app.use("/documents", documentRoutes);

  return app;
}
