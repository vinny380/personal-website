export default function Section({
  label,
  delay,
  children,
}: {
  label?: string;
  delay?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rise mt-14" style={{ animationDelay: delay }}>
      {label && <h2 className="font-mono text-sm text-faded">{label}</h2>}
      {children}
    </section>
  );
}
