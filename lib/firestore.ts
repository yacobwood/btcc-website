// Read-only Firestore REST access for article reactions/views/comments -
// same public project + API key the app itself uses (see
// src/config/firebase.js), and the same collections (article_reactions,
// article_views, article_comments). Firestore's security rules currently
// allow both read and write with no auth at all (`allow write: if true`,
// see firestore.rules in the app repo) - deliberately NOT wiring up posting
// a comment or a reaction from this website, since doing so would add a
// second, far more easily discoverable public write surface on top of an
// already-unauthenticated, unrated-limited, unmoderated one. Reading is
// safe either way - it's already exactly as open as writing.
const PROJECT_ID = "btcchub-af77a";
const API_KEY = "AIzaSyC0blgpkf9ioMa5QgkIwi9S6iCVnphSeHE";
const FS_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

export async function fetchArticleReactions(slug: string): Promise<{ likes: number; dislikes: number }> {
  try {
    const r = await fetch(`${FS_BASE}/article_reactions/${encodeURIComponent(slug)}?key=${API_KEY}`);
    if (!r.ok) return { likes: 0, dislikes: 0 };
    const doc = await r.json();
    return {
      likes: parseInt(doc?.fields?.likes?.integerValue || "0", 10),
      dislikes: parseInt(doc?.fields?.dislikes?.integerValue || "0", 10),
    };
  } catch {
    return { likes: 0, dislikes: 0 };
  }
}

export async function fetchArticleViews(slug: string): Promise<number> {
  try {
    const r = await fetch(`${FS_BASE}/article_views/${encodeURIComponent(slug)}?key=${API_KEY}`);
    if (!r.ok) return 0;
    const doc = await r.json();
    return parseInt(doc?.fields?.views?.integerValue || "0", 10);
  } catch {
    return 0;
  }
}

export interface ArticleComment {
  id: string;
  text: string;
  authorName: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  parentId: string | null;
}

export async function fetchArticleComments(slug: string): Promise<ArticleComment[]> {
  try {
    const res = await fetch(`${FS_BASE}:runQuery?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "article_comments" }],
          where: { fieldFilter: { field: { fieldPath: "slug" }, op: "EQUAL", value: { stringValue: slug } } },
          limit: 200,
        },
      }),
    });
    if (!res.ok) return [];
    const rows = await res.json();
    return rows
      .filter((r: { document?: unknown }) => r.document)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((r: any) => {
        const f = r.document.fields;
        return {
          id: r.document.name.split("/").pop(),
          text: f.text?.stringValue || "",
          authorName: f.authorName?.stringValue || "Fan",
          timestamp: f.timestamp?.stringValue || "",
          likes: parseInt(f.likes?.integerValue || "0", 10),
          dislikes: parseInt(f.dislikes?.integerValue || "0", 10),
          hidden: f.hidden?.booleanValue || false,
          parentId: f.parentId?.stringValue || null,
        };
      })
      .filter((c: ArticleComment & { hidden?: boolean }) => !c.hidden)
      .sort((a: ArticleComment, b: ArticleComment) => a.timestamp.localeCompare(b.timestamp));
  } catch {
    return [];
  }
}
