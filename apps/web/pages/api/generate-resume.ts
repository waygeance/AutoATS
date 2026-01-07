import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { execFile } from "child_process";

type ProjectBlock = {
  id: string;
  title: string;
  block: string;
};

interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  bullets: string[];
}

// Project pool (used only for picking the best 2). These do not modify the template directly.
const sampleProjects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform with MERN Stack",
    description:
      "Full-stack e-commerce solution with real-time inventory management",
    skills: ["React", "Node.js", "MongoDB", "Express", "Redux", "Stripe API"],
    bullets: [
      "Built responsive frontend with React and Redux for state management",
      "Implemented secure payment processing using Stripe API",
      "Developed RESTful APIs with Express.js and MongoDB",
      "Achieved 99.9% uptime with automated deployment pipeline",
    ],
  },
  {
    id: "2",
    title: "AI-Powered Chat Application",
    description:
      "Real-time chat app with natural language processing capabilities",
    skills: ["Next.js", "TypeScript", "Socket.io", "PostgreSQL"],
    bullets: [
      "Implemented real-time messaging using WebSocket connections",
      "Integrated AI-powered message suggestions and auto-completion",
      "Built scalable backend architecture handling 10K+ concurrent users",
      "Reduced message latency by 40% through optimization",
    ],
  },
  {
    id: "3",
    title: "Cloud-Native Microservices Architecture",
    description: "Distributed system using Kubernetes and AWS",
    skills: ["Kubernetes", "AWS", "Go", "gRPC", "Redis"],
    bullets: [
      "Designed and implemented 15+ microservices with Go and gRPC",
      "Deployed applications on Kubernetes cluster with autoscaling",
      "Achieved 99.99% availability with monitoring and alerting",
      "Reduced infrastructure costs by 30% through right-sizing",
    ],
  },
  {
    id: "4",
    title: "Machine Learning Pipeline for Fraud Detection",
    description: "Real-time fraud detection system using ML models",
    skills: ["Python", "TensorFlow", "scikit-learn", "Apache Kafka"],
    bullets: [
      "Developed ML models with 95% accuracy in fraud detection",
      "Built real-time data processing pipeline with Apache Kafka",
      "Implemented model monitoring and retraining automation",
      "Reduced false positives by 60% through ensemble methods",
    ],
  },
  {
    id: "5",
    title: "Progressive Web App (PWA) for Social Media",
    description:
      "Offline-first social media application with push notifications",
    skills: [
      "React",
      "Service Workers",
      "IndexedDB",
      "Firebase",
      "Tailwind CSS",
    ],
    bullets: [
      "Built PWA with offline functionality and background sync",
      "Implemented push notifications for real-time engagement",
      "Achieved 95+ Lighthouse performance score",
      "Increased user retention by 45% with offline capabilities",
    ],
  },
  {
    id: "6",
    title: "Blockchain-Based Supply Chain Management",
    description: "Decentralized supply chain tracking using smart contracts",
    skills: ["Solidity", "Web3.js", "Ethereum", "React", "IPFS"],
    bullets: [
      "Developed smart contracts for transparent supply chain tracking",
      "Built web interface using React and Web3.js",
      "Implemented IPFS for decentralized file storage",
      "Reduced tracking errors by 80% through on-chain verification",
    ],
  },
  {
    id: "7",
    title: "Real-Time Analytics Dashboard",
    description:
      "Interactive dashboard for business intelligence and data visualization",
    skills: ["Vue.js", "D3.js", "Node.js", "PostgreSQL", "Redis", "WebSocket"],
    bullets: [
      "Created interactive data visualizations with D3.js",
      "Implemented real-time data updates using WebSocket connections",
      "Built responsive dashboard with 20+ different chart types",
      "Improved decision-making speed by 50% with real-time insights",
    ],
  },
  {
    id: "8",
    title: "Mobile App with React Native",
    description: "Cross-platform mobile application for fitness tracking",
    skills: ["React Native", "TypeScript", "Firebase", "Redux", "Expo"],
    bullets: [
      "Developed cross-platform app for iOS and Android",
      "Integrated Firebase for real-time data synchronization",
      "Implemented offline data storage and synchronization",
      "Achieved 4.8-star rating with 50K+ downloads",
    ],
  },
  {
    id: "9",
    title: "DevOps Automation Pipeline",
    description: "CI/CD pipeline with automated testing and deployment",
    skills: ["Jenkins", "Kubernetes", "AWS", "Terraform", "Ansible"],
    bullets: [
      "Built end-to-end CI/CD pipeline with Jenkins and Kubernetes",
      "Implemented infrastructure as code using Terraform",
      "Automated testing and deployment processes",
      "Reduced deployment time by 70% through automation",
    ],
  },
  {
    id: "10",
    title: "GraphQL API Gateway",
    description: "Unified API gateway using GraphQL and microservices",
    skills: ["GraphQL", "Apollo Server", "Node.js", "Redis"],
    bullets: [
      "Designed and implemented GraphQL schema for 10+ microservices",
      "Built efficient data fetching with Apollo Server",
      "Implemented caching layer with Redis for performance",
      "Reduced API response time by 60% with query optimization",
    ],
  },
  {
    id: "11",
    title: "IoT Smart Home System",
    description: "Connected home automation system with mobile app control",
    skills: ["Python", "Raspberry Pi", "MQTT", "AWS IoT"],
    bullets: [
      "Developed IoT firmware for smart home devices",
      "Built a control dashboard for device monitoring",
      "Implemented secure communication using MQTT protocol",
      "Achieved 99.9% system uptime with automated monitoring",
    ],
  },
  {
    id: "12",
    title: "Video Streaming Platform",
    description: "Scalable video streaming service with adaptive bitrate",
    skills: ["Node.js", "FFmpeg", "AWS S3", "CloudFront", "React", "WebRTC"],
    bullets: [
      "Built video processing pipeline with FFmpeg",
      "Implemented adaptive bitrate streaming for optimal quality",
      "Developed real-time video chat using WebRTC",
      "Supported 10K+ concurrent viewers with CDN optimization",
    ],
  },
];

