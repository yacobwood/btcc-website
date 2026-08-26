"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Colors, MedalColors, SYSTEM_FONT_STACK } from "@/lib/appTheme";
import { shortSessionLabel } from "@/lib/data";
import { useFavouriteDriver } from "@/lib/useFavouriteDriver";
import type { ResultsRound, RaceSession, ResultRow } from "@/types";

// Mirrors buildGridMap() in RoundResultsScreen.js exactly: prefer the
// session's own published starting grid, otherwise derive one from the
// previous session's finishing order for the sessions that carry one over.
function buildGridMap(races: RaceSession[], raceIndex: number): Record<string, number> | null {
  const race = races[raceIndex];
  if (!race) return null;

  if (race.grid?.length) {
    const map: Record<string, number> = {};
    race.grid.forEach((g) => {
      if (g.driver) map[g.driver] = g.pos;
    });
    return Object.keys(map).length ? map : null;
  }

  let sourceLabel: string | undefined;
  if (race.label === "Qualifying Race") sourceLabel = "Qualifying";
  else if (race.label === "Race 1") sourceLabel = "Qualifying Race";
  else if (race.label === "Race 2") sourceLabel = "Race 1";
  else return null;

  const sourceRace = races.find((r) => r.label === sourceLabel);
  if (!sourceRace?.results?.length) return null;
  const map: Record<string, number> = {};
  sourceRace.results.forEach((r, i) => {
    if (r.driver && r.pos > 0) map[r.driver] = i + 1;
  });
  return Object.keys(map).length ? map : null;
}

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 18,
        height: 16,
        padding: "0 4px",
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 800,
        color: Colors.background,
        background: color,
      }}
    >
      {text}
    </span>
  );
}

function ResultRowView({ item, gridMap, isFav, onToggleFav }: {
  item: ResultRow;
  gridMap: Record<string, number> | null;
  isFav: boolean;
  onToggleFav: () => void;
}) {
  const isDNF = item.pos === 0 || item.status === "DNF" || item.status === "DNS";
  const posLabel = item.status === "DQ" ? "DQ" : item.status === "DNS" ? "DNS" : item.status === "DNF" ? "DNF" : item.pos;
  const posColor = item.pos === 1 ? MedalColors.gold : item.pos === 2 ? MedalColors.silver : item.pos === 3 ? MedalColors.bronze : Colors.textPrimary;
  const gridPos = gridMap?.[item.driver];
  const delta = gridPos != null && !isDNF ? gridPos - item.pos : null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 16px",
        borderRadius: 10,
        background: Colors.card,
        marginBottom: 6,
        border: isFav ? `1px solid ${Colors.yellow}80` : "1px solid transparent",
        opacity: isDNF ? 0.6 : 1,
      }}
    >
      <span style={{ width: 30, textAlign: "center", fontWeight: 800, fontSize: 15, color: isDNF ? Colors.textSecondary : posColor }}>
        {posLabel}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <button
            onClick={onToggleFav}
            aria-label={isFav ? `Remove ${item.driver} from favourites` : `Add ${item.driver} to favourites`}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: isFav ? Colors.yellow : Colors.outline, fontSize: 13, lineHeight: 1 }}
          >
            ★
          </button>
          <span style={{ fontWeight: 700, fontSize: 14, color: isFav ? Colors.yellow : Colors.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {item.driver}
          </span>
          {item.fastestLap && <Badge text="FL" color="#A855F7" />}
          {item.leadLap && <Badge text="L" color={Colors.yellow} />}
          {item.pole && <Badge text="P" color={Colors.yellow} />}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
          <span style={{ fontSize: 12, color: Colors.textSecondary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.team}</span>
          {delta !== null && delta !== 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 11, fontWeight: 700, color: delta > 0 ? "#4ADE80" : "#F87171" }}>
              {delta > 0 ? "▲" : "▼"} {Math.abs(delta)}
            </span>
          )}
        </div>
      </div>
      <span style={{ fontWeight: 800, fontSize: 15, color: Colors.textPrimary, whiteSpace: "nowrap" }}>
        {item.points > 0 ? `+${item.points} pts` : isDNF ? "" : "0 pts"}
      </span>
    </div>
  );
}

