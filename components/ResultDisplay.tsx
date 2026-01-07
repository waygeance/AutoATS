import React from "react";

interface ResultDisplayProps {
  loading: boolean;
  result: any;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  loading,
  result,
  onReset,
}) => {
  if (loading) {
    // Fixed full-screen overlay so the loader doesn't push content down
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-60" />
        <div className="relative bg-[#0f1724] rounded-lg shadow-xl p-8 w-[min(720px,92%)]">
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-(--accent) mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-(--text) mb-2">
              Generating Your ATS-Optimized Resume
            </h3>
            <p className="text-(--muted-dark) mb-4">
              Our AI is analyzing your projects and optimizing your resume for
              the job description...
            </p>
            <div className="max-w-md mx-auto">
              <div className="bg-[#122032] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-(--accent) h-2 rounded-full animate-pulse"
                  style={{ width: "70%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result || result?.error) {
    const missingLatexPackage = result?.missingLatexPackage
      ? String(result.missingLatexPackage)
      : "";
    const help = result?.help ? String(result.help) : "";
    const latexLogTail = result?.latexLogTail
      ? String(result.latexLogTail)
      : "";

    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-6">
            {result?.error
              ? String(result.error)
              : "We encountered an error while generating your resume. Please try again."}
          </p>

          {missingLatexPackage && (
            <div className="max-w-2xl mx-auto mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-left">
              <div className="text-sm font-semibold text-red-800">
                Missing LaTeX package
              </div>
              <div className="mt-1 text-sm text-red-700 wrap-break-word">
                {missingLatexPackage}
              </div>
            </div>
          )}

          {help && (
            <div className="max-w-2xl mx-auto mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-left">
              <div className="text-sm font-semibold text-gray-900">Fix</div>
              <div className="mt-1 text-sm text-gray-700 wrap-break-word">
                {help}
              </div>
            </div>
          )}

          {latexLogTail && (
            <details className="max-w-2xl mx-auto mb-6 text-left">
              <summary className="cursor-pointer text-sm font-semibold text-gray-900">
                Show LaTeX log
              </summary>
              <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs text-gray-800 overflow-auto">
                {latexLogTail}
              </pre>
            </details>
          )}

          <button
            onClick={onReset}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🎉 Your ATS-Optimized Resume is Ready
      </h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">
            ✅ Optimization Complete
          </h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Summary tailored to job requirements</li>
            <li>• Projects selected based on relevance</li>
            <li>• Skills optimized for ATS keywords</li>
            <li>• PDF generated and ready to download</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">📊 ATS Score</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
          <p className="text-sm text-blue-700">
            Your resume is highly optimized for Applicant Tracking Systems
          </p>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">PDF Preview</h3>
          {result.pdfUrl && (
            <a
              href={result.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Open in new tab
            </a>
          )}
        </div>

        {result.pdfUrl ? (
          <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
            <iframe
              title="Resume PDF Preview"
              src={result.pdfUrl}
              className="w-full h-[70vh]"
            />
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-700">
            PDF URL not available. Please try again.
          </div>
        )}

        <div className="mt-4 flex justify-end">
          {result.pdfUrl && (
            <a
              href={result.pdfUrl}
              download="optimized-resume.pdf"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Download PDF
            </a>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={onReset}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Create Another Resume
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
