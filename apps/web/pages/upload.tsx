import React, { useState } from "react";

export default function UploadPage() {
  const [template, setTemplate] = useState<File | null>(null);
  const [profile, setProfile] = useState<File | null>(null);
  const [jd, setJd] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!template || !profile || !jd)
      return alert("Please provide all three files");
    setLoading(true);
    const fd = new FormData();
    fd.append("template", template);
    fd.append("profile", profile);
    fd.append("jd", jd);

    const res = await fetch("/api/edit-resume", { method: "POST", body: fd });
    const data = await res.json();
    setLoading(false);
    if (data?.id) setResultId(data.id);
    else alert(data?.error || "Unknown error");
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Upload</h1>
      <form onSubmit={submit}>
        <div>
          <label>LaTeX template (.tex)</label>
          <br />
          <input
            type="file"
            accept=".tex"
            onChange={(e) => setTemplate(e.target.files?.[0] || null)}
          />
        </div>
        <div>
          <label>Profile (JSON)</label>
          <br />
          <input
            type="file"
            accept="application/json"
            onChange={(e) => setProfile(e.target.files?.[0] || null)}
          />
        </div>
        <div>
          <label>Job Description (txt)</label>
          <br />
          <input
            type="file"
            accept="text/plain"
            onChange={(e) => setJd(e.target.files?.[0] || null)}
          />
        </div>
        <div style={{ marginTop: 20 }}>
          <button type="submit" disabled={loading}>
            {loading ? "Working..." : "Edit Resume"}
          </button>
        </div>
      </form>

      {resultId && (
        <div style={{ marginTop: 20 }}>
          <a href={`/results/${resultId}`}>View result</a>
        </div>
      )}
    </main>
  );
}
