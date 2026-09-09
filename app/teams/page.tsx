import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getTeams, CURRENT_SEASON } from "@/lib/data";
import { slugify } from "@/lib/slug";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Teams",
  description: `Every team on the ${CURRENT_SEASON} BTCC grid.`,
};

export default async function TeamsIndexPage() {
  const teams = await getTeams();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading eyebrow={`${CURRENT_SEASON} Season`} title="Teams" />
      <div className="grid gap-5 sm:grid-cols-2">
        {teams.map((team) => (
          <Link
            key={team.name}
            href={`/teams/${slugify(team.name)}`}
            className="group relative flex items-end overflow-hidden rounded-2xl border border-border bg-card p-5 transition-colors hover:border-btcc-yellow"
          >
            {team.cardBgUrl && (
              <Image
                src={team.cardBgUrl}
                alt=""
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover opacity-30 transition-opacity group-hover:opacity-40"
              />
            )}
            <div className="relative">
              <p className="font-display text-xl font-bold text-foreground group-hover:text-btcc-yellow">
                {team.name}
              </p>
              <p className="mt-1 text-sm text-muted">{team.car}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
