import Link from "next/link";

const buildSystems = [
  {
    title: "Atmospheric Commerce Platform",
    detail: "Unified animation runtime and rendering orchestration for immersive product narratives.",
  },
  {
    title: "Signal-Driven Portfolio Engine",
    detail: "Content, transitions, and interaction states coordinated through explicit event channels.",
  },
  {
    title: "Realtime Ops Surface",
    detail: "Visual telemetry overlays and incident-ready UX designed for high-tempo teams.",
  },
];

const featuredProjects = [
  {
    title: "Aether Checkout",
    summary:
      "Immersive checkout architecture with guided motion states, cart confidence loops, and low-latency transitions.",
    stack: ["Next.js", "TypeScript", "Motion Runtime"],
  },
  {
    title: "Sentinel Admin Surface",
    summary:
      "Operational dashboard with signal-ranked alerts, deterministic keyboard paths, and incident-first UX choreography.",
    stack: ["React", "Design Tokens", "Observability"],
  },
  {
    title: "Orbit Narrative Engine",
    summary:
      "Modular storytelling system blending 3D atmosphere and strict rendering budgets for premium brand launches.",
    stack: ["R3F", "Three.js", "Performance Profiling"],
  },
];

const craftAreas = [
  {
    title: "Frontend Systems",
    detail: "Component architecture, state choreography, and rendering discipline.",
  },
  {
    title: "Motion Direction",
    detail: "Intentional animation pacing tuned for narrative and perception.",
  },
  {
    title: "Interaction Design",
    detail: "Physical-feeling interfaces with clear guidance and satisfying reveal moments.",
  },
];

export default function DomainPage() {
  return (
    <main className="domain-shell">
      <div className="domain-grid">
        <header className="domain-header">
          <p className="domain-kicker">Portfolio Unlocked</p>
          <h1 className="domain-title">Builds, Experiments, and Code.</h1>
          <p className="domain-summary">
            This space showcases selected builds where visual direction, technical decisions, and user
            experience are shaped together. Each project below is about creating useful, expressive
            products with code.
          </p>
          <div className="domain-toolbar" aria-label="Build capabilities">
            <span className="domain-pill">React + Next.js</span>
            <span className="domain-pill">Three.js/R3F</span>
            <span className="domain-pill">Motion Systems</span>
            <span className="domain-pill">Interaction Architecture</span>
          </div>
        </header>

        <section className="domain-main">
          <article className="domain-panel">
            <h2>Selected Build Tracks</h2>
            <p>
              Projects are framed as build outcomes: how people use the interface, what they feel at
              each step, and how performance holds up in real use.
            </p>
            <ul className="domain-list">
              {buildSystems.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </li>
              ))}
            </ul>

            <h2 className="domain-subheading">Featured Builds</h2>
            <div className="domain-cards">
              {featuredProjects.map((project) => (
                <article key={project.title} className="domain-card">
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <div className="domain-card-tags" aria-label={`${project.title} technology stack`}>
                    {project.stack.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="domain-panel">
            <h2>Craft Focus</h2>
            <p>
              Delivery pairs aesthetics with practical clarity. Visual intensity should never compromise
              reliability, accessibility, or task completion.
            </p>
            <ul className="domain-list">
              {craftAreas.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </li>
              ))}
            </ul>

            <Link href="/" className="domain-link">
              Back to Intro
            </Link>
          </article>
        </section>
      </div>
    </main>
  );
}