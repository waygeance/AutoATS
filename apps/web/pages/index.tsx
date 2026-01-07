import React, { useEffect, useState } from "react";
import Head from "next/head";
import JobDescriptionForm from "../components/JobDescriptionForm";
import ResultDisplay from "../components/ResultDisplay";

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [status, setStatus] = useState<any>(null);

  const refreshStatus = async () => {
    setStatusLoading(true);
    try {
      const r = await fetch("/api/status");
      const data = await r.json();
      setStatus(data);
    } catch (e: any) {
      setStatus({ ok: false, error: String(e?.message || e) });
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  const handleJobSubmit = async (jobDescription: string) => {
    setLoading(true);
    setResult(null);

    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 180000);

      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescription,
        }),
        signal: controller.signal,
      });

      clearTimeout(t);

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      const msg = String(error?.name || error?.message || error);
      if (msg.toLowerCase().includes("abort")) {
        setResult({
          error:
            "Request timed out. Check System Status (Ollama + pdflatex) and try again.",
        });
      } else {
        setResult({ error: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>AutoATS - AI-Powered Resume Builder</title>
        <meta
          name="description"
          content="ATS-optimized resume builder using AI"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AutoATS Resume Builder
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Paste a job description and get an ATS-ready PDF resume.
            </p>
          </header>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    System status
                  </h2>
                  <p className="text-sm text-gray-600">
                    This app needs Ollama (for AI) and pdflatex (for PDF)
                    running locally.
                  </p>
                </div>

                <button
                  onClick={refreshStatus}
                  className="px-4 py-2 text-sm font-semibold border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={statusLoading}
                >
                  {statusLoading ? "Checking..." : "Refresh"}
                </button>
              </div>

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">Ollama</div>
                    <div
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        status?.ollama?.ok
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {status?.ollama?.ok ? "RUNNING" : "NOT RUNNING"}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 wrap-break-word">
                    {status?.ollama?.ok
                      ? status?.ollama?.url
                      : status?.ollama?.error ||
                        status?.error ||
                        "Start it with: ollama serve"}
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">pdflatex</div>
                    <div
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        status?.pdflatex?.ok
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {status?.pdflatex?.ok ? "AVAILABLE" : "MISSING"}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 wrap-break-word">
                    {status?.pdflatex?.ok
                      ? "pdflatex found on PATH"
                      : status?.pdflatex?.error ||
                        "Install TeX Live and ensure pdflatex is on PATH"}
                  </div>
                </div>
              </div>
            </div>

            <JobDescriptionForm onSubmit={handleJobSubmit} />

            {(loading || result) && (
              <ResultDisplay
                loading={loading}
                result={result}
                onReset={() => {
                  setResult(null);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
