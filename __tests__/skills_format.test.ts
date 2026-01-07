import fs from "fs";
import path from "path";
import { generateSections } from "../server/lib/generator";
import { replaceSkillsPreservingFormat } from "../server/lib/latex";

test("replaceSkillsPreservingFormat preserves itemize options and inserts new skills", () => {
  const tex = fs.readFileSync(
    path.join(__dirname, "..", "examples", "user_resume.tex"),
    "utf8"
  );
  const profile = fs.readFileSync(
    path.join(__dirname, "..", "examples", "sample_profile.json"),
    "utf8"
  );
  const jd = fs.readFileSync(
    path.join(__dirname, "..", "examples", "sample_jd.txt"),
    "utf8"
  );
  const { skillsInner } = generateSections(profile, jd);
  const beforeHasOptions = /\\begin\{itemize\}\[.*\]/.test(tex);
  const newTex = replaceSkillsPreservingFormat(tex, skillsInner);
  expect(/\\textbf\{Languages:/.test(newTex)).toBe(true);
  // Ensure the itemize options are preserved when they existed
  if (beforeHasOptions) {
    expect(/\\begin\{itemize\}\[.*\]/.test(newTex)).toBe(true);
  }
});
