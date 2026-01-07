const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json({ limit: "5mb" }));

// Serve compiled PDFs from a public folder
const publicDir = path.join(__dirname, "public");
fs.mkdirSync(publicDir, { recursive: true });
app.use("/pdf", express.static(publicDir));

function runPdflatex(texFile, dir) {
  return new Promise((resolve, reject) => {
    const cmd = `pdflatex -interaction=nonstopmode -halt-on-error -output-directory=${dir} ${texFile} && pdflatex -interaction=nonstopmode -halt-on-error -output-directory=${dir} ${texFile}`;
    exec(cmd, { maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) return reject(stderr || err);
      resolve({ stdout, stderr });
    });
  });
}

app.post("/compile", async (req, res) => {
  const { tex } = req.body;
  if (!tex) return res.status(400).json({ error: "missing tex" });

  // Basic safety checks
  const banned = ["\\write18", "\\input{", "\\include{", "\\openout"];
  for (const b of banned) {
    if (tex.includes(b))
      return res.status(400).json({ error: "disallowed LaTeX commands found" });
  }

  const id = Date.now().toString();
  const dir = path.join("/tmp", "autoats", id);
  fs.mkdirSync(dir, { recursive: true });
  const texFile = path.join(dir, "resume.tex");
  fs.writeFileSync(texFile, tex);

  try {
    await runPdflatex(texFile, dir);
    const pdfPath = path.join(dir, "resume.pdf");
    if (!fs.existsSync(pdfPath))
      return res.status(500).json({ error: "pdf not produced" });
    // Copy to public folder so it can be served
    const dest = path.join(publicDir, `${id}.pdf`);
    fs.copyFileSync(pdfPath, dest);
    const host = process.env.HOST || "localhost";
    const port = process.env.PORT || 3030;
    return res.json({ pdfUrl: `http://${host}:${port}/pdf/${id}.pdf`, id });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
});

app.get("/health", (req, res) => res.json({ ok: true }));

app.listen(process.env.PORT || 3030, () =>
  console.log("LaTeX compile service listening on", process.env.PORT || 3030)
);
