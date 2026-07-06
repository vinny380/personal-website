import TextLink from "./TextLink";

export default function LinkRow({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  return (
    <p className="mt-4">
      {links.map((link, i) => (
        <span key={link.label}>
          {i > 0 && <span className="text-faded"> · </span>}
          <TextLink href={link.href}>{link.label}</TextLink>
        </span>
      ))}
    </p>
  );
}
