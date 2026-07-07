export default function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="underline underline-offset-4 decoration-faded/40 transition-colors hover:text-rust hover:decoration-rust"
    >
      {children}
    </a>
  );
}