function StartingGridView({ race }: { race: RaceSession }) {
  const { isFavourite, toggleFavourite } = useFavouriteDriver();
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: Colors.textSecondary, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        Starting Grid
      </div>
      {(race.grid || []).map((g) => (
        <div key={g.pos} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 10, background: Colors.card, marginBottom: 6 }}>
          <span style={{ width: 30, textAlign: "center", fontWeight: 800, fontSize: 15, color: Colors.textPrimary }}>{g.pos}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: isFavourite(g.driver) ? Colors.yellow : Colors.textPrimary }}>{g.driver}</div>
            {g.team && <div style={{ fontSize: 12, color: Colors.textSecondary }}>{g.team}</div>}
          </div>
          <button
            onClick={() => toggleFavourite(g.driver)}
            aria-label="Toggle favourite"
            style={{ background: "none", border: "none", cursor: "pointer", color: isFavourite(g.driver) ? Colors.yellow : Colors.outline, fontSize: 15 }}
          >
            ★
          </button>
        </div>
      ))}
    </div>
  );
}

export default function RoundResultsView({ round, initialRaceIndex }: { round: ResultsRound; initialRaceIndex: number }) {
  const [activeRace, setActiveRace] = useState(
    Math.min(Math.max(initialRaceIndex, 0), Math.max(round.races.length - 1, 0))
  );
  const { isFavourite, toggleFavourite } = useFavouriteDriver();

  const race = round.races[activeRace];
  const gridMap = useMemo(() => buildGridMap(round.races, activeRace), [round.races, activeRace]);
  const rStart = (round.round - 1) * 3 + 1;
  const rEnd = rStart + 2;

  const hasResults = (race?.results?.length ?? 0) > 0;
  const hasGrid = (race?.grid?.length ?? 0) > 0;

  return (
    <div style={{ minHeight: "100vh", background: Colors.background, fontFamily: SYSTEM_FONT_STACK, color: Colors.textPrimary }}>
      {/* Header - matches RoundResultsScreen.js's header row: back link, venue/date, share */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px", borderBottom: `1px solid ${Colors.outline}` }}>
        <Link href="/results" aria-label="Back to results" style={{ color: Colors.textPrimary, textDecoration: "none", fontSize: 20 }}>
          ←
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{round.venue}</div>
          <div style={{ fontSize: 12, color: Colors.textSecondary }}>
            Rounds {rStart}–{rEnd} · {round.date}
          </div>
        </div>
      </div>

      {/* Session tabs - FP / QUAL / Q RACE / R1 / R2 / R3, matching shortLabel() */}
      <div style={{ display: "flex", overflowX: "auto", borderBottom: `1px solid ${Colors.outline}` }}>
        {round.races.map((r, i) => (
          <button
            key={r.label}
            onClick={() => setActiveRace(i)}
            style={{
              flex: "1 0 auto",
              padding: "12px 16px",
              background: "none",
              border: "none",
              borderBottom: i === activeRace ? `2px solid ${Colors.yellow}` : "2px solid transparent",
              color: i === activeRace ? Colors.yellow : Colors.textSecondary,
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: "0.04em",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {shortSessionLabel(r.label)}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
        {!race ? (
          <div style={{ textAlign: "center", color: Colors.textSecondary, padding: "48px 0" }}>No session data for this round yet.</div>
        ) : hasResults ? (
          race.results.map((item) => (
            <ResultRowView
              key={`${item.no}-${item.pos}`}
              item={item}
              gridMap={gridMap}
              isFav={isFavourite(item.driver)}
              onToggleFav={() => toggleFavourite(item.driver)}
            />
          ))
        ) : hasGrid ? (
          <StartingGridView race={race} />
        ) : (
          <div style={{ textAlign: "center", color: Colors.textSecondary, padding: "48px 0" }}>Results TBC</div>
        )}
      </div>
    </div>
  );
}
