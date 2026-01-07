import React, { useState } from "react";

interface JobDescriptionFormProps {
  onSubmit: (jobDescription: string) => void;
}

const JobDescriptionForm: React.FC<JobDescriptionFormProps> = ({
  onSubmit,
}) => {
  const [jobDescription, setJobDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobDescription.trim()) {
      onSubmit(jobDescription);
    }
  };

  return (
    <div className="bg-[#0f1724] rounded-xl shadow-xl border border-[#1f2937] p-8">
      <h2 className="text-2xl font-bold text-(--text) mb-2">Job description</h2>
      <p className="text-sm text-(--muted-dark)">
        Paste the job description. We’ll update only the resume Summary and
        Projects and generate a PDF.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="jobDescription"
            className="block text-sm font-medium text-(--text) mb-2"
          >
            Job description
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full h-64 px-4 py-3 border rounded-lg resize-none bg-[#081124] text-(--text) placeholder-(--muted-dark) border-[#22303f] focus:outline-none focus:ring-2 focus:ring-(--accent)"
            placeholder="Paste the complete job description here..."
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            Tip: include requirements + responsibilities for better keyword
            matching.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!jobDescription.trim()}
            className="px-6 py-3 bg-(--accent) text-[#072034] font-semibold rounded-lg hover:bg-(--accent-600) focus:outline-none focus:ring-2 focus:ring-(--accent) focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Generate PDF →
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobDescriptionForm;
