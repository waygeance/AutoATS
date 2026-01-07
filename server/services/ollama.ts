import fetch from "cross-fetch";

export async function callOllama({
  prompt,
  model = "llama3",
}: {
  prompt: string;
  model?: string;
}) {
  const url = process.env.OLLAMA_URL || "http://localhost:11434/api/generate";
  const body = { model, prompt, stream: false };
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Ollama error: ${resp.status} ${text}`);
  }
  const j = await resp.json();
  // Ollama response may contain `response` field or a nested `choices` array depending on version
  if (j.response) return j.response;
  if (j.choices && j.choices[0] && j.choices[0].text) return j.choices[0].text;
  // Fallback: try to stringify
  return JSON.stringify(j);
}
