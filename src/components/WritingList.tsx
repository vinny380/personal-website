import TextLink from "./TextLink";

export default function WritingList({
  posts,
}: {
  posts: { title: string; href?: string; note?: string }[];
}) {
  return (
    <ul className="mt-4 space-y-3">
      {posts.map((post) => (
        <li key={post.title} className="flex items-baseline justify-between gap-4">
          <span className="italic">
            {post.href ? (
              <TextLink href={post.href}>{post.title}</TextLink>
            ) : (
              post.title
            )}
          </span>
          {post.note && (
            <span className="shrink-0 font-mono text-xs text-faded">
              {post.note}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
