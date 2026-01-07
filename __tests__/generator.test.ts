import { generateSections } from "../server/lib/generator";
import sample from "../examples/sample_profile.json";
import fs from "fs";

test("generator creates summary and sections", () => {
  const jd = fs.readFileSync("examples/sample_jd.txt", "utf8");
  const res = generateSections(JSON.stringify(sample), jd);
  expect(res.summary).toBeTruthy();
  expect(res.projectsTex).toContain("\\section*{Projects}");
  expect(res.skillsTex).toContain("\\section*{Technical Skills}");
});
