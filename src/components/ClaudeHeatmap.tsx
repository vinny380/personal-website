import Script from "next/script";

export default function ClaudeHeatmap({ user }: { user: string }) {
  return (
    <div className="mt-4">
      <claude-token-heatmap user={user} />
      <Script src="https://unpkg.com/claude-count-tokens/widget/claude-token-heatmap.js" />
    </div>
  );
}
