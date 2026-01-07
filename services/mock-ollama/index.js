const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json({ limit: "10mb" }));

function sentenceFromBullet(b) {
  const verbs = [
    "Implemented",
    "Built",
    "Designed",
    "Developed",
    "Improved",
    "Optimized",
    "Led",
    "Created",
    "Integrated",
    "Automated",
  ];
  const cleaned = (b || "").replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  const firstWord = cleaned.split(" ")[0].replace(/[\.]/g, "");
  const startsWithVerb = verbs.some(
    (v) => v.toLowerCase() === firstWord.toLowerCase()
  );
  if (startsWithVerb) return cleaned;
  return `${verbs[0]} ${cleaned}`;
}

function rankProjectsByRelevance(projects, jd, n) {
  const jdWords = new Set(
    (jd || "")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean)
  );
  return projects
    .map((p) => {
      const text = (p.title + " " + (p.bullets || []).join(" ")).toLowerCase();
      const tokens = text.split(/[^a-z0-9]+/).filter(Boolean);
      let score = 0;
      for (const t of tokens) if (jdWords.has(t)) score++;
      return { ...p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

function generateSections(profileStr, jd) {
  let profile = {};
  try {
    profile = JSON.parse(profileStr);
  } catch (e) {
    profile = {};
  }
  const projects = (profile.projects || []).map((p) => ({
    title: p.title,
    bullets: p.bullets || [],
    skills: p.skills || [],
  }));
  const top = rankProjectsByRelevance(projects, jd, 3);

  const projectsTexLines = [
    "% START PROJECTS",
    "\\section{\\textbf{Projects}}",
    "\\begin{itemize}",
  ];
  for (const p of top) {
    const bullets = (p.bullets || [])
      .slice(0, 3)
      .map((b) => sentenceFromBullet(b));
    // Subitemize for clarity
    projectsTexLines.push(`\\item \\textbf{${p.title}}:`);
    projectsTexLines.push("\\begin{itemize}");
    for (const b of bullets) projectsTexLines.push("\\item " + b);
    projectsTexLines.push("\\end{itemize}");
  }
  projectsTexLines.push("\\end{itemize}", "% END PROJECTS");
  const projectsTex = projectsTexLines.join("\n");

  const topSkills = (profile.skills || []).slice(0, 6);
  const summary = `% START SUMMARY\n\\section{\\textbf{Summary}}\\small{${
    profile.name || ""
  } — ${topSkills.join(", ")}. ${
    top[0]?.title ? `Focused on ${top[0].title.toLowerCase()}.` : ""
  } Strong experience in ${topSkills.slice(0, 3).join(", ")}.}\n% END SUMMARY`;

  const skillsInner = `\\small{\\item{ \\textbf{Languages:} ${topSkills.join(
    ", "
  )} }}`;
  const skillsTex = `% START SKILLS\n\\section{\\textbf{Technical Skills}}\n\\begin{itemize}\n\\item ${topSkills.join(
    ", "
  )}\\end{itemize}\n% END SKILLS`;

  return { summary, projectsTex, skillsTex, skillsInner };
}

app.post("/api/generate", (req, res) => {
  const { model, prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: "missing prompt" });

  // Try to parse the template/profile/jd markers
  const templateMatch = prompt.match(
    /---TEMPLATE START---([\s\S]*?)---TEMPLATE END---/
  );
  const profileMatch = prompt.match(
    /---PROFILE START---([\s\S]*?)---PROFILE END---/
  );
  const jdMatch = prompt.match(/---JD START---([\s\S]*?)---JD END---/);

  const template = templateMatch ? templateMatch[1] : "";
  const profile = profileMatch ? profileMatch[1] : "{}";
  const jd = jdMatch ? jdMatch[1] : "";

  // Use deterministic generation to produce updated sections
  const { summary, projectsTex, skillsTex } = generateSections(profile, jd);

  let updated = template;
  if (/% START SUMMARY/.test(template) && /% END SUMMARY/.test(template)) {
    updated = updated.replace(/% START SUMMARY[\s\S]*?% END SUMMARY/, summary);
  }
  if (/% START PROJECTS/.test(template) && /% END PROJECTS/.test(template)) {
    updated = updated.replace(
      /% START PROJECTS[\s\S]*?% END PROJECTS/,
      projectsTex
    );
  }
  if (/% START SKILLS/.test(template) && /% END SKILLS/.test(template)) {
    updated = updated.replace(/% START SKILLS[\s\S]*?% END SKILLS/, skillsTex);
  }

  // Response in Ollama-like format
  return res.json({ response: updated });
});

app.get("/health", (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 11434;
app.listen(port, () => console.log("Mock Ollama listening on", port));
