import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { processResume } from "../../server/services/editor";

export const config = { api: { bodyParser: false } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();
  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: String(err) });
    try {
      console.log("UPLOAD FILES keys:", Object.keys(files || {}));
      for (const k of Object.keys(files || {})) {
        const f = (files as any)[k];
        if (Array.isArray(f) && f.length)
          console.log("file", k, "is array, first keys", Object.keys(f[0]));
        else if (f) console.log("file", k, "keys", Object.keys(f));
      }
      function getPath(f: any) {
        if (!f) return undefined;
        // handle array (when formidable returns array of files)
        if (Array.isArray(f) && f.length > 0) f = f[0];
        return (
          f.filepath ||
          f.filePath ||
          f.path ||
          (f.file && f.file.path) ||
          undefined
        );
      }
      const templatePath = getPath(
        (files as any).template ||
          (files as any).templateFile ||
          (files as any).file
      );
      const profilePath = getPath(
        (files as any).profile || (files as any).profileFile
      );
      const jdPath = getPath((files as any).jd || (files as any).jdFile);
      if (!templatePath || !profilePath || !jdPath)
        return res.status(400).json({ error: "missing uploaded files" });
      const template = fs.readFileSync(templatePath, "utf8");
      const profile = fs.readFileSync(profilePath, "utf8");
      const jd = fs.readFileSync(jdPath, "utf8");

      const result = await processResume({ template, profile, jd });
      // store result in a tmp file for results page (simple approach)
      const id = Date.now().toString();
      const outDir = path.join(process.cwd(), "tmp");
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
      fs.writeFileSync(path.join(outDir, `${id}.json`), JSON.stringify(result));
      return res.json({ id });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });
}
