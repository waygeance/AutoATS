import fetch from "cross-fetch";
import { callOllama } from "./ollama";

export async function callAI({
  template,
  profile,
  jd,
  instructions,
}: {
  template: string;
  profile: string;
  jd: string;
  instructions: string;
}) {
  const provider = (
    process.env.AI_PROVIDER ||
    process.env.LLM_PROVIDER ||
    "openai"
  ).toLowerCase();

  const prompt = `${instructions}\n\n---TEMPLATE START---\n${template}\n---TEMPLATE END---\n---PROFILE START---\n${profile}\n---PROFILE END---\n---JD START---\n${jd}\n---JD END---\n\nReturn only the full LaTeX file content.`;

  if (provider === "openai") {
    // Very simple wrapper using OpenAI's chat completion - placeholder
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OPENAI_API_KEY not set");
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2500,
      }),
    });
    const j = await resp.json();
    const txt = j.choices?.[0]?.message?.content || "";
    return { updatedTemplate: txt };
  }

  if (provider === "ollama" || provider === "llama3") {
    const txt = await callOllama({
      prompt,
      model: process.env.OLLAMA_MODEL || "llama3",
    });
    return { updatedTemplate: txt };
  }

  throw new Error("AI provider not implemented: " + provider);
}
