export function extractSection(
  tex: string,
  startMarker: string,
  endMarker: string
) {
  const start = tex.indexOf(startMarker);
  const end = tex.indexOf(endMarker);
  if (start === -1 || end === -1) return null;
  return tex.slice(start + startMarker.length, end).trim();
}

export function replaceSection(
  tex: string,
  startMarker: string,
  endMarker: string,
  newContent: string
) {
  const start = tex.indexOf(startMarker);
  const end = tex.indexOf(endMarker);
  if (start === -1 || end === -1) throw new Error("Markers not found");
  return (
    tex.slice(0, start + startMarker.length) +
    "\n" +
    newContent +
    "\n" +
    tex.slice(end)
  );
}

export function validateOnlyAllowedChanges(original: string, updated: string) {
  // Compare and ensure that only the three allowed sections changed. We will use markers if present; otherwise we look for section titles.
  const markers = [
    { s: "% START SUMMARY", e: "% END SUMMARY" },
    { s: "% START PROJECTS", e: "% END PROJECTS" },
    { s: "% START SKILLS", e: "% END SKILLS" },
  ];

  // If any markers exist in original, only those segments may differ
  const foundMarkers = markers.filter(
    (m) => original.includes(m.s) && original.includes(m.e)
  );
  if (foundMarkers.length > 0) {
    // Ensure no other differences outside those ranges
    let origRest = original;
    let updRest = updated;
    for (const m of foundMarkers) {
      const origSeg = extractSection(original, m.s, m.e) || "";
      const updSeg = extractSection(updated, m.s, m.e) || "";
      // Replace the exact slice in both original and updated using the original slice for origRest and updated slice for updRest
      origRest = origRest.replace(m.s + "\n" + origSeg + "\n" + m.e, "");
      updRest = updRest.replace(m.s + "\n" + updSeg + "\n" + m.e, "");
    }
    return origRest === updRest;
  }

  // Fallback: look for \section*{Summary}, Projects, Technical Skills
  const sectionNames = ["Summary", "Projects", "Technical Skills"];
  // Remove content of each named section from both and compare
  let origCopy = original;
  let updCopy = updated;
  for (const name of sectionNames) {
    const regex = new RegExp(
      "\\\\section*\\{" + name + "\\}([\nsS]*?)(?=\\\\section|$)",
      "g"
    );
    origCopy = origCopy.replace(regex, "");
    updCopy = updCopy.replace(regex, "");
  }
  return origCopy === updCopy;
}

// Utility to pick top N projects by JD keywords overlap - naive approach for MVP
export function rankProjectsByRelevance(
  projects: Array<{ title: string; bullets: string[] }>,
  jd: string,
  n: number
) {
  const jdWords = new Set(
    jd
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean)
  );
  const scored = projects.map((p) => {
    const text = (p.title + " " + p.bullets.join(" ")).toLowerCase();
    const tokens = text.split(/[^a-z0-9]+/).filter(Boolean);
    let score = 0;
    for (const t of tokens) if (jdWords.has(t)) score++;
    return { ...p, score };
  });
  return scored.sort((a, b) => b.score - a.score).slice(0, n);
}

export function replaceSectionByName(
  tex: string,
  sectionName: string,
  newContent: string
) {
  // Match both \section{...} and \section*{...} where the section name contains sectionName
  const namePattern = sectionName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    "(\\\\section*?\\{[^}]*" +
      namePattern +
      "[^}]*\\})([\\s\\S]*?)(?=\\\\section|$)",
    "i"
  );
  const m = tex.match(regex);
  if (!m) throw new Error("Section name not found: " + sectionName);
  const start = m.index! + m[1].length;
  const end = start + (m[2]?.length || 0);
  return tex.slice(0, start) + "\n" + newContent + "\n" + tex.slice(end);
}

export function replaceSectionSmart(
  tex: string,
  startMarker: string,
  endMarker: string,
  sectionName: string,
  newContent: string
) {
  // Try marker replacement first
  if (tex.includes(startMarker) && tex.includes(endMarker)) {
    return replaceSection(tex, startMarker, endMarker, newContent);
  }
  // Fallback to name-based replacement
  return replaceSectionByName(tex, sectionName, newContent);
}

export function replaceSkillsPreservingFormat(
  tex: string,
  newInnerContent: string
) {
  // Find the Technical Skills section
  const sectionRegex = /(\\section\*?\{[^}]*Technical Skills[^}]*\})([\s\S]*)/i;
  const m = tex.match(sectionRegex);
  if (!m) throw new Error("Section name not found: Technical Skills");

  const sectionStart = m.index!;
  const afterHeader = m[2];

  // Find the first itemize...end{itemize} within the section
  const itemizeRegex = /(\\begin\{itemize\}[^]*?\\end\{itemize})/i;
  const itMatch = afterHeader.match(itemizeRegex);
  if (itMatch && itMatch[0]) {
    const fullItemize = itMatch[0];
    // Replace inner content (keep begin... and end)
    const beginMatch = fullItemize.match(/^(\\begin\{itemize\}[^\n\r]*)/i);
    const beginLine = beginMatch ? beginMatch[1] : "\\begin{itemize}";
    const newItemize = beginLine + "\n" + newInnerContent + "\n\\end{itemize}";
    return tex.replace(fullItemize, newItemize);
  }

  // If no itemize found, append a standard itemize block after the section header
  const insertPoint = sectionStart + m[1].length;
  return (
    tex.slice(0, insertPoint) +
    "\n\\begin{itemize}\n" +
    newInnerContent +
    "\n\\end{itemize}\n" +
    tex.slice(insertPoint)
  );
}
