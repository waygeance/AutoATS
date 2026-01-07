import type { NextApiRequest, NextApiResponse } from "next";
import { processResume } from "../../server/services/editor";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { template, profile, jd } = req.body || {};
    if (!template || !profile || !jd)
      return res
        .status(400)
        .json({ error: "missing template/profile/jd in JSON body" });
    const result = await processResume({
      template,
      profile: JSON.stringify(profile),
      jd,
    });
    const id = Date.now().toString();
    const fs = require("fs");
    const path = require("path");
    const outDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
    fs.writeFileSync(path.join(outDir, `${id}.json`), JSON.stringify(result));
    return res.json({ id });
  } catch (e: any) {
    return res.status(500).json({ error: String(e) });
  }
}
