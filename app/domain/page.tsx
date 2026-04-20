import Link from "next/link";

const buildSystems = [
  {
    title: "Admin Dashboards and Internal Tools",
    detail: "Built and improved operational dashboards with Next.js, TypeScript, reusable UI patterns, and real-time API integrations.",
  },
  {
    title: "Automation and Bot Workflows",
    detail: "Contributed to a WhatsApp bot system and helped refactor the bot architecture into a modular, command-based structure.",
  },
  {
    title: "Responsive Product Interfaces",
    detail: "Shipped responsive client-facing interfaces from Figma designs with strong focus on clarity, consistency, and maintainability.",
  },
];

const featuredProjects = [
  {
    title: "FBIS Admin Dashboard",
    summary:
      "Built internal dashboard modules with Next.js, TypeScript, Tailwind CSS, live operational data, reusable tables and filters, and role-based access control.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Cancer Prediction Model",
    summary:
      "Academic prototype for breast cancer prediction with a web interface, trained model workflow, Flask backend, and deployment on Render.",
    stack: ["Flask", "Machine Learning", "Render"],
  },
  {
    title: "Shopping Web Application",
    summary:
      "Built a responsive shopping experience with authentication, product listings, cart flows, and backend CRUD support during internship work.",
    stack: ["React", "JavaScript", "PHP"],
  },
];

const craftAreas = [
  {
    title: "Frontend Engineering",
    detail: "React, Next.js, TypeScript, reusable component systems, and responsive implementation from design to production.",
  },
  {
    title: "Backend and Integration",
    detail: "REST API integration, Express and Node.js foundations, MongoDB and Firebase familiarity, and practical CRUD delivery.",
  },
  {
    title: "Team Delivery",
    detail: "Agile collaboration, code reviews, sprint delivery, and product-minded problem solving grounded in maintainable code.",
  },
];

export default function DomainPage() {
  return (
    <main className="domain-shell">
      <div className="domain-grid">
        <header className="domain-header">
          <p className="domain-kicker">Ogooluwa David Ilori</p>
          <h1 className="domain-title">Junior Software Developer Building Useful Web Products.</h1>
          <p className="domain-summary">
            I build scalable web applications, admin dashboards, and automation tools with a strong
            focus on clean architecture, maintainability, and real-world problem solving. My work spans
            frontend systems, API integration, internal tooling, and production-ready user interfaces.
          </p>
          <div className="domain-toolbar" aria-label="Build capabilities">
            <span className="domain-pill">JavaScript + TypeScript</span>
            <span className="domain-pill">React + Next.js</span>
            <span className="domain-pill">Node.js + Express</span>
            <span className="domain-pill">REST APIs + RBAC</span>
          </div>
        </header>

        <section className="domain-main">
          <article className="domain-panel">
            <h2>Experience Highlights</h2>
            <p>
              Recent work includes internal admin platforms, automation workflows, and responsive
              product interfaces delivered across internship and junior engineering roles.
            </p>
            <ul className="domain-list">
              {buildSystems.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </li>
              ))}
            </ul>

            <h2 className="domain-subheading">Selected Projects</h2>
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
            <h2>Core Strengths</h2>
            <p>
              My focus is practical software delivery: building interfaces that are clean and reliable,
              connecting them to useful backend systems, and collaborating effectively with product and
              engineering teams.
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
              Back to Landing
            </Link>
          </article>
        </section>
      </div>
    </main>
  );
}