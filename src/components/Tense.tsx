export default function Tense({ word }: { word: string }) {
  // the trailing space lives inside the span so JSX line-trimming
  // can't swallow the gap between the label and the sentence
  return <span className="font-mono text-sm text-rust">{word} · </span>;
}
