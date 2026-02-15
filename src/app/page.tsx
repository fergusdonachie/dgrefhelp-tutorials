import Link from "next/link";

export default function HomePage() {
  return (
    <div className="card">
      <h1 className="h1">DGRefHelp tutorials (draft)</h1>
      <p className="p">
        Public-facing GP trainee tutorials built around realistic primary care cases and staged
        reveal teaching.
      </p>
      <ul className="list">
        <li>
          Start here: <Link href="/tutorials">Browse tutorials</Link>
        </li>
        <li>Roadmap: MDX-authored tutorials + reusable teaching components + search/tagging.</li>
      </ul>
    </div>
  );
}
