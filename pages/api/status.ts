import type { NextApiRequest, NextApiResponse } from "next";
import { execFile } from "child_process";

function withTimeout<T>(promise: Promise<T>, ms: number) {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms);
    promise
      .then((v) => {
        clearTimeout(t);
        resolve(v);
      })
      .catch((e) => {
        clearTimeout(t);
        reject(e);
      });
  });
}

async function checkPdflatex() {
  try {
    await withTimeout(
      new Promise<void>((resolve, reject) => {
        execFile("pdflatex", ["--version"], (err) => {
          if (err) return reject(err);
          resolve();
        });
      }),
      2000
    );

    return { ok: true as const };
  } catch (e: any) {
    const msg = String(e?.message || e);
    if (msg.toLowerCase().includes("enoent")) {
      return {
        ok: false as const,
        error: "pdflatex not found on PATH",
      };
    }
    return { ok: false as const, error: msg };
  }
}

async function checkOllama() {
  const generateUrl =
    process.env.OLLAMA_URL || "http://localhost:11434/api/generate";

  const baseUrl = generateUrl.replace(/\/api\/generate\/?$/, "");
  const tagsUrl = `${baseUrl}/api/tags`;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 2000);

  try {
    const r = await fetch(tagsUrl, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!r.ok) {
      return {
        ok: false as const,
        url: tagsUrl,
        error: `HTTP ${r.status} ${r.statusText}`,
      };
    }

    // If this parses, it's running
    await r.json();
    return { ok: true as const, url: tagsUrl };
  } catch (e: any) {
    const msg = String(e?.name || e?.message || e);
    if (msg.toLowerCase().includes("abort")) {
      return {
        ok: false as const,
        url: tagsUrl,
        error: "timeout (is ollama running?)",
      };
    }
    return { ok: false as const, url: tagsUrl, error: msg };
  } finally {
    clearTimeout(t);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const [ollama, pdflatex] = await Promise.all([
    checkOllama(),
    checkPdflatex(),
  ]);

  return res.status(200).json({
    ok: Boolean(ollama.ok && pdflatex.ok),
    ollama,
    pdflatex,
    timestamp: new Date().toISOString(),
  });
}
