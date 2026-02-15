import Link from "next/link";
import { getTutorialIndex } from "@/lib/tutorials";

export const metadata = {
  title: "Tutorials | DGRefHelp",
};

export default function TutorialsIndexPage() {
  const tutorials = getTutorialIndex();

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px" }}>
      <h1>Tutorials</h1>
      <p>Case-based GP trainee tutorials with staged reveals.</p>

      {tutorials.length === 0 ? (
        <p>
          No tutorials yet. Add MDX files under <code>content/tutorials</code>.
        </p>
      ) : (
        <ul>
          {tutorials.map((t) => (
            <li key={t.slug} style={{ marginBottom: 14 }}>
              <div>
                <Link href={`/tutorials/${t.slug}`}>{t.title}</Link>
              </div>
              {t.description ? (
                <div style={{ color: "#444" }}>{t.description}</div>
              ) : null}
              {t.tags?.length ? (
                <div style={{ fontSize: 12, color: "#666" }}>
                  Tags: {t.tags.join(", ")}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
