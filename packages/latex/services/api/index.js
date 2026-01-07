const express = require("express");
const bodyParser = require("body-parser");
// Use global fetch available in Node 18+
const app = express();
app.use(bodyParser.json({ limit: "10mb" }));

app.post("/generate", async (req, res) => {
  const { template, profile, jd } = req.body || {};
  if (!template || !profile || !jd)
    return res.status(400).json({ error: "missing template/profile/jd" });
  try {
    // Build prompt
    const prompt = `You are an expert ATS-focused LaTeX resume editor. Modify ONLY the Summary, Projects, and Technical Skills sections. Return ONLY the full LaTeX file content.\n\n---TEMPLATE START---\n${template}\n---TEMPLATE END---\n---PROFILE START---\n${JSON.stringify(
      profile
    )}\n---PROFILE END---\n---JD START---\n${jd}\n---JD END---`;
    // Call mock-ollama (or real one) at mock-ollama:11434/api/generate
    const ollamaUrl =
      process.env.OLLAMA_URL || "http://mock-ollama:11434/api/generate";
    const r = await fetch(ollamaUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama3", prompt }),
    });
    if (!r.ok) {
      const t = await r.text();
      return res.status(500).json({ error: "ollama error: " + t });
    }
    const j = await r.json();
    const updated = j.response || j; // mock
    // send to compile service
    const compileUrl =
      process.env.COMPILE_SERVICE_URL || "http://compile:3030/compile";
    const c = await fetch(compileUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tex: updated }),
    });
    if (!c.ok) {
      const t = await c.text();
      return res.status(500).json({ error: "compile error: " + t });
    }
    const cj = await c.json();
    return res.json({ pdfUrl: cj.pdfUrl });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
});

app.get("/health", (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("API service listening on", port));
