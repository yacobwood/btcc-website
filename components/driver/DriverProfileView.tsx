"use client";

import { Colors, MedalColors, SYSTEM_FONT_STACK } from "@/lib/appTheme";
import { formatDriverName } from "@/lib/formatDriverName";
import { useFavouriteDriver } from "@/lib/useFavouriteDriver";

// carThumbCropUrl() from api/parsers.js in the app - the cropped car-livery
// variant (no logo-clearance padding), used for this screen's full-bleed
// car banner specifically.
function carThumbCropUrl(url?: string) {
  if (!url) return url;
  return url.replace(/(\.[a-z0-9]+)$/i, "-thumb-crop$1");
}

function calcAge(dateStr?: string) {
  if (!dateStr) return null;
  const dob = new Date(dateStr);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

type HistoryEntry = {
  year: number;
  team: string;
  car?: string;
  pos: number;
  points: number;
  wins: number;
  podiums?: number;
  poles?: number;
  fastestLaps?: number;
  dnfs?: number;
  isChampion?: boolean;
};

export type DriverProfile = {
  number: number;
  name: string;
  team?: string;
  car?: string;
  imageUrl?: string;
  cardBgUrl?: string;
  numberImageUrl?: string;
  carImageUrl?: string;
  nationality?: string;
  bio?: string;
  dateOfBirth?: string;
  birthplace?: string;
  livesIn?: string;
  class?: string; // 'I' | 'M'
  lightCardBg?: boolean;
  history: HistoryEntry[];
};

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ flex: 1, background: Colors.card, borderRadius: 10, padding: "10px 14px" }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: Colors.textPrimary }}>{value}</div>
      <div style={{ fontSize: 11, color: Colors.textSecondary, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function CareerStat({ label, value, highlight }: { label: string; value: number | string; highlight?: boolean }) {
  return (
    <div style={{ flex: 1, textAlign: "center", padding: "4px 0" }}>
      <div style={{ fontSize: 20, fontWeight: 900, color: highlight ? Colors.yellow : Colors.textPrimary }}>{value}</div>
      <div style={{ fontSize: 10, fontWeight: 700, color: Colors.textSecondary, marginTop: 2 }}>{label}</div>
    </div>
  );
}

const Divider = () => <div style={{ width: 1, height: 36, background: "rgba(42,45,68,0.6)" }} />;

const BADGE_STYLES: Record<string, { bg: string; color: string; weight: number }> = {
  pts: { bg: "rgba(0,200,83,0.12)", color: "#00C853", weight: 600 },
  win: { bg: "rgba(254,189,2,0.15)", color: Colors.yellow, weight: 800 },
  podium: { bg: "rgba(192,192,192,0.12)", color: "#C0C0C0", weight: 700 },
  pole: { bg: "rgba(91,163,255,0.15)", color: "#5BA3FF", weight: 700 },
  fl: { bg: "rgba(168,85,247,0.15)", color: "#A855F7", weight: 800 },
  dnf: { bg: "rgba(255,68,68,0.15)", color: "#ff4444", weight: 700 },
};

function Badge({ kind, children }: { kind: keyof typeof BADGE_STYLES; children: React.ReactNode }) {
  const s = BADGE_STYLES[kind];
  return (
    <span style={{ background: s.bg, color: s.color, fontWeight: s.weight, fontSize: 11, borderRadius: 6, padding: "3px 7px" }}>
      {children}
    </span>
  );
}

// Position-over-time line chart - direct DOM-SVG translation of
// CareerTimeline in DriverDetailScreen.js (same geometry: Y axis is
// finishing position, inverted so P1 sits at the top).
function CareerTimeline({ history }: { history: HistoryEntry[] }) {
  const entries = [...history].filter((h) => h.pos > 0).sort((a, b) => a.year - b.year);
  if (entries.length < 2) return null;

  const W = 640, H = 130, PL = 30, PR = 8, PT = 14, PB = 18;
  const plotW = W - PL - PR;
  const plotH = H - PT - PB;
  const maxPos = Math.max(...entries.map((e) => e.pos), 10);
  const xOf = (i: number) => PL + (i / (entries.length - 1)) * plotW;
  const yOf = (pos: number) => PT + ((pos - 1) / (maxPos - 1)) * plotH;
  const ticks = [1];
  for (let v = 5; v <= maxPos; v += 5) ticks.push(v);
  const linePoints = entries.map((h, i) => `${xOf(i)},${yOf(h.pos)}`).join(" ");
  const dotColor = (h: HistoryEntry) =>
    h.isChampion ? Colors.yellow : h.pos === 2 ? "#C0C0C0" : h.pos === 3 ? "#CD7F32" : h.pos <= 10 ? "#fff" : Colors.textSecondary;

  return (
    <div style={{ background: Colors.card, borderRadius: 10, padding: "10px 8px 6px", marginBottom: 12, overflow: "hidden" }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        {ticks.map((v) => (
          <line key={v} x1={PL} y1={yOf(v)} x2={W - PR} y2={yOf(v)} stroke={Colors.outline} strokeWidth={0.5} />
        ))}
        {ticks.map((v) => (
          <text key={`l${v}`} x={PL - 6} y={yOf(v) + 3} fill={Colors.textSecondary} fontSize={8} fontWeight={600} textAnchor="end">
            P{v}
          </text>
        ))}
        <polyline points={linePoints} fill="none" stroke="rgba(139,143,168,0.35)" strokeWidth={1.5} strokeLinejoin="round" />
        {entries.map((h, i) => (
          <g key={h.year}>
            <circle cx={xOf(i)} cy={yOf(h.pos)} r={4} fill={dotColor(h)} />
            {h.isChampion && (
              <text x={xOf(i)} y={yOf(h.pos) - 7} fill={Colors.yellow} fontSize={9} textAnchor="middle">
                ★
              </text>
            )}
          </g>
        ))}
        {entries.map((h, i) => (
          <text key={`y${h.year}`} x={xOf(i)} y={H - 2} fill={Colors.textSecondary} fontSize={8} textAnchor="middle">
            {"'" + String(h.year).slice(2)}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default function DriverProfileView({ driver, currentSeason }: { driver: DriverProfile; currentSeason: number }) {
  const { isFavourite, toggleFavourite } = useFavouriteDriver();
  const fav = isFavourite(driver.name);

  const history = driver.history || [];
  const hasCurrentSeasonInHistory = history.some((h) => h.year === currentSeason);

  const totalSeasons = history.length;
  const totalWins = history.reduce((s, h) => s + h.wins, 0);
  const totalPodiums = history.reduce((s, h) => s + (h.podiums || 0), 0);
  const totalPoles = history.reduce((s, h) => s + (h.poles || 0), 0);
  const totalFL = history.reduce((s, h) => s + (h.fastestLaps || 0), 0);
  const totalPoints = history.reduce((s, h) => s + h.points, 0);
  const totalDNFs = history.reduce((s, h) => s + (h.dnfs || 0), 0);
  const championships = history.filter((h) => h.isChampion).length;
  const bestPos = history.filter((h) => h.pos > 0).reduce((best, h) => Math.min(best, h.pos), 999);

  const age = calcAge(driver.dateOfBirth);
  const dobFormatted = driver.dateOfBirth
    ? new Date(driver.dateOfBirth).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div style={{ minHeight: "100vh", background: Colors.background, fontFamily: SYSTEM_FONT_STACK, color: Colors.textPrimary }}>
      {/* Header - square aspect ratio matching headerBg in the app, car number top-right, photo bottom */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "1", overflow: "hidden", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
        {driver.cardBgUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={driver.cardBgUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        {driver.numberImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={driver.numberImageUrl} alt="" style={{ position: "absolute", top: 30, right: 0, width: "45%", height: "36%", objectFit: "contain" }} />
        ) : (
          <span style={{ position: "absolute", top: 26, right: 5, fontSize: 110, fontWeight: 900, color: driver.lightCardBg ? "#000" : "#fff", opacity: 0.9 }}>
            {driver.number}
          </span>
        )}
        {driver.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={driver.imageUrl} alt={driver.name} style={{ width: "100%", height: "90%", objectFit: "contain" }} />
        )}
      </div>

      {/* Name + favourite */}
      <div style={{ display: "flex", alignItems: "center", padding: "14px 16px", background: Colors.background }}>
        <h1 style={{ flex: 1, fontSize: 22, fontWeight: 800, margin: 0 }}>{formatDriverName(driver.name)}</h1>
        <button
          onClick={() => toggleFavourite(driver.name)}
          aria-label={fav ? "Remove from favourites" : "Add to favourites"}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 26, color: fav ? Colors.yellow : Colors.textSecondary }}
        >
          {fav ? "★" : "☆"}
        </button>
      </div>

      {/* Car livery strip - the driver's own car, full-bleed, natural landscape aspect ratio */}
      {driver.carImageUrl && (
        <div style={{ width: "100%", aspectRatio: "3.1", background: Colors.surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={carThumbCropUrl(driver.carImageUrl)} alt={`${driver.name}'s car`} style={{ width: "94%", height: "94%", objectFit: "contain" }} />
        </div>
      )}

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px" }}>
        {/* Key facts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {driver.nationality && <StatBox label="Nationality" value={driver.nationality} />}
            {driver.team && <StatBox label="Team" value={driver.team} />}
          </div>
          {(driver.car || driver.class === "I" || driver.class === "M") && (
            <div style={{ display: "flex", gap: 8 }}>
              {driver.car && <StatBox label="Car" value={driver.car} />}
              {driver.class === "I" && <StatBox label="Class" value="Independents" />}
              {driver.class === "M" && <StatBox label="Class" value="Main Championship" />}
            </div>
          )}
        </div>

        {/* Bio */}
        {driver.bio && (
          <div style={{ background: Colors.card, borderRadius: 10, padding: 16, marginBottom: 12 }}>
            <p style={{ color: Colors.textSecondary, fontSize: 14, lineHeight: 1.6, margin: 0, whiteSpace: "pre-line" }}>{driver.bio}</p>
          </div>
        )}

        {/* Personal info */}
        {(age || driver.birthplace || driver.livesIn) && (
          <div style={{ background: Colors.card, borderRadius: 10, padding: 16, marginBottom: 12 }}>
            {age && dobFormatted && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${Colors.outline}` }}>
                <span style={{ fontSize: 13, color: Colors.textSecondary }}>Age</span>
                <span style={{ fontSize: 13 }}>{age} · {dobFormatted}</span>
              </div>
            )}
            {driver.birthplace && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: driver.livesIn ? `1px solid ${Colors.outline}` : "none" }}>
                <span style={{ fontSize: 13, color: Colors.textSecondary }}>Birthplace</span>
                <span style={{ fontSize: 13 }}>{driver.birthplace}</span>
              </div>
            )}
            {driver.livesIn && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                <span style={{ fontSize: 13, color: Colors.textSecondary }}>Lives in</span>
                <span style={{ fontSize: 13 }}>{driver.livesIn}</span>
              </div>
            )}
          </div>
        )}

        {/* Career stats */}
        {history.length > 0 && (
          <>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", color: Colors.textSecondary, marginBottom: 10 }}>BTCC CAREER</div>
            <div style={{ background: Colors.card, borderRadius: 10, padding: 14, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <CareerStat label="Wins" value={totalWins} highlight={totalWins > 0} />
                <Divider />
                <CareerStat label="Podiums" value={totalPodiums} />
                <Divider />
                <CareerStat label="Poles" value={totalPoles} />
                <Divider />
                <CareerStat label="Fastest Laps" value={totalFL} />
              </div>
              <div style={{ height: 1, background: "rgba(42,45,68,0.6)", margin: "12px 0" }} />
              <div style={{ display: "flex", alignItems: "center" }}>
                <CareerStat label="Seasons" value={totalSeasons} />
                <Divider />
                <CareerStat label="Points" value={totalPoints} />
                <Divider />
                {championships > 0 ? (
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: Colors.yellow }}>🏆 {championships}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: Colors.textSecondary, marginTop: 2 }}>{championships === 1 ? "Title" : "Titles"}</div>
                  </div>
                ) : bestPos < 999 ? (
                  <CareerStat label="Best Finish" value={`P${bestPos}`} />
                ) : (
                  <div style={{ flex: 1 }} />
                )}
                <Divider />
                <CareerStat label="DNFs" value={totalDNFs} />
              </div>
            </div>
            <CareerTimeline history={history} />
          </>
        )}

        {/* Season history */}
        {(driver.team || history.length > 0) && (
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", color: Colors.textSecondary, margin: "8px 0 10px" }}>SEASON HISTORY</div>
        )}
        {driver.team && !hasCurrentSeasonInHistory && (
          <div style={{ background: Colors.card, borderRadius: 10, padding: 12, marginBottom: 6, borderLeft: `3px solid ${Colors.textSecondary}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 16, fontWeight: 800 }}>{currentSeason}</span>
              <span style={{ background: "rgba(255,255,255,0.08)", borderRadius: 6, padding: "3px 8px", fontSize: 10, fontWeight: 800, letterSpacing: 0.5, color: Colors.textSecondary }}>
                IN PROGRESS
              </span>
            </div>
            <div style={{ fontSize: 13, color: Colors.textSecondary }}>{driver.team}</div>
            {driver.car && <div style={{ fontSize: 12, color: Colors.textSecondary }}>{driver.car}</div>}
          </div>
        )}
        {[...history].sort((a, b) => b.year - a.year).map((h) => {
          const posColor = h.isChampion || h.pos === 1 ? Colors.yellow
            : h.pos === 2 ? MedalColors.silver
            : h.pos === 3 ? MedalColors.bronze
            : h.pos <= 10 ? "#fff"
            : Colors.textSecondary;
          return (
            <div key={h.year} style={{ background: Colors.card, borderRadius: 10, padding: 12, marginBottom: 6, borderLeft: h.isChampion ? `3px solid ${Colors.yellow}` : "3px solid transparent" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 16, fontWeight: 800, color: h.isChampion ? Colors.yellow : Colors.textPrimary }}>
                  {h.year} {h.isChampion && "🏆"}
                </span>
                <span style={{ fontWeight: 800, color: posColor }}>P{h.pos}</span>
              </div>
              <div style={{ fontSize: 13, color: Colors.textSecondary }}>{h.team}</div>
              {h.car && <div style={{ fontSize: 12, color: Colors.textSecondary, marginBottom: 6 }}>{h.car}</div>}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                <Badge kind="pts">{h.points} pts</Badge>
                {h.wins > 0 && <Badge kind="win">{h.wins} W</Badge>}
                {(h.podiums ?? 0) > 0 && <Badge kind="podium">{h.podiums} P</Badge>}
                {(h.poles ?? 0) > 0 && <Badge kind="pole">{h.poles} PL</Badge>}
                {(h.fastestLaps ?? 0) > 0 && <Badge kind="fl">{h.fastestLaps} FL</Badge>}
                {(h.dnfs ?? 0) > 0 && <Badge kind="dnf">{h.dnfs} DNF</Badge>}
              </div>
            </div>
          );
        })}
        {history.length > 0 && (
          <div style={{ textAlign: "center", fontSize: 11, color: Colors.textSecondary, marginTop: 10 }}>
            <span style={{ color: Colors.yellow }}>W</span> Wins &nbsp;
            <span style={{ color: "#C0C0C0" }}>P</span> Podiums &nbsp;
            <span style={{ color: "#5BA3FF" }}>PL</span> Poles &nbsp;
            <span style={{ color: "#A855F7" }}>FL</span> Fastest Laps &nbsp;
            <span style={{ color: "#ff4444" }}>DNF</span> Did Not Finish
          </div>
        )}
      </div>
    </div>
  );
}
