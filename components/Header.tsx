"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  { href: "/drivers", label: "Drivers" },
  { href: "/teams", label: "Teams" },
  { href: "/results", label: "Results" },
  { href: "/calendar", label: "Calendar" },
  { href: "/live", label: "Live" },
  { href: "/gallery", label: "Gallery" },
  { href: "/partners", label: "Partners" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        background: "#080912",
        borderBottom: "1px solid #161828",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Image
            src="https://btcc.net/wp-content/uploads/2023/11/KF_BTCC_Combined_logo_landscape_White_Out.png"
            alt="Kwik Fit British Touring Car Championship"
            width={260}
            height={44}
            style={{ objectFit: "contain", height: 44, width: "auto", filter: "brightness(0) invert(1) brightness(0.73) sepia(1) saturate(1600%)" }}
            priority
            unoptimized
          />
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", gap: 4 }} className="hidden-mobile">
          {NAV.map(({ href, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  padding: "8px 14px",
                  fontFamily: "var(--font-barlow-condensed)",
                  fontWeight: 600,
                  fontSize: 14,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  color: active ? "#FEBD02" : "#8B8FA8",
                  borderBottom: active ? "2px solid #FEBD02" : "2px solid transparent",
                  transition: "color 0.2s",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="show-mobile"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            color: "#fff",
            display: "none",
          }}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <>
                <path d="M6 6l12 12M6 18L18 6" />
              </>
            ) : (
              <>
                <path d="M4 6h16M4 12h16M4 18h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            background: "#0F1122",
            borderTop: "1px solid #161828",
            padding: "8px 0 16px",
          }}
          className="show-mobile"
        >
          {NAV.map(({ href, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  padding: "12px 24px",
                  fontFamily: "var(--font-barlow-condensed)",
                  fontWeight: 600,
                  fontSize: 16,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  color: active ? "#FEBD02" : "#fff",
                  borderLeft: active ? "3px solid #FEBD02" : "3px solid transparent",
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}
