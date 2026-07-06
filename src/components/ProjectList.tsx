import TextLink from "./TextLink";

export default function ProjectList({
  projects,
}: {
  projects: { name: string; href: string; desc: string }[];
}) {
  return (
    <ul className="mt-4 space-y-4">
      {projects.map((project) => (
        <li key={project.name}>
          <TextLink href={project.href}>{project.name}</TextLink>
          <p className="mt-0.5 text-sm text-faded">{project.desc}</p>
        </li>
      ))}
    </ul>
  );
}
