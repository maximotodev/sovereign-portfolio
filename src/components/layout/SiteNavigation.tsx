import Link from "next/link";
import styles from "./SiteNavigation.module.css";

type Area = "home" | "systems" | "newsletter" | "studio";
// Reader-focused navigation; publishing Studio stays in the footer.
export function SiteNavigation({ active }: { active: Area }) {
  const links = [
    { href: "/#work", name: "Work", page: null },
    { href: "/systems", name: "Systems", page: "systems" },
    { href: "/newsletter", name: "Newstr", page: "newsletter" },
    { href: "/#story", name: "About", page: "home" },
  ] as const;
  return (
    <header className={styles.header}>
      <Link className={styles.brand} href="/" aria-label="Maximoto home">
        MAXIMOTO<span>.</span>
      </Link>
      <nav className={styles.nav} aria-label="Primary navigation">
        {links.map(link => (
          <Link key={link.href} href={link.href}
            aria-current={active === link.page ? "page" : undefined}>
            {link.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
