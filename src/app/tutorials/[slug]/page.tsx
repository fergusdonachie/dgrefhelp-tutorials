import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { getTutorialDoc, listTutorialSlugs } from "@/lib/tutorials";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return listTutorialSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const doc = getTutorialDoc(slug);
    return {
      title: `${doc.frontmatter.title} | DGRefHelp Tutorials`,
      description: doc.frontmatter.description,
    };
  } catch {
    return { title: "Tutorial | DGRefHelp Tutorials" };
  }
}

export default async function TutorialPage({ params }: Props) {
  const { slug } = await params;

  let doc;
  try {
    doc = getTutorialDoc(slug);
  } catch {
    notFound();
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px" }}>
      <MDXRemote
        source={doc.content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </main>
  );
}
