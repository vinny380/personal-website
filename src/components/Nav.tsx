"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "info", href: "/" },
  { label: "projects", href: "/projects" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-4 font-mono text-sm">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`transition-colors hover:text-rust ${
            pathname === tab.href ? "text-ink" : "text-faded"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
