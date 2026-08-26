import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Wraps every marketing/info page (home, calendar, gallery, about, partners,
// live, teams, the news/drivers/results list pages, magic-link) with the
// site's own nav + footer chrome. Deliberately NOT applied to
// results/[round], news/[slug] or drivers/[slug] - those three are the pages
// a shared link from the app actually lands on, and are built to match the
// app's own screens (which have no top nav or footer at all) rather than
// look like a website.
export default function ChromeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
