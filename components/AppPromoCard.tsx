import { PLAY_STORE_URL } from "@/lib/appLinks";

// The cross-promote unit that replaces the old site's blocking "open in
// app" gate - used inline wherever a page touches something the web
// genuinely can't do (live timing, chat, push), never as a wall in front of
// real content.
export default function AppPromoCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl border border-btcc-yellow/30 bg-gradient-to-br from-card to-surface p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-display text-lg font-bold text-foreground">{title}</p>
        <p className="mt-1 max-w-md text-sm text-muted">{body}</p>
      </div>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center justify-center rounded-lg bg-btcc-yellow px-5 py-2.5 text-sm font-bold text-background transition-transform hover:scale-[1.03]"
      >
        Get the app
      </a>
    </div>
  );
}
