import Link from "next/link";
import Nav from "./Nav";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    // z-10 keeps the header floating above the full-viewport inspo canvas
    <header className="rise relative z-10 flex items-start justify-between">
      <div>
        <Link href="/">
          <h1 className="text-2xl font-normal">Vinny Purgato</h1>
        </Link>
        <p className="mt-1 font-mono text-sm text-faded">
          ai engineer at stan · toronto & nyc
        </p>
        <div className="mt-3">
          <Nav />
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}
