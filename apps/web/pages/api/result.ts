import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "missing id" });
  const file = path.join(process.cwd(), "tmp", `${id}.json`);
  if (!fs.existsSync(file)) return res.status(404).json({ error: "not found" });
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  res.json(data);
}
