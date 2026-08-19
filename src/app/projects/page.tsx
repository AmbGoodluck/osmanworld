"use client";
import { motion } from "framer-motion";

const COLORS = {
  lightBlue: "#87CEEB",
  crimson: "#8B0000",
  gray: "#9CA3AF",
  cardBg: "rgba(255,255,255,0.04)",
};

const projects = [
  {
    id: "fynd",
    name: "Fynd",
    tagline: "Campus Discovery Platform · iOS & Web",
    status: "Live · 100+ Active Users",
    statusColor: COLORS.lightBlue,
    accentColor: COLORS.lightBlue,
    role: "Founder & Sole Engineer",
    period: "2026 - Present",
    impact: "Designed and shipped a verified-student campus discovery platform from zero to App Store in a single React Native codebase, reaching 100+ active Berea College student users.",
    stack: ["React Native (Expo)", "Supabase", "Postgres", "RLS", "Cloudflare Workers", "GitHub Actions", "EAS", "Sentry"],
    highlights: [
      "Engineered RLS policies and SECURITY DEFINER RPCs enforcing per-campus data isolation at the database layer",
      "Built a server-side AI moderation gate on every user-generated content surface with third-party student verification via webhook",
      "Designed an edge-cached places API via Cloudflare Workers that calls Google at most once per venue, keeping third-party costs near zero",
      "Automated the full release pipeline with staged feature-flag rollouts, Sentry-gated automatic rollback, and a 465-assertion test harness",
      "Prepared and submitted the app to the App Store including privacy labeling, content-moderation compliance, and accessibility work",
    ],
    links: [{ label: "GitHub", href: "https://github.com/AmbGoodluck" }],
    symbol: "◉",
  },
  {
    id: "regain",
    name: "Regain AI",
    tagline: "Contact Automation CLI · Claude API",
    status: "Live · 100+ Active Users",
    statusColor: COLORS.crimson,
    accentColor: COLORS.crimson,
    role: "Founder & Engineer",
    period: "Jun 2026 - Present",
    impact: "Built and deployed a Python CLI tool that uses the Claude API to parse web form submissions into CRM-ready JSON, adopted by 100+ active users across 60+ incremental GitHub commits.",
    stack: ["Python", "Claude API", "CSV/JSON", "Supabase", "GitHub Actions"],
    highlights: [
      "Built a complete CSV ingestion and AI extraction pipeline that structures lead data with zero manual formatting",
      "Integrated Claude API for contact parsing, converting unstructured form data into structured CRM-ready outputs",
      "Maintained 60+ incremental commits showing consistent development across the full build cycle",
      "Phase 2 roadmap: Twilio phone follow-up and live CRM sync",
    ],
    links: [{ label: "GitHub", href: "https://github.com/AmbGoodluck/regain-ai" }],
    symbol: "◈",
  },
  {
    id: "college-circle",
    name: "College Circle",
    tagline: "EdTech Platform · FAST Award",
    status: "$4,500 Funded",
    statusColor: COLORS.lightBlue,
    accentColor: COLORS.lightBlue,
    role: "Founder & Product Lead",
    period: "Jan 2025 - Present",
    impact: "Secured $4,500 in startup funding by leading design and development of a cross-campus student collaboration platform selected for Berea College's FAST Idea Program.",
    stack: ["Python", "Figma", "Agile", "Trello", "GitHub"],
    highlights: [
      "Defined end-to-end product scope, requirements, and feature roadmap for the MVP",
      "Led a 4-person cross-functional team through sprint planning, backlog prioritization, and iterative delivery",
      "Gathered, analyzed, and integrated early user feedback into continuous sprint planning",
      "Delivered a functional MVP within the planned development window with measurable engagement improvements",
    ],
    links: [{ label: "Figma", href: "https://www.figma.com/proto/lNhDIKMn2osIAf0T09mvzs/College-Circle" }],
    symbol: "◎",
  },
  {
    id: "fix-enterprise",
    name: "FIX Enterprise",
    tagline: "Merchandise Business · Founded & Exited",
    status: "400% ROI Exit",
    statusColor: COLORS.gray,
    accentColor: COLORS.gray,
    role: "Founder & CEO",
    period: "Aug 2021 - Mar 2023",
    impact: "Founded, scaled, and exited a merchandise printing business achieving 400% ROI in 10 months using feedback from 200+ customer interviews to find high-demand product segments.",
    stack: ["Canva", "Google Workspace", "Silhouette Cutting", "Market Research"],
    highlights: [
      "Led a team of 10 with efficient workflows and quality control across production and fulfillment",
      "Interviewed 200+ customers and used that feedback to launch new products, growing revenue by 15%",
      "Cut production time by 30% and raised customer satisfaction scores by 20%",
      "Exited the business with full financial and operational methodology documented",
    ],
    links: [],
    symbol: "▲",
  },
];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl border border-white/10 overflow-hidden"
      style={{ background: COLORS.cardBg }}
    >
      <div className="h-[2px] w-full" style={{ backgroundColor: project.accentColor, opacity: 0.6 }} />

      <div className="p-8">
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl" style={{ color: project.accentColor }}>{project.symbol}</span>
              <h2 className="font-serif text-3xl text-white">{project.name}</h2>
            </div>
            <p className="text-sm font-mono text-[#9CA3AF] tracking-wide">{project.tagline}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-mono font-semibold border"
              style={{ color: project.statusColor, borderColor: project.statusColor + "40", backgroundColor: project.statusColor + "15" }}
            >
              {project.status}
            </span>
            <span className="text-xs text-[#9CA3AF] font-mono">{project.period}</span>
          </div>
        </div>

        <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: project.accentColor }}>
          {project.role}
        </p>

        <p className="text-[#9CA3AF] leading-relaxed mb-6 text-sm">{project.impact}</p>

        <ul className="space-y-2 mb-6">
          {project.highlights.map((h, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span style={{ color: project.accentColor }} className="flex-shrink-0 mt-0.5">›</span>
              <span className="text-[#9CA3AF] leading-relaxed">{h}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-0.5 rounded-full text-xs font-mono border"
              style={{ color: project.accentColor, borderColor: project.accentColor + "30", backgroundColor: project.accentColor + "10" }}
            >
              {tech}
            </span>
          ))}
        </div>

        {project.links.length > 0 && (
          <div className="flex gap-4 pt-2 border-t border-white/5">
            {project.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm transition-colors hover:opacity-80"
                style={{ color: project.accentColor }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}

export default function ProjectsPage() {
  return (
    <main className="pt-8 px-4 md:px-8 text-white pb-20 min-h-screen">

      <div className="max-w-4xl mx-auto mb-12">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-xs text-[#9CA3AF] uppercase tracking-[0.28em] mb-4"
        >
          Portfolio · Shipped Products
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif leading-tight mb-4"
          style={{ fontSize: "clamp(2.5rem,6vw,4rem)" }}
        >
          Things I&apos;ve{" "}
          <span style={{ color: "#8B0000" }}>Built</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[#9CA3AF] text-lg max-w-2xl leading-relaxed"
        >
          Four projects. Two live products. Real users. All built and shipped independently.
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-6 h-px w-24 origin-left"
          style={{ backgroundColor: "#8B0000" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-4xl mx-auto mb-12 grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { value: "200+", label: "Active Users", color: COLORS.lightBlue },
          { value: "2", label: "Live Products", color: COLORS.lightBlue },
          { value: "$4,500", label: "Startup Funding", color: COLORS.crimson },
          { value: "60+", label: "GitHub Commits", color: COLORS.gray },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/[0.04] rounded-xl border border-white/10 p-4 text-center">
            <p className="font-serif text-2xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs font-mono text-[#9CA3AF] uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-8">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto mt-16 text-center"
      >
        <p className="text-[#9CA3AF] mb-6">See the code behind the work.</p>
        <a
          href="https://github.com/AmbGoodluck"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-medium transition-all duration-200 hover:bg-[#87CEEB]/10"
          style={{ borderColor: "#87CEEB50", color: "#87CEEB" }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          github.com/AmbGoodluck
        </a>
      </motion.div>

    </main>
  );
}
