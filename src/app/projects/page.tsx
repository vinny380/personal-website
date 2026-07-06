import ProjectList from "@/components/ProjectList";
import Section from "@/components/Section";

const groups = [
  {
    label: "startup attempts",
    projects: [
      {
        name: "Fieldify AI",
        href: "https://github.com/Fieldify-AI",
        desc: "Netflix × Duolingo for research papers — on-demand summaries, gamified comprehension",
      },
      {
        name: "Fieldify",
        href: "https://youtu.be/doSkCsJjXPk",
        desc: "field-rep check-in app with geolocation and live dashboards",
      },
      {
        name: "Verus",
        href: "https://github.com/Verus-Automated-Medical-Billing",
        desc: "automated medical billing — my first startup",
      },
    ],
  },
  {
    label: "agents & tooling",
    projects: [
      {
        name: "bossa",
        href: "https://github.com/vinny380/bossa",
        desc: "the memory layer for your agents, exposed as a filesystem",
      },
      {
        name: "llmdocs",
        href: "https://github.com/vinny380/llmdocs",
        desc: "docs your agents can actually search — CLI-first, self-hosted",
      },
      {
        name: "Agent Quest",
        href: "https://github.com/vinny380/agent-viz",
        desc: "watch your AI agents work as a Game Boy pixel-RPG party",
      },
      {
        name: "Chengdu RAG Backend",
        href: "https://github.com/vinny380/CHENGDU80-RAG-Backend",
        desc: "RAG backend that won 1st at a Chengdu fintech hackathon",
      },
    ],
  },
  {
    label: "ml & systems",
    projects: [
      {
        name: "Stealth Gridworld RL",
        href: "https://github.com/vinny380/StealthGridRL",
        desc: "reinforcement-learning agent maximizing map coverage while evading patrols",
      },
      {
        name: "Music Genre Classifier",
        href: "https://github.com/vinny380/spectogram_genre_prediction_computer_vision",
        desc: "deep CNN classifying genres from audio spectrograms",
      },
      {
        name: "Decentralized Messaging",
        href: "https://github.com/vinny380/decentralized_messaging_app",
        desc: "fully decentralized peer-to-peer messaging app",
      },
    ],
  },
  {
    label: "teaching",
    projects: [
      {
        name: "NoSQL & RAG Lectures",
        href: "https://github.com/vinny380/NoSQL-RAG-Lectures-Taught-By-Me-CISC332",
        desc: "lectures on NoSQL, RAG & vector DBs I taught at Queen's",
      },
    ],
  },
];

export default function Projects() {
  return (
    <>
      {groups.map((group, i) => (
        <Section
          key={group.label}
          label={group.label}
          delay={`${0.08 + i * 0.08}s`}
        >
          <ProjectList projects={group.projects} />
        </Section>
      ))}
    </>
  );
}
