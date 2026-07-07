"use client";

function Moon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

function Sun({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
    </svg>
  );
}

export default function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    const apply = () => {
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    };

    // crossfade the whole page on the compositor; skip it (instant flip) when
    // the browser lacks View Transitions or the user prefers reduced motion
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (
      !doc.startViewTransition ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      apply();
    } else {
      doc.startViewTransition(apply);
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="switch between light and dark mode"
      className="group relative h-9 w-9 cursor-pointer text-faded transition hover:text-rust active:scale-95"
    >
      {/* moon invites you to the dark, sun back to the light */}
      <Moon className="absolute inset-0 m-auto h-5 w-5 rotate-0 scale-100 transition-transform duration-500 ease-out group-hover:-rotate-12 dark:-rotate-90 dark:scale-0" />
      <Sun className="absolute inset-0 m-auto h-5 w-5 rotate-90 scale-0 transition-transform duration-500 ease-out group-hover:rotate-135 dark:rotate-0 dark:scale-100" />
    </button>
  );
}
