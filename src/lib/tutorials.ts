import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type TutorialFrontmatter = {
  title: string;
  description?: string;
  tags?: string[];
  date?: string; // ISO string
};

export type TutorialIndexItem = TutorialFrontmatter & {
  slug: string;
};

export type TutorialDoc = {
  slug: string;
  frontmatter: TutorialFrontmatter;
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "tutorials");

function isMdxFile(name: string) {
  return name.endsWith(".mdx") || name.endsWith(".md");
}

export function listTutorialSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter(isMdxFile)
    .map((f) => f.replace(/\.(mdx|md)$/, ""))
    .sort();
}

export function getTutorialIndex(): TutorialIndexItem[] {
  return listTutorialSlugs()
    .map((slug) => {
      const doc = getTutorialDoc(slug);
      return {
        slug,
        ...doc.frontmatter,
        tags: doc.frontmatter.tags ?? [],
      };
    })
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

export function getTutorialDoc(slug: string): TutorialDoc {
  const fullPathMdx = path.join(CONTENT_DIR, `${slug}.mdx`);
  const fullPathMd = path.join(CONTENT_DIR, `${slug}.md`);
  const fullPath = fs.existsSync(fullPathMdx) ? fullPathMdx : fullPathMd;

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Tutorial not found: ${slug}`);
  }

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  const fm = data as Partial<TutorialFrontmatter>;
  if (!fm.title) {
    throw new Error(`Tutorial '${slug}' missing required frontmatter: title`);
  }

  return {
    slug,
    frontmatter: {
      title: fm.title,
      description: fm.description,
      tags: fm.tags ?? [],
      date: fm.date,
    },
    content,
  };
}
