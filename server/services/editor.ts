import { callAI } from "./ai";
import {
  validateOnlyAllowedChanges,
  replaceSectionSmart,
  replaceSkillsPreservingFormat,
} from "../lib/latex";

export async function processResume({
  template,
  profile,
  jd,
}: {
  template: string;
  profile: string;
  jd: string;
}) {
  // Build prompt
  const prompt = `You are an expert ATS LaTeX resume editor. Modify ONLY the Summary, Projects, and Technical Skills sections of the given LaTeX template. Use only facts from the candidate profile. Use ATS keywords from the JD only if they exist in the profile. Keep the output to a single-page LaTeX file. Return only the full LaTeX content and nothing else.`;
  const aiInput = {
    template,
    profile,
    jd,
    instructions: prompt,
  };

  let updated: string | null = null;
  try {
    const aiResponse = await callAI(aiInput);
    updated = aiResponse.updatedTemplate;
  } catch (e) {
    // AI failed; we will fallback to deterministic generator
    updated = null;
  }

  // If AI returned something, validate it; otherwise use fallback generator
  if (updated) {
    const onlyAllowed = validateOnlyAllowedChanges(template, updated);
    if (!onlyAllowed) {
      // fallback
      updated = null;
    }
  }

  if (!updated) {
    // Deterministic fallback: generate sections and replace in template using markers
    const { generateSections } = await import("../lib/generator");
    const { summary, projectsTex, skillsTex, skillsInner } = generateSections(
      profile,
      jd
    );
    try {
      let t = template;
      t = replaceSectionSmart(
        t,
        "% START SUMMARY",
        "% END SUMMARY",
        "Summary",
        summary
      );
      t = replaceSectionSmart(
        t,
        "% START PROJECTS",
        "% END PROJECTS",
        "Projects",
        projectsTex
      );
      // Preserve existing skills formatting when possible
      try {
        t = replaceSkillsPreservingFormat(t, skillsInner);
      } catch (e) {
        // Fallback: replace whole section if preserving format fails
        t = replaceSectionSmart(
          t,
          "% START SKILLS",
          "% END SKILLS",
          "Technical Skills",
          skillsTex
        );
      }
      updated = t;
    } catch (e: any) {
      throw new Error("Fallback generation failed: " + e.message);
    }
  }

  // Ask compile service to produce PDF
  let pdfUrl = null;
  try {
    const resp = await fetch("http://localhost:3030/compile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tex: updated }),
    });
    if (resp.ok) {
      const j = await resp.json();
      pdfUrl = j.pdfUrl;
    }
  } catch (e) {
    // compile service not available; continue without PDF
  }

  return { latex: updated as string, pdfUrl };
}
