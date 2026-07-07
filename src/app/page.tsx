import ClaudeHeatmap from "@/components/ClaudeHeatmap";
import GitHubHeatmap from "@/components/GitHubHeatmap";
import LinkRow from "@/components/LinkRow";
import Section from "@/components/Section";
import Tense from "@/components/Tense";
import TextLink from "@/components/TextLink";
import WritingList from "@/components/WritingList";

const writing = [
  {
    title: "Your AI Agent Doesn't Need a Better Model. It Needs a Better Harness",
    href: "https://vinny-purgato.medium.com/your-ai-agent-doesnt-need-a-better-model-it-needs-a-better-harness-b446ef9883fb",
    note: "2026",
  },
  {
    title: "The Filesystem Is All You Need",
    href: "https://vinny-purgato.medium.com/the-filesystem-is-all-you-need-a51268ad2b2e",
    note: "2026",
  },
];

const elsewhere = [
  { label: "x", href: "https://x.com/vinicius2prg" },
  { label: "linkedin", href: "https://www.linkedin.com/in/vinicius-porfirio-purgato/" },
  { label: "github", href: "https://github.com/vinny380" },
  { label: "medium", href: "https://vinny-purgato.medium.com" },
  { label: "email", href: "mailto:vinny.purgato@stanwith.me" },
];

export default function Home() {
  return (
    <>
      <Section delay="0.08s">
        <div className="space-y-7 text-[1.05rem] leading-relaxed">
          <div className="space-y-3">
            <p>
              <Tense word="present" /> I’m building{" "}
              <TextLink href="https://stanwith.me">Stanley</TextLink>, an AI
              that automates X, LinkedIn, Instagram, Threads, and Substack
              for Creators.
            </p>
            <p>
              I’m into agent harnesses, Brazilian jiu-jitsu and
              electric guitar. Currently between Toronto and NYC.
            </p>
          </div>
          <div className="space-y-3">
            <p>
              <Tense word="past" /> I moved from Brazil to Canada at 17 and
              studied CS at{" "}
              <TextLink href="https://www.queensu.ca">Queen’s</TextLink>.
              Built my first startup, Verus Automated Medical Billing. Then
              moved to Indonesia for an internship at{" "}
              <TextLink href="https://baskit.app">Baskit</TextLink>, my
              first real job in AI engineering, which came out of hundreds
              of cold emails to CEOs across Asia.
            </p>
            <p>
              I then went on to win a hackathon in China and part-lecture a
              university class at Queen’s.
            </p>
            <p>
              After that I worked at{" "}
              <TextLink href="https://www.pwc.com/ca">PwC Canada</TextLink>{" "}
              as an AI engineer and consultant, building AI agents for
              multimillion dollar projects.
            </p>
          </div>
          <p>
            <Tense word="future" /> I want to build great things.
          </p>
        </div>
      </Section>

      <Section label="writing" delay="0.16s">
        <WritingList posts={writing} />
      </Section>

      <Section label="claude" delay="0.24s">
        <ClaudeHeatmap user="vinny380" />
      </Section>

      <Section label="github" delay="0.32s">
        <GitHubHeatmap user="vinny380" />
      </Section>

      <Section label="elsewhere" delay="0.40s">
        <LinkRow links={elsewhere} />
      </Section>
    </>
  );
}
