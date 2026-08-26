"use client";

import { useEffect, useState } from "react";
import { Colors } from "@/lib/appTheme";
import { fetchArticleReactions, fetchArticleViews, fetchArticleComments, type ArticleComment } from "@/lib/firestore";

function timeAgo(iso: string): string {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// Read-only reflection of ArticleScreen.js's reactions bar, view counter and
// comments list. Deliberately no "post a comment" / "react" UI here - see
// lib/firestore.ts for why (the underlying Firestore rules have no auth,
// rate-limiting or moderation at all today, in the app too, not just here;
// adding a second, more easily discoverable public write surface on top of
// that felt like the wrong default without that being fixed first).
export default function ArticleEngagement({ slug }: { slug: string }) {
  const [reactions, setReactions] = useState({ likes: 0, dislikes: 0 });
  const [views, setViews] = useState(0);
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchArticleReactions(slug), fetchArticleViews(slug), fetchArticleComments(slug)]).then(
      ([r, v, c]) => {
        if (cancelled) return;
        setReactions(r);
        setViews(v);
        setComments(c);
        setLoaded(true);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!loaded) return null;

  return (
    <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${Colors.outline}` }}>
      {views > 0 && (
        <p style={{ fontSize: 12, color: Colors.textSecondary, textAlign: "center", marginBottom: 16 }}>
          {views.toLocaleString()} {views === 1 ? "view" : "views"}
        </p>
      )}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flex: 1, maxWidth: 200, padding: "12px 0", borderRadius: 32, background: "rgba(255,255,255,0.08)", color: "#fff", fontWeight: 700, fontSize: 15 }}>
          👎 {reactions.dislikes}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flex: 1, maxWidth: 200, padding: "12px 0", borderRadius: 32, background: "rgba(255,255,255,0.08)", color: "#fff", fontWeight: 700, fontSize: 15 }}>
          👍 {reactions.likes}
        </div>
      </div>

      {comments.length > 0 && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>
            {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {comments
              .filter((c) => !c.parentId)
              .map((c) => (
                <div key={c.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ color: Colors.textSecondary, fontSize: 14, fontWeight: 700 }}>{c.authorName}</span>
                    <span style={{ color: Colors.textSecondary, fontSize: 12 }}>{timeAgo(c.timestamp)}</span>
                  </div>
                  <p style={{ color: "#fff", fontSize: 15, lineHeight: 1.5, margin: 0 }}>{c.text}</p>
                  {(c.likes > 0 || c.dislikes > 0) && (
                    <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 12, color: Colors.textSecondary }}>
                      {c.likes > 0 && <span>👍 {c.likes}</span>}
                      {c.dislikes > 0 && <span>👎 {c.dislikes}</span>}
                    </div>
                  )}
                  {comments
                    .filter((r) => r.parentId === c.id)
                    .map((r) => (
                      <div key={r.id} style={{ marginTop: 12, marginLeft: 24, paddingLeft: 12, borderLeft: `2px solid ${Colors.outline}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <span style={{ color: Colors.textSecondary, fontSize: 13, fontWeight: 700 }}>{r.authorName}</span>
                          <span style={{ color: Colors.textSecondary, fontSize: 11 }}>{timeAgo(r.timestamp)}</span>
                        </div>
                        <p style={{ color: "#fff", fontSize: 14, lineHeight: 1.5, margin: 0 }}>{r.text}</p>
                      </div>
                    ))}
                </div>
              ))}
          </div>
        </div>
      )}

      <p style={{ marginTop: 24, fontSize: 12, color: Colors.textSecondary, textAlign: "center" }}>
        Open the BTCC Hub app to join the conversation.
      </p>
    </div>
  );
}