async function callOllama(prompt: string): Promise<string> {
  const ollamaUrl =
    process.env.OLLAMA_URL || "http://localhost:11434/api/generate";

  const controller = new AbortController();
  const timeoutMs = Number(process.env.OLLAMA_TIMEOUT_MS || 20000);
  const t = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(ollamaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3",
        prompt,
        stream: false,
      }),
      signal: controller.signal,
    });
  } catch (e: any) {
    const msg = String(e?.name || e?.message || e);
    if (msg.toLowerCase().includes("abort")) {
      throw new Error(
        `Ollama request timed out after ${timeoutMs}ms. Is Ollama running? Start it with: ollama serve`
      );
    }
    throw new Error(
      `Failed to reach Ollama at ${ollamaUrl}. Is Ollama running? Start it with: ollama serve`
    );
  } finally {
    clearTimeout(t);
  }

  if (!response.ok) {
    throw new Error(
      `Ollama API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.response || "";
}

function extractFirstJsonObject(text: string) {
  const cleaned = text
    .trim()
    .replace(/```json|```/gi, "")
    .trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  return match ? match[0] : null;
}

function deriveKeywordsFromJd(jd: string) {
  const stop = new Set([
    "the",
    "and",
    "for",
    "with",
    "from",
    "that",
    "this",
    "are",
    "you",
    "your",
    "our",
    "will",
    "have",
    "has",
    "their",
    "they",
    "also",
    "role",
    "team",
    "work",
    "all",
    "like",
    "based",
    "high",
    "low",
    "more",
    "most",
    "some",
    "any",
    "years",
    "year",
    "experience",
    "preferred",
    "requirements",
    "responsibilities",
    "about",
  ]);

  const tokens = jd
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/g)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3 && !stop.has(t));

  const counts = new Map<string, number>();
  for (const t of tokens) counts.set(t, (counts.get(t) || 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([t]) => t);
}

function buildProjectLatexBlock(p: Project) {
  const title = escapeLatex(p.title);
  const bullets = p.bullets
    .slice(0, 4)
    .map((b) => `\\item {${escapeLatex(b)}}`);
  return [
    `\\resumeProject{${title}}{}{}{}`,
    `\\resumeHollowItemListStart`,
    ...bullets,
    `\\resumeHollowItemListEnd`,
  ].join("\n");
}

function scoreProjectForJd(jd: string, p: Project) {
  const hay = `${p.title} ${p.description} ${p.skills.join(
    " "
  )} ${p.bullets.join(" ")}`.toLowerCase();
  const jdTokens = jd
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/g)
    .filter((t) => t.length >= 3);
  let score = 0;
  for (const t of jdTokens) {
    if (hay.includes(t)) score += 1;
  }
  return score;
}

function buildPdfUrl(req: NextApiRequest, id: string) {
  const proto = (req.headers["x-forwarded-proto"] as string) || "http";
  const host = req.headers.host;
  return `${proto}://${host}/api/pdf/${id}`;
}

function getPdfDir() {
  return path.join("/tmp", "autoats", "pdf");
}

function getLatexWorkDir(id: string) {
  return path.join("/tmp", "autoats", "latex", id);
}

function safeText(s?: string) {
  return (s || "").replace(/\s+/g, " ").trim();
}

function escapeLatex(text: string) {
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/~/g, "\\textasciitilde{}");
}

