import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

function getPdfPath(id: string) {
  return path.join("/tmp", "autoats", "pdf", `${id}.pdf`);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).end("invalid id");

  const pdfPath = getPdfPath(id);
  if (!fs.existsSync(pdfPath)) return res.status(404).end("not found");

  const stat = fs.statSync(pdfPath);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Length", stat.size);
  res.setHeader("Cache-Control", "no-store");

  const stream = fs.createReadStream(pdfPath);
  stream.on("error", () => res.status(500).end("read error"));
  stream.pipe(res);
}
