# vinny's website

Personal site. Next.js 16 (app router) + Tailwind, one page, no CMS.

```bash
npm install
npm run dev
```

Where things live:

- `src/app/page.tsx` — all the content (bio, writing list, links), composed from components
- `src/app/layout.tsx` — fonts and metadata
- `src/app/globals.css` — colors and the load animation
- `src/components/` — small reusable pieces (Section, TextLink, WritingList, ...)

Components are server components. If a leaf ever needs interactivity,
add `"use client"` at the top of that one file only.
