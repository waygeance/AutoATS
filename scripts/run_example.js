const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

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
  const cleaned = b.replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  const firstWord = cleaned.split(" ")[0].replace(/[\.]/g, "");
  const startsWithVerb = verbs.some(
    (v) => v.toLowerCase() === firstWord.toLowerCase()
  );
  if (startsWithVerb) return cleaned;
  return `${verbs[0]} ${cleaned}`;
}

async function main() {
  const template = fs.readFileSync(
    path.join(__dirname, "..", "examples", "user_resume.tex"),
    "utf8"
  );
  const profileJson = fs.readFileSync(
    path.join(__dirname, "..", "examples", "sample_profile.json"),
    "utf8"
  );
  const profile = JSON.parse(profileJson);
  const jd = fs.readFileSync(
    path.join(__dirname, "..", "examples", "sample_jd.txt"),
    "utf8"
  );

  try {
    console.log("Generating fallback edits...");
    const projects = profile.projects || [];
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
      // Create a nested itemize for project bullets to avoid inserting literal \n sequences
      projectsTexLines.push(`\\item \\textbf{${p.title}}:`);
      projectsTexLines.push("\\begin{itemize}");
      for (const b of bullets) {
        projectsTexLines.push(`\\item ${b}`);
      }
      projectsTexLines.push("\\end{itemize}");
    }
    projectsTexLines.push("\\end{itemize}", "% END PROJECTS");
    const projectsTex = projectsTexLines.join("\n");

    const topSkills = (profile.skills || []).slice(0, 6);
    const summary = `% START SUMMARY\n\\section{\\textbf{Summary}}\\small{${
      profile.name || ""
    } — ${topSkills.join(", ")}. Focused on ${
      top[0]?.title || ""
    }. Strong experience in ${topSkills
      .slice(0, 3)
      .join(", ")}.}\n% END SUMMARY`;

    const skillsTex = `% START SKILLS\n\\section{\\textbf{Technical Skills}}\n\\begin{itemize}\n\\item ${topSkills.join(
      ", "
    )}\\end{itemize}\n% END SKILLS`;

    // Replace markers
    let updated = template;
    updated = updated.replace(/% START SUMMARY[\s\S]*?% END SUMMARY/, summary);
    updated = updated.replace(
      /% START PROJECTS[\s\S]*?% END PROJECTS/,
      projectsTex
    );
    updated = updated.replace(/% START SKILLS[\s\S]*?% END SKILLS/, skillsTex);

    const outDir = path.join(process.cwd(), "out");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
    const texPath = path.join(outDir, "updated_resume.tex");
    fs.writeFileSync(texPath, updated);
    console.log("Wrote updated LaTeX to", texPath);

    // Send to compile service
    console.log("Sending to compile service...");
    const resp = await fetch(
      process.env.COMPILE_SERVICE_URL || "http://localhost:3030/compile",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tex: updated }),
      }
    );
    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error("Compile service error: " + resp.status + " " + txt);
    }
    const j = await resp.json();
    console.log("Compile service response:", j);
    if (j.pdfUrl) {
      console.log("Downloading PDF from", j.pdfUrl);
      const r = await fetch(j.pdfUrl);
      if (!r.ok) throw new Error("Failed to download PDF: " + r.status);
      const buf = await r.arrayBuffer();
      const pdfPath = path.join(outDir, "updated_resume.pdf");
      fs.writeFileSync(pdfPath, Buffer.from(buf));
      console.log("Saved PDF to", pdfPath);
    }
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  }
}

main();