function sanitizeSummaryText(text: string) {
  // Summary must be plain text only (no LaTeX commands, no URLs, no braces/backslashes).
  const withoutUrls = String(text || "").replace(/https?:\/\/\S+/gi, "");
  const withoutLatexCommands = withoutUrls
    .replace(/\\href\{[^}]*\}\{([^}]*)\}/g, "$1")
    .replace(/\\[a-zA-Z]+\*?(\[[^\]]*\])?(\{[^}]*\})?/g, " ");
  return safeText(withoutLatexCommands)
    .replace(/[{}\\]/g, "")
    .trim();
}

function replaceBetweenMarkers(
  tex: string,
  startMarker: string,
  endMarker: string,
  replacementInner: string
) {
  const start = tex.indexOf(startMarker);
  const end = tex.indexOf(endMarker);
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`Missing markers: ${startMarker} / ${endMarker}`);
  }
  const before = tex.slice(0, start + startMarker.length);
  const after = tex.slice(end);
  return `${before}\n${replacementInner}\n${after}`;
}

function extractBetweenMarkers(
  tex: string,
  startMarker: string,
  endMarker: string
) {
  const start = tex.indexOf(startMarker);
  const end = tex.indexOf(endMarker);
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`Missing markers: ${startMarker} / ${endMarker}`);
  }
  return tex.slice(start + startMarker.length, end);
}

function sanitizeResumeProjectLine(line: string) {
  // The upstream template sometimes has: ...{}% {DATE}{}
  // In TeX, '%' comments out the rest of the line, which drops required macro args.
  // We only remove '%' when it's immediately before the next '{...}' argument.
  return line.replace(/%\s*(?=\{)/g, "");
}

function parseProjectBlocks(projectsRegion: string): ProjectBlock[] {
  const blocks: ProjectBlock[] = [];
  const parts = projectsRegion.split("\\resumeProject");
  if (parts.length <= 1) return blocks;

  // Re-add the delimiter to each part after the first
  for (let i = 1; i < parts.length; i++) {
    const chunk = "\\resumeProject" + parts[i];
    const endIdx = chunk.indexOf("\\resumeHollowItemListEnd");
    if (endIdx === -1) continue;
    const block = chunk
      .slice(0, endIdx + "\\resumeHollowItemListEnd".length)
      .trim()
      .split("\n")
      .map((line) =>
        line.includes("\\resumeProject")
          ? sanitizeResumeProjectLine(line)
          : line
      )
      .join("\n");

    // Try to extract a human-readable title
    const titleMatch = block.match(/\\resumeProject\s*\{([\s\S]*?)\}\s*\{/);
    const titleRaw = titleMatch ? titleMatch[1] : `Project ${i}`;
    const title = titleRaw.replace(/\\href\{[^}]*\}\{([^}]*)\}/g, "$1").trim();

    blocks.push({ id: String(i), title, block });
  }
  return blocks;
}

