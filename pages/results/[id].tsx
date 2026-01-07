import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Result() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/result?id=${id}`)
      .then((r) => r.json())
      .then(setData);
  }, [id]);

  if (!data) return <main style={{ padding: 40 }}>Loading...</main>;

  return (
    <main style={{ padding: 40 }}>
      <h1>Result</h1>
      <div>
        <h2>LaTeX</h2>
        <pre
          style={{ whiteSpace: "pre-wrap", background: "#f6f6f6", padding: 10 }}
        >
          {data.latex}
        </pre>
      </div>
      <div>
        <h2>PDF</h2>
        {data.pdfUrl ? (
          <a href={data.pdfUrl} target="_blank">
            Download PDF
          </a>
        ) : (
          <p>No PDF available</p>
        )}
      </div>
    </main>
  );
}
