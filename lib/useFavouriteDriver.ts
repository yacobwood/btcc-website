"use client";

import { useCallback, useSyncExternalStore } from "react";

// Mirrors the app's AsyncStorage-backed favourite-driver store with
// localStorage - same key name isn't shared cross-storage (they're
// different devices/browsers entirely) but the behavior matches: a plain
// list of driver names, toggled on/off, checked with a loose substring match
// so "SUTTON" still matches "Ashley Sutton".
//
// Built on useSyncExternalStore (not useState+useEffect) so every component
// reading favourites re-renders when another one toggles - genuinely
// external, shared, mutable state, which is exactly what this hook is for.
// getSnapshot caches the parsed array and only reparses when the raw string
// actually changes, since useSyncExternalStore requires a stable reference
// when nothing has changed or it throws an infinite-loop warning.
const KEY = "favourite_drivers";
let cachedRaw: string | null | undefined;
let cachedParsed: string[] = [];
const listeners = new Set<() => void>();

function readAll(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === cachedRaw) return cachedParsed;
    cachedRaw = raw;
    cachedParsed = raw ? (JSON.parse(raw) as string[]) : [];
    return cachedParsed;
  } catch {
    return cachedParsed;
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback); // syncs across tabs for free
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getServerSnapshot(): string[] {
  return []; // no favourites during SSR - resolved on the client after mount
}

function writeAll(next: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore - private browsing etc, toggle just won't persist
  }
  cachedRaw = undefined; // force a reparse on the next readAll()
  listeners.forEach((l) => l());
}

export function useFavouriteDriver() {
  const favourites = useSyncExternalStore(subscribe, readAll, getServerSnapshot);

  const isFavourite = useCallback(
    (name: string) => favourites.some((f) => name.toUpperCase().includes(f.toUpperCase())),
    [favourites]
  );

  const toggleFavourite = useCallback((name: string) => {
    const current = readAll();
    const next = current.includes(name) ? current.filter((f) => f !== name) : [...current, name];
    writeAll(next);
  }, []);

  return { isFavourite, toggleFavourite, favourites };
}
