import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTeam, getTeams, getDrivers } from "@/lib/data";
import { slugify } from "@/lib/slug";
import SectionHeading from "@/components/SectionHeading";
import Panel from "@/components/Panel";
import DriverAvatar from "@/components/DriverAvatar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const team = await getTeam(slug);
  if (!team) return {};
  return { title: team.name, description: team.bio.slice(0, 155) };
}

const SPONSOR_TIER_ORDER = ["principal", "associate", "technical", "decal"];

export default async function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [team, drivers] = await Promise.all([getTeam(slug), getDrivers()]);
  if (!team) notFound();

  const roster = drivers.filter((d) => d.team === team.name);
  const sponsorsByTier = SPONSOR_TIER_ORDER.map((tier) => ({
    tier,
    sponsors: (team.sponsors ?? []).filter((s) => s.tier === tier),
  })).filter((group) => group.sponsors.length > 0);

  return (
    <div>
      <div className="relative h-56 w-full overflow-hidden border-b border-border bg-card sm:h-72">
        {team.cardBgUrl && (
          <Image src={team.cardBgUrl} alt="" fill sizes="100vw" className="object-cover opacity-40" />
        )}
        <div className="relative mx-auto flex h-full max-w-4xl items-end px-4 pb-6 sm:px-6">
          <div className="flex items-center gap-4">
            {team.logoUrl && (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-background/60 p-2">
                <Image src={team.logoUrl} alt="" fill sizes="64px" className="object-contain" />
              </div>
            )}
            <div>
              <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                {team.name}
              </h1>
              <p className="text-muted">{team.car}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-4">
          {team.founded && (
            <Panel>
              <p className="text-xs font-bold uppercase tracking-widest text-muted">Founded</p>
              <p className="mt-1 font-display text-xl font-extrabold text-foreground">{team.founded}</p>
            </Panel>
          )}
          {typeof team.totalWins === "number" && (
            <Panel>
              <p className="text-xs font-bold uppercase tracking-widest text-muted">Wins</p>
              <p className="mt-1 font-display text-xl font-extrabold text-btcc-yellow">{team.totalWins}</p>
            </Panel>
          )}
          {typeof team.driversChampionships === "number" && (
            <Panel>
              <p className="text-xs font-bold uppercase tracking-widest text-muted">Drivers&apos; Titles</p>
              <p className="mt-1 font-display text-xl font-extrabold text-foreground">{team.driversChampionships}</p>
            </Panel>
          )}
          {typeof team.teamsChampionships === "number" && (
            <Panel>
              <p className="text-xs font-bold uppercase tracking-widest text-muted">Teams&apos; Titles</p>
              <p className="mt-1 font-display text-xl font-extrabold text-foreground">{team.teamsChampionships}</p>
            </Panel>
          )}
        </div>

        {team.carImageUrl && (
          <div className="relative mt-8 h-56 w-full overflow-hidden rounded-2xl bg-surface sm:h-72">
            <Image src={team.carImageUrl} alt={team.car} fill sizes="(min-width: 768px) 768px, 100vw" className="object-contain" />
          </div>
        )}

        <p className="mt-8 whitespace-pre-line leading-relaxed text-muted">{team.bio}</p>

        {roster.length > 0 && (
          <div className="mt-10">
            <SectionHeading title="Drivers" />
            <div className="grid gap-4 sm:grid-cols-2">
              {roster.map((driver) => (
                <Link
                  key={driver.name}
                  href={`/drivers/${slugify(driver.name)}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-btcc-yellow"
                >
                  <DriverAvatar imageUrl={driver.imageUrl} name={driver.name} number={driver.number} size={48} />
                  <span className="font-semibold text-foreground">
                    #{driver.number} {driver.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {sponsorsByTier.length > 0 && (
          <div className="mt-10">
            <SectionHeading title="Sponsors" />
            <div className="space-y-4">
              {sponsorsByTier.map((group) => (
                <div key={group.tier}>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted">
                    {group.tier}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.sponsors.map((sponsor) => (
                      <span
                        key={sponsor.name}
                        className="rounded-full border border-border bg-card px-3 py-1 text-sm text-foreground"
                      >
                        {sponsor.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {team.sponsorsNote && (
              <p className="mt-4 text-xs text-muted">{team.sponsorsNote}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const teams = await getTeams();
  return teams.map((t) => ({ slug: slugify(t.name) }));
}