function stripLatexCommands(s: string) {
  return s
    .replace(/\\href\{[^}]*\}\{([^}]*)\}/g, "$1")
    .replace(/\\[a-zA-Z]+\*?(\[[^\]]*\])?(\{[^}]*\})?/g, " ")
    .replace(/[{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function detectRoleSignals(jd: string): string[] {
  const jdLow = jd.toLowerCase();
  const signals: string[] = [];
  if (
    jdLow.includes("ui") ||
    jdLow.includes("ux") ||
    jdLow.includes("design") ||
    jdLow.includes("figma") ||
    jdLow.includes("prototype")
  ) {
    signals.push("ui/ux", "design", "figma", "prototype");
  }
  if (
    jdLow.includes("frontend") ||
    jdLow.includes("react") ||
    jdLow.includes("next.js") ||
    jdLow.includes("typescript")
  ) {
    signals.push("frontend", "react", "next.js", "typescript");
  }
  if (
    jdLow.includes("backend") ||
    jdLow.includes("api") ||
    jdLow.includes("node") ||
    jdLow.includes("express")
  ) {
    signals.push("backend", "api", "node", "express");
  }
  if (
    jdLow.includes("full-stack") ||
    jdLow.includes("mern") ||
    jdLow.includes("mean")
  ) {
    signals.push("full-stack", "mern", "mean");
  }
  if (
    jdLow.includes("sde") ||
    jdLow.includes("software") ||
    jdLow.includes("engineer")
  ) {
    signals.push("sde", "software", "engineer");
  }
  if (
    jdLow.includes("devops") ||
    jdLow.includes("docker") ||
    jdLow.includes("kubernetes")
  ) {
    signals.push("devops", "docker", "kubernetes");
  }
  if (
    jdLow.includes("data") ||
    jdLow.includes("analytics") ||
    jdLow.includes("bi") ||
    jdLow.includes("sql")
  ) {
    signals.push("data", "analytics", "bi", "sql");
  }
  if (jdLow.includes("ai") || jdLow.includes("llm") || jdLow.includes("ml")) {
    signals.push("ai", "llm", "ml");
  }
  return signals;
}

function scoreProjectBlockForJd(jd: string, p: ProjectBlock) {
  const jdTokens = jd
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/g)
    .filter((t) => t.length >= 3);

  const hay = stripLatexCommands(`${p.title} ${p.block}`).toLowerCase();
  let score = 0;
  for (const t of jdTokens) {
    if (hay.includes(t)) score += 1;
  }

  // Role-aware boosts
  const roleSignals = detectRoleSignals(jd);
  const hayLow = hay;
  for (const sig of roleSignals) {
    if (hayLow.includes(sig)) score += 3;
  }

  // Small role-signal bonus
  if (jd.toLowerCase().includes("frontend") && hayLow.includes("react"))
    score += 3;
  if (jd.toLowerCase().includes("backend") && hayLow.includes("api"))
    score += 2;
  if (jd.toLowerCase().includes("distributed") && hayLow.includes("scal"))
    score += 2;
  if (jd.toLowerCase().includes("ui") && hayLow.includes("design")) score += 3;
  if (jd.toLowerCase().includes("ux") && hayLow.includes("figma")) score += 3;
  if (jd.toLowerCase().includes("devops") && hayLow.includes("docker"))
    score += 2;
  if (jd.toLowerCase().includes("data") && hayLow.includes("sql")) score += 2;
  if (jd.toLowerCase().includes("ai") && hayLow.includes("llm")) score += 2;
  return score;
}

async function pickTwoProjectsWithOllama(jd: string, pool: ProjectBlock[]) {
  const prompt = `You are selecting the BEST 2 projects for a resume based on a job description.

Job description:
${jd}

Project pool (choose 2 by id):
${pool.map((p) => `id=${p.id} title=${p.title}`).join("\n")}

Return ONLY valid JSON in this exact shape:
{"projectIds":["<id>","<id>"],"keywords":["..."]}
Rules:
- projectIds must contain exactly 2 ids from the pool
- keywords: 8-15 ATS keywords from the JD
`;

  const raw = await callOllama(prompt);
  const json = extractFirstJsonObject(raw);
  if (!json) throw new Error("Ollama did not return JSON");
  const parsed = JSON.parse(json);
  const ids = Array.isArray(parsed.projectIds)
    ? parsed.projectIds.map(String)
    : [];
  const keywords = Array.isArray(parsed.keywords)
    ? parsed.keywords.map(String)
    : [];
  if (ids.length !== 2) throw new Error("Ollama did not return 2 projectIds");
  const poolIds = new Set(pool.map((p) => p.id));
  for (const id of ids) {
    if (!poolIds.has(id))
      throw new Error("Ollama returned an invalid project id");
  }
  return { projectIds: ids, keywords };
}

async function rewriteSummaryWithOllama(params: {
  jd: string;
  currentSummary: string;
  chosenProjects: ProjectBlock[];
  keywords: string[];
}) {
  const prompt = `You are an ATS resume editor.

Task: rewrite ONLY the Summary section text (inside \\small{...}) to better match the job description.

Constraints:
- Keep it 2-3 lines (similar length to current).
- Use ATS keywords naturally.
- Do NOT add LaTeX commands.
- Return ONLY the summary text (no quotes, no markdown, no prefix like "Summary:").
- It must be materially different than the current summary while staying truthful.

Job description:
${params.jd}

Selected projects:
${params.chosenProjects.map((p) => `- ${p.title}`).join("\n")}

ATS keywords to include when relevant:
${params.keywords.join(", ")}

Current summary:
${params.currentSummary}
`;

  const raw = await callOllama(prompt);
  const s = safeText(raw)
    .replace(/^summary\s*:\s*/i, "")
    .replace(/^\"|\"$/g, "");
  return sanitizeSummaryText(s);
}

async function runPdflatex(texPath: string, outDir: string) {
  const args = [
    "-interaction=nonstopmode",
    "-halt-on-error",
    `-output-directory=${outDir}`,
    texPath,
  ];
  await new Promise<void>((resolve, reject) => {
    execFile(
      "pdflatex",
      args,
      { maxBuffer: 1024 * 1024 * 10, timeout: 60000 },
      (err, stdout, stderr) => {
        if (err) {
          const eAny = err as any;
          const msg = String((stderr || stdout || err) as any);
          if (eAny?.code === "ENOENT") {
            return reject(
              new Error(
                "pdflatex not found. Install TeX Live (e.g. texlive-latex-base/extra) and ensure pdflatex is on PATH."
              )
            );
          }
          if (eAny?.killed === true) {
            return reject(
              new Error(
                "pdflatex timed out. Ensure TeX Live is installed correctly and the template compiles locally."
              )
            );
          }
          const logPath = path.join(outDir, "resume.log");
          let logTail = "";
          try {
            if (fs.existsSync(logPath)) {
              const log = fs.readFileSync(logPath, "utf8");
              const lines = log.split("\n");
              logTail = lines.slice(Math.max(0, lines.length - 40)).join("\n");
            }
          } catch {
            // ignore
          }
          return reject(
            new Error(
              `pdflatex error: ${msg}\n\n${logTail}\n\nIf this is a missing LaTeX package (.sty not found), install a fuller TeX Live distribution (e.g. texlive-latex-extra + texlive-fonts-extra).`
            )
          );
        }
        resolve();
      }
    );
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { jobDescription } = req.body || {};
    if (!jobDescription || typeof jobDescription !== "string") {
      return res.status(400).json({ error: "Missing jobDescription" });
    }

    const templatePath = path.join(
      process.cwd(),
      "examples",
      "user_resume.tex"
    );
    const template = fs.readFileSync(templatePath, "utf8");

    // Extract current summary text (best-effort)
    const summaryRegion = extractBetweenMarkers(
      template,
      "% START SUMMARY",
      "% END SUMMARY"
    );
    const m = summaryRegion.match(/\\small\{([\s\S]*?)\}/);
    const currentSummary = m ? safeText(m[1]) : "";

    // Build project pool and select 2
    let projectIds: string[] = [];
    let keywords: string[] = [];

    const projectsRegion = extractBetweenMarkers(
      template,
      "% START PROJECTS",
      "% END PROJECTS"
    );
    const templateProjectPool = parseProjectBlocks(projectsRegion);

    const poolForPicking: ProjectBlock[] =
      templateProjectPool.length >= 2
        ? templateProjectPool
        : sampleProjects.map((p) => ({ id: p.id, title: p.title, block: "" }));

    try {
      const picked = await pickTwoProjectsWithOllama(
        jobDescription,
        poolForPicking
      );
      projectIds = picked.projectIds;
      keywords = picked.keywords.length
        ? picked.keywords
        : deriveKeywordsFromJd(jobDescription);
    } catch (e) {
      // Deterministic fallback
      const ranked = [...poolForPicking]
        .map((p) => ({ p, s: scoreProjectBlockForJd(jobDescription, p) }))
        .sort((a, b) => b.s - a.s);
      const top2 = ranked.slice(0, 2);
      projectIds = top2.map((x) => x.p.id);
      keywords = deriveKeywordsFromJd(jobDescription);
    }

    const chosenTemplateBlocks = templateProjectPool
      .filter((p) => projectIds.includes(p.id))
      .slice(0, 2);
    const chosenSampleProjects = sampleProjects
      .filter((p) => projectIds.includes(p.id))
      .slice(0, 2);

    const usingTemplateBlocks = chosenTemplateBlocks.length === 2;
    const chosenProjectsForSummary: ProjectBlock[] = usingTemplateBlocks
      ? chosenTemplateBlocks
      : chosenSampleProjects.map((p) => ({
          id: p.id,
          title: p.title,
          block: "",
        }));

    if (chosenProjectsForSummary.length !== 2) {
      return res.status(500).json({ error: "Failed to select 2 projects" });
    }

    // Rewrite summary with Ollama (fallback to existing summary)
    let newSummary = currentSummary;
    try {
      const s = await rewriteSummaryWithOllama({
        jd: jobDescription,
        currentSummary:
          currentSummary ||
          "Software engineering intern with experience in full-stack development.",
        chosenProjects: chosenProjectsForSummary,
        keywords,
      });
      const cur = safeText(currentSummary).toLowerCase();
      const nxt = safeText(s).toLowerCase();
      if (s && s.length > 20 && nxt !== cur) newSummary = s;
    } catch (e) {
      // keep current
    }

    if (
      !newSummary ||
      safeText(newSummary).toLowerCase() ===
        safeText(currentSummary).toLowerCase()
    ) {
      const kw = keywords.length
        ? keywords
        : deriveKeywordsFromJd(jobDescription);
      const k = kw.slice(0, 8).join(", ");
      const p1 = sanitizeSummaryText(
        stripLatexCommands(chosenProjectsForSummary[0].title)
      );
      const p2 = sanitizeSummaryText(
        stripLatexCommands(chosenProjectsForSummary[1].title)
      );
      newSummary = `Software engineering intern focused on building reliable, scalable systems and user-facing features. Experience with ${k} through project work including ${p1} and ${p2}.`;
    }

    newSummary = sanitizeSummaryText(newSummary);

    const newSummaryRegion = [
      "\\section{\\textbf{Summary}}",
      `\\small{${escapeLatex(newSummary)}}`,
    ].join("\n");

    const chosenProjectBlocks = usingTemplateBlocks
      ? chosenTemplateBlocks.map((p) => p.block).join("\n")
      : chosenSampleProjects.map(buildProjectLatexBlock).join("\n");
    const newProjectsRegion = [
      "\\section{\\textbf{Projects}}",
      "\\resumeSubHeadingListStart",
      chosenProjectBlocks,
      "\\resumeSubHeadingListEnd",
    ].join("\n");

    let updated = template;
    updated = replaceBetweenMarkers(
      updated,
      "% START SUMMARY",
      "% END SUMMARY",
      newSummaryRegion
    );
    updated = replaceBetweenMarkers(
      updated,
      "% START PROJECTS",
      "% END PROJECTS",
      newProjectsRegion
    );

    const id = Date.now().toString();
    const workDir = getLatexWorkDir(id);
    fs.mkdirSync(workDir, { recursive: true });
    const texPath = path.join(workDir, "resume.tex");
    fs.writeFileSync(texPath, updated, "utf8");

    try {
      await runPdflatex(texPath, workDir);
      await runPdflatex(texPath, workDir);
    } catch (e: any) {
      const msg = String(e?.message || e);
      const logPath = path.join(workDir, "resume.log");

      let logTail = "";
      try {
        if (fs.existsSync(logPath)) {
          const log = fs.readFileSync(logPath, "utf8");
          const lines = log.split("\n");
          logTail = lines.slice(Math.max(0, lines.length - 40)).join("\n");
        }
      } catch {
        // ignore
      }

      const combined = `${msg}\n${logTail}`;
      const missingMatch = combined.match(/File `([^`]+\.sty)' not found/i);
      const missingLatexPackage = missingMatch ? missingMatch[1] : undefined;

      let extraHelp =
        "If this is a missing LaTeX package (.sty not found), install a fuller TeX Live distribution (e.g. texlive-latex-recommended + texlive-latex-extra + texlive-fonts-extra).";
      if (missingLatexPackage === "xcolor.sty") {
        extraHelp =
          "Missing xcolor.sty. On Debian/Ubuntu install: sudo apt-get install texlive-latex-recommended";
      } else if (missingLatexPackage) {
        extraHelp = `Missing ${missingLatexPackage}. On Debian/Ubuntu you usually fix this with: sudo apt-get install texlive-latex-recommended texlive-latex-extra texlive-fonts-extra`;
      }

      return res.status(500).json({
        error: msg,
        missingLatexPackage,
        latexLogTail: logTail || undefined,
        help: extraHelp,
      });
    }

    const generatedPdf = path.join(workDir, "resume.pdf");
    if (!fs.existsSync(generatedPdf)) {
      return res.status(500).json({ error: "PDF not produced by pdflatex" });
    }

    const outDir = getPdfDir();
    fs.mkdirSync(outDir, { recursive: true });
    const outPdf = path.join(outDir, `${id}.pdf`);
    fs.copyFileSync(generatedPdf, outPdf);

    return res.status(200).json({
      id,
      pdfUrl: buildPdfUrl(req, id),
      debug: {
        templateProjectPoolSize: templateProjectPool.length,
        pickedFromTemplate: usingTemplateBlocks,
        selectedProjectTitles: chosenProjectsForSummary.map((p) => p.title),
        projectScores: [...poolForPicking].map((p) => ({
          title: p.title,
          score: scoreProjectBlockForJd(jobDescription, p),
        })),
        keywords,
        roleSignals: detectRoleSignals(jobDescription),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error generating resume:", error);
    return res.status(500).json({ error: String(error?.message || error) });
  }
}
