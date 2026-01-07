import { rankProjectsByRelevance } from "./latex";

function sentenceFromBullet(b: string) {
  // Simple heuristic: ensure it starts with a strong verb and is concise
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
  // If it already starts with a verb (common), keep it. Otherwise prepend best verb.
  const firstWord = cleaned.split(" ")[0].replace(/[\.]/g, "");
  const startsWithVerb = verbs.some(
    (v) => v.toLowerCase() === firstWord.toLowerCase()
  );
  if (startsWithVerb) return cleaned;
  return `${verbs[0]} ${cleaned.charAt(0).toLowerCase() ? cleaned : cleaned}`;
}

export function generateSections(profileStr: string, jd: string) {
  let profile: any;
  try {
    profile = JSON.parse(profileStr);
  } catch (e) {
    profile = null;
  }
  const projects = (profile?.projects || []).map((p: any) => ({
    title: p.title,
    bullets: p.bullets || [],
    skills: p.skills || [],
  }));
  const top = rankProjectsByRelevance(projects, jd, 3);

  const projectsTex = ["\\section*{Projects}", "\\begin{itemize}"];
  for (const p of top) {
    projectsTex.push(
      `\\item **${p.title}**: ` +
        p.bullets
          .slice(0, 3)
          .map((b) => sentenceFromBullet(b))
          .join(" -- ")
    );
  }
  projectsTex.push("\\end{itemize}");

  // Summary: 3 lines, role-specific: pick top skills and projects keywords
  const topSkills = (profile?.skills || []).slice(0, 6);
  const summary = `${profile?.name || ""} — ${topSkills.join(", ")}. ${
    top[0]?.title ? `Focused on ${top[0].title.toLowerCase()}.` : ""
  } Strong experience in ${topSkills.slice(0, 3).join(", ")}.`;

  // Skills: reorder by JD keywords present
  const jdWords = new Set(
    (jd || "")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean)
  );
  const skills = profile?.skills || [];
  const prioritized = skills
    .filter((s: string) => jdWords.has(s.toLowerCase()))
    .concat(skills.filter((s: string) => !jdWords.has(s.toLowerCase())));
  const skillsTex = [
    "\\section*{Technical Skills}",
    "\\begin{itemize}",
    "\\item " + prioritized.join(", "),
    "\\end{itemize}",
  ];

  // Build a small-wrapped item block that preserves common template formatting
  const languages = prioritized.slice(0, 6).join(", ");
  const web = ""; // for now we keep it simple; prioritized already orders skills by JD relevance
  const cloud = "";
  const core = "";

  const skillsInner = `\\small{\\item{ \\textbf{Languages:} ${languages} }}`;

  return {
    summary,
    projectsTex: projectsTex.join("\n"),
    skillsTex: skillsTex.join("\n"),
    // skillsInner will be used to preserve original itemize formatting when replacing
    skillsInner,
  };
}
