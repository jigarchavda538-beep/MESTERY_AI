import "dotenv/config";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "1mb" }));
app.use("/api/", rateLimit({ windowMs: 60 * 1000, limit: 20, standardHeaders: "draft-7", legacyHeaders: false }));
app.use(express.static(path.join(__dirname, "public")));

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, aiConfigured: Boolean(client), app: "JIGAR AI" });
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!client) {
      return res.status(503).json({
        error: "AI is not connected yet. The site is running, but the owner must add OPENAI_API_KEY in the hosting environment."
      });
    }

    const message = String(req.body?.message || "").trim();
    const history = Array.isArray(req.body?.history) ? req.body.history.slice(-10) : [];
    const useWeb = Boolean(req.body?.useWeb);

    if (!message) return res.status(400).json({ error: "Please enter a message." });
    if (message.length > 8000) return res.status(413).json({ error: "Message is too long. Please keep it under 8,000 characters." });

    const input = [
      ...history.map((item) => ({
        role: item.role === "assistant" ? "assistant" : "user",
        content: String(item.content || "").slice(0, 8000)
      })),
      { role: "user", content: message }
    ];

    const params = {
      model: process.env.OPENAI_MODEL || "gpt-6.2-astra",
      instructions: "You are JIGAR AI, a helpful, friendly, safe multilingual assistant. Reply in the language the user uses. Be clear and honest. If you do not know something, say so.",
      input,
      max_output_tokens: 1200
    };
    if (useWeb) params.tools = [{ type: "web_search" }];

    const response = await client.responses.create(params);
    res.json({ reply: response.output_text || "I couldn't create a text response. Please try again." });
  } catch (error) {
    console.error("Chat API error:", error?.message || error);
    res.status(500).json({ error: "The AI request could not be completed. Check the server configuration and try again." });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`JIGAR AI running on port ${PORT}`);
});
