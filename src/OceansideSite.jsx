import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Waves,
  ShieldCheck,
  Mic2,
  Headphones,
  PhoneCall,
  Cpu,
  Sparkles,
  Lock,
  Globe2,
  Telescope,
  ChevronRight,
  Mail,
  Check,
  Play,
  ArrowRight,
  Circle,
  Moon,
  SunMedium,
  MousePointer2,
  Zap,
  Link,
  Timer,
  ClipboardCheck,
  LineChart,
  Stars,
} from "lucide-react";

/**
 * Oceanside AI Solutions — Cinematic Minimalist Website
 * Tech: React + Tailwind CSS + Framer Motion + Lucide Icons
 * Notes:
 * - Apple-style minimalism: ample whitespace, large typography, subtle depth.
 * - Cinematic hero: interactive sound waves + cursor-reactive particles.
 * - Lead capture: webhook POST to Make.com and Calendly modal.
 * - Sections: Hero, Clients, Services, Case Studies, Mission, About, Integrations,
 *             Pricing, FAQ, Contact, Footer.
 * - Dark mode toggle with persisted preference.
 */

/**********************
 * Utility Components  *
 **********************/

const Container = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-6 md:px-10 ${className}`}>{children}</div>
);

const Section = ({ id, children, className = "", full = false }) => (
  <section id={id} className={`${full ? "" : "py-20 md:py-28"} ${className}`}>{children}</section>
);

const GradientDivider = () => (
  <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-300/60 to-transparent dark:via-zinc-700/60" />
);

/**********************
 * Theme (Dark Toggle) *
 **********************/

function useTheme() {
  const [theme, setTheme] = useState(
    typeof window !== "undefined" && window.localStorage.getItem("theme")
      ? window.localStorage.getItem("theme")
      : "dark"
  );
  useEffect(() => {
    if (!theme) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);
  return { theme, setTheme };
}

const ThemeToggle = ({ theme, setTheme }) => (
  <button
    aria-label="Toggle dark mode"
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    className="group inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white/70 px-4 py-2 text-sm text-zinc-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300"
  >
    {theme === "dark" ? (
      <SunMedium className="h-4 w-4 text-amber-400" />
    ) : (
      <Moon className="h-4 w-4 text-zinc-900" />
    )}
    <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"} mode</span>
  </button>
);

/*******************************
 * Cinematic Cursor + Particles *
 *******************************/

const useCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return pos;
};

const ParticleField = () => {
  const canvasRef = useRef(null);
  const mouse = useCursor();
  const particles = useRef([]);
  const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    const count = Math.floor((canvas.clientWidth * canvas.clientHeight) / 18000);
    particles.current = new Array(Math.max(60, count)).fill(0).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      o: Math.random() * 0.6 + 0.2,
    }));

    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouse.x * dpr;
      const my = mouse.y * dpr;
      particles.current.forEach((p) => {
        // subtle mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
        const force = Math.min(30 / dist, 0.6);
        p.vx += (dx / dist) * force * 0.02;
        p.vy += (dy / dist) * force * 0.02;
        // motion + bounds
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        // draw
        ctx.beginPath();
        ctx.fillStyle = `rgba(99,102,241,${p.o})`; // indigo 500
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [dpr, mouse.x, mouse.y]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
};

/*****************************
 * Futuristic Soundwave Canvas
 *****************************/

const SoundWaves = ({ height = 360 }) => {
  const canvasRef = useRef(null);
  const mouse = useCursor();
  const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = height * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const hues = [225, 210, 260]; // cool indigo/blue/violet spectrum
    let t = 0;
    let raf;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      t += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouse.x * dpr;
      const my = mouse.y * dpr;

      for (let i = 0; i < 5; i++) {
        const color = `hsla(${hues[i % hues.length]}, 80%, ${55 - i * 7}%, ${0.75 - i * 0.12})`;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2 + i * 0.7;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 6) {
          const f = 0.002 + i * 0.0006;
          const amp = (30 + i * 10) + Math.sin(t * (1.2 + i * 0.2)) * 10;
          const mouseInfluence = 0.0009 * ((mx - x) / canvas.width);
          const y = canvas.height / 2 +
            Math.sin(x * f + t * (1 + i * 0.15) + mouseInfluence * (my - canvas.height / 2)) * amp;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // faint grid overlay for cinematic vibe
      ctx.strokeStyle = "rgba(148,163,184,0.12)"; // slate-400/12
      ctx.lineWidth = 1;
      const step = 64 * dpr;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [dpr, height, mouse.x, mouse.y]);

  return <canvas ref={canvasRef} className="block w-full" style={{ height }} />;
};

/********************
 * Calendly Modal   *
 ********************/

const CalendlyModal = ({ open, onClose, url }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 20 }}
            className="absolute inset-x-4 top-10 mx-auto w-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between border-b border-zinc-200/60 px-4 py-3 dark:border-zinc-800/60">
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                <CalendarIcon />
                <span>Book a session — Calendly</span>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl border border-zinc-200 px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Close
              </button>
            </div>
            <div className="aspect-[16/9] w-full">
              <iframe
                src={url}
                title="Calendly"
                className="h-full w-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="opacity-80">
    <rect x="3" y="4" width="18" height="18" rx="3" ry="3" fill="currentColor" opacity="0.1" />
    <rect x="3" y="8" width="18" height="2" fill="currentColor" opacity="0.25" />
    <circle cx="8" cy="13" r="1.2" />
    <circle cx="12" cy="13" r="1.2" />
    <circle cx="16" cy="13" r="1.2" />
  </svg>
);

/********************
 * Data & Copy       *
 ********************/

const COMPANY = {
  name: "Oceanside AI Solutions",
  tagline: "We build voice agents for companies across the globe.",
  calendly: "https://calendly.com/mark-oceansideaisolutions/ai-voice-pioneers-onboarding",
  webhook: "https://hook.us1.make.com/re70z6z8mmbacjumdqjrkq095j26dg6s",
  mission:
    "To operationalize voice AI for every SMB by delivering secure, high‑fidelity agents that increase conversion, compress cycle times, and reduce support costs — without disrupting existing workflows.",
  pillars: [
    {
      icon: <ShieldCheck className="h-5 w-5" />, title: "Security‑first DNA",
      text: "Founded by a cybersecurity specialist, we build with threat modeling, least‑privilege access, and end‑to‑end observability baked in."
    },
    {
      icon: <Headphones className="h-5 w-5" />, title: "Human‑grade voice UX",
      text: "Latency‑optimized turn‑taking, barge‑in handling, emotion tuning, and domain‑specific NLU for production reliability."
    },
    {
      icon: <Cpu className="h-5 w-5" />, title: "Systems that ship",
      text: "Opinionated patterns, rigorous QA, and SLA‑aligned monitoring to get from prototype to ROI fast."
    },
  ],
  services: [
    {
      icon: <Mic2 className="h-6 w-6" />, name: "Voice Agent Design",
      desc: "Intent modeling, dialogue flows, escalation rules, and personality packs tuned to your brand."
    },
    {
      icon: <PhoneCall className="h-6 w-6" />, name: "Telephony & Routing",
      desc: "SIP/PSTN, call trees, queueing, and CRM‑aware routing for inbound and outbound use cases."
    },
    {
      icon: <Lock className="h-6 w-6" />, name: "Security & Compliance",
      desc: "PII handling, SOC2‑aligned controls, encryption in transit/at rest, and audit trails."
    },
    {
      icon: <Globe2 className="h-6 w-6" />, name: "Multilingual & Localization",
      desc: "Accents, locales, and regulatory nuances for global deployments."
    },
    {
      icon: <LineChart className="h-6 w-6" />, name: "Analytics & Optimization",
      desc: "Real‑time call insights, funnel drop‑off analysis, and A/B scenario testing."
    },
  ],
  caseStudies: [
    {
      logo: "CBN",
      title: "Newsroom Script Assistant",
      impact: ["4h → 20m draft time", "Consistent editorial tone", "Reduced weekend backlog"],
      summary:
        "Originated in Ukraine conflict zones: a Q&A‑driven script assistant that captures a journalist’s voice, accelerating draft creation while preserving editorial quality.",
    },
    {
      logo: "Retail",
      title: "AI Appointment Setter",
      impact: ["+38% booked calls", "Lead response in <15s", "CRM‑synced"],
      summary:
        "Voice agent that qualifies inbound leads and books appointments directly on Calendly, syncing metadata to CRM for attribution.",
    },
  ],
  integrations: [
    "Twilio", "Plivo", "Vonage", "OpenAI", "ElevenLabs", "Whisper", "Deepgram", "Azure", "AWS", "GCP", "HubSpot", "Salesforce", "Stripe"
  ],
  pricing: [
    {
      tier: "Starter",
      price: "$2,500",
      tagline: "Pilot voice agent for one workflow",
      features: [
        "One agent persona",
        "Up to 1k minutes/mo",
        "Basic analytics dashboard",
        "Email support",
      ],
    },
    {
      tier: "Growth",
      price: "$6,500",
      tagline: "Multi‑flow agent with CRM",
      features: [
        "Two personas + A/B",
        "Up to 5k minutes/mo",
        "CRM/Calendar integration",
        "Priority support",
      ],
      highlighted: true,
    },
    {
      tier: "Enterprise",
      price: "Custom",
      tagline: "Regulated & global scale",
      features: [
        "SAML SSO & role‑based access",
        "Unlimited minutes option",
        "Custom SLAs & compliance",
        "Dedicated success engineer",
      ],
    },
  ],
  faqs: [
    {
      q: "How do you ensure security?",
      a: "We implement threat modeling, encrypt data in transit and at rest, restrict secrets via vaulting, and log every privileged action for auditability.",
    },
    {
      q: "Can you integrate with our telephony provider?",
      a: "Yes. We work across Twilio, Plivo, Vonage and direct SIP. We map call flows to your escalation SOPs and compliance posture.",
    },
    {
      q: "What languages do you support?",
      a: "English, Spanish, French, German, Ukrainian and more — including locale‑specific patterns for dates, currency, and honorifics.",
    },
    {
      q: "What’s the typical time to value?",
      a: "Most pilots ship in 2–4 weeks with measurable KPIs (connect rates, bookings, handle time). We iterate weekly.",
    },
  ],
  about: {
    heading: "Built from the frontlines, engineered for the enterprise.",
    story: `Oceanside AI Solutions began not in a boardroom, but amidst the urgency of Ukraine's conflict zones, where Mark Tomlet — a cybersecurity specialist with a background in journalism — recognized a pressing need. Surrounded by reporters under brutal deadlines, Mark saw an opportunity for AI to revolutionize scriptwriting.

Mark’s journey with AI started with a simple idea: an assistant that could interview the journalist, extract intent and tone, then draft a script in their voice. After extensive training and refinement, a process that once took 4 hours could be completed in just 20 minutes. This breakthrough earned an invitation from CBN News to build custom AI solutions for their newsroom.

As word spread, Oceanside expanded beyond journalism. Today we tackle diverse workflows for SMBs and mid‑market teams, building voice AI that integrates cleanly, scales reliably, and respects the realities of security, compliance, and change management.`,
  },
};

/********************
 * Animations        *
 ********************/

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  show: { transition: { staggerChildren: 0.08 } },
};

/********************
 * Form (Webhook)    *
 ********************/

function LeadForm({ webhook }) {
  const [state, setState] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOk(null);
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "website",
          ts: new Date().toISOString(),
          ...state,
        }),
      });
      setOk(res.ok);
      setState({ name: "", email: "", phone: "", company: "", message: "" });
    } catch (err) {
      setOk(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Input label="Full name" value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} required />
      <Input type="email" label="Email" value={state.email} onChange={(e) => setState({ ...state, email: e.target.value })} required />
      <Input label="Company" value={state.company} onChange={(e) => setState({ ...state, company: e.target.value })} />
      <Input label="Phone" value={state.phone} onChange={(e) => setState({ ...state, phone: e.target.value })} />
      <TextArea className="md:col-span-2" label="What are you hoping to build?" value={state.message} onChange={(e) => setState({ ...state, message: e.target.value })} required />
      <div className="md:col-span-2 flex items-center gap-3 pt-2">
        <button
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 dark:bg-white dark:text-zinc-900"
        >
          {loading ? (
            <>
              <Timer className="h-4 w-4 animate-spin" /> Sending
            </>
          ) : (
            <>
              <ClipboardCheck className="h-4 w-4" /> Submit request
            </>
          )}
        </button>
        {ok === true && (
          <span className="text-sm text-emerald-600 dark:text-emerald-400">Thanks — we\'ll be in touch shortly.</span>
        )}
        {ok === false && (
          <span className="text-sm text-red-600">Something went wrong — email hello@oceanside.ai</span>
        )}
      </div>
    </form>
  );
}

const Input = ({ label, className = "", ...props }) => (
  <label className={`group relative block ${className}`}>
    <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</span>
    <input
      {...props}
      className="w-full rounded-2xl border border-zinc-200/80 bg-white/80 px-4 py-3 text-sm text-zinc-900 outline-none ring-0 transition placeholder:text-zinc-400 focus:border-zinc-300 focus:shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500"
    />
  </label>
);

const TextArea = ({ label, className = "", ...props }) => (
  <label className={`group relative block ${className}`}>
    <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</span>
    <textarea
      rows={5}
      {...props}
      className="w-full rounded-2xl border border-zinc-200/80 bg-white/80 px-4 py-3 text-sm text-zinc-900 outline-none ring-0 transition placeholder:text-zinc-400 focus:border-zinc-300 focus:shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500"
    />
  </label>
);

/********************
 * Hero Section      *
 ********************/

const Hero = ({ onOpenCalendly }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <Section id="home" className="relative overflow-hidden pt-20 md:pt-28" full>
      {/* Background gradient + particles */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950" />
      <div className="absolute inset-0 -z-10 opacity-60 mix-blend-screen dark:opacity-40">
        <ParticleField />
      </div>

      <Container className="relative">
        <motion.div style={{ y }} className="mx-auto max-w-3xl text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs text-zinc-700 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
            <Waves className="h-4 w-4 text-indigo-500" />
            <span>Voice AI engineered with cybersecurity rigor</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 text-balance text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl md:text-6xl dark:text-white"
          >
            {COMPANY.name}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-zinc-700 dark:text-zinc-300"
          >
            {COMPANY.tagline}
          </motion.p>

          <motion.div variants={stagger} initial="hidden" animate="show" className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <motion.button
              variants={fadeUp}
              onClick={onOpenCalendly}
              className="group inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-white dark:text-zinc-900"
            >
              <Play className="h-4 w-4" /> Book a strategy call
              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </motion.button>
            <motion.a
              variants={fadeUp}
              href="#contact"
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white/60 px-6 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-white"
            >
              <MousePointer2 className="h-4 w-4" /> Build my voice agent
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Soundwave */}
        <div className="mt-14">
          <SoundWaves height={360} />
        </div>

        {/* Trust badges / clients */}
        <div className="mt-14">
          <ClientRow />
        </div>
      </Container>

      {/* subtle bottom divider */}
      <div className="mt-16">
        <GradientDivider />
      </div>
    </Section>
  );
};

const ClientRow = () => (
  <div className="grid grid-cols-2 items-center justify-items-center gap-6 opacity-80 sm:grid-cols-3 md:grid-cols-6">
    {["CBN News", "Retail", "Finance", "Healthcare", "SaaS", "Support"].map((c) => (
      <div key={c} className="text-sm text-zinc-500 dark:text-zinc-400">{c}</div>
    ))}
  </div>
);

/********************
 * Services Section  *
 ********************/

const Services = () => (
  <Section id="services">
    <Container>
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-4xl dark:text-white">
          Production‑ready voice agents
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
          From first call to full scale. We design, secure, deploy, and optimize agents that represent your brand and deliver measurable ROI.
        </motion.p>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {COMPANY.services.map((s) => (
            <motion.div
              variants={fadeUp}
              key={s.name}
              className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white/60 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">{s.icon}</div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{s.name}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{s.desc}</p>
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-600/5 blur-2xl transition-opacity group-hover:opacity-70" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Container>
  </Section>
);

/********************
 * Case Studies      *
 ********************/

const CaseStudies = () => (
  <Section id="work" className="bg-gradient-to-b from-transparent to-zinc-50 dark:to-zinc-950/40">
    <Container>
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <motion.div variants={fadeUp} className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-4xl dark:text-white">Selected work</h2>
            <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">A snapshot of outcomes delivered with secure, human‑grade voice UX.</p>
          </div>
          <a href="#contact" className="hidden rounded-2xl border border-zinc-200 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 md:inline-flex dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900">Start a project</a>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {COMPANY.caseStudies.map((c) => (
            <motion.div
              variants={fadeUp}
              key={c.title}
              className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                  <Stars className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{c.title}</h3>
                  <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{c.logo}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{c.summary}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {c.impact.map((i) => (
                  <li key={i} className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    <Check className="h-3.5 w-3.5" /> {i}
                  </li>
                ))}
              </ul>
              <div className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-indigo-600/10 blur-2xl transition-opacity group-hover:opacity-70" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Container>
  </Section>
);

/********************
 * Mission + Pillars *
 ********************/

const Mission = () => (
  <Section id="mission">
    <Container>
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-4xl dark:text-white">
          Mission
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-3 max-w-3xl text-lg text-zinc-700 dark:text-zinc-300">
          {COMPANY.mission}
        </motion.p>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {COMPANY.pillars.map((p) => (
            <motion.div
              key={p.title}
              variants={fadeUp}
              className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">{p.icon}</div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{p.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Container>
  </Section>
);

/********************
 * About Story       *
 ********************/

const About = () => (
  <Section id="about" className="bg-gradient-to-b from-transparent to-zinc-50 dark:to-zinc-950/40">
    <Container>
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-4xl dark:text-white">
          {COMPANY.about.heading}
        </motion.h2>
        <motion.div variants={fadeUp} className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-5">
          <div className="md:col-span-3">
            <p className="whitespace-pre-line text-pretty text-zinc-700 dark:text-zinc-300">{COMPANY.about.story}</p>
          </div>
          <div className="md:col-span-2">
            <div className="rounded-3xl border border-zinc-200 bg-white/70 p-6 dark:border-zinc-800 dark:bg-zinc-900/70">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Credentials</h3>
              <ul className="mt-4 space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                <li className="flex items-center gap-2"><Lock className="h-4 w-4" /> Cybersecurity specialist founder</li>
                <li className="flex items-center gap-2"><Telescope className="h-4 w-4" /> Journalism background: fast, accurate, human tone</li>
                <li className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Q&A‑driven content extraction and style transfer</li>
                <li className="flex items-center gap-2"><Zap className="h-4 w-4" /> 4h → 20m script drafting breakthrough</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Container>
  </Section>
);

/********************
 * Integrations      *
 ********************/

const Integrations = () => (
  <Section id="integrations">
    <Container>
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-4xl dark:text-white">
          Integrations
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
          We fit into your stack — telephony, models, infra, and revenue systems.
        </motion.p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {COMPANY.integrations.map((name) => (
            <motion.div
              key={name}
              variants={fadeUp}
              className="flex items-center justify-center rounded-2xl border border-zinc-200 bg-white/70 px-4 py-6 text-sm text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300"
            >
              {name}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Container>
  </Section>
);

/********************
 * Pricing           *
 ********************/

const Pricing = () => (
  <Section id="pricing" className="bg-gradient-to-b from-transparent to-zinc-50 dark:to-zinc-950/40">
    <Container>
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-4xl dark:text-white">
          Pricing
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Flexible engagement models designed for speed to value and long‑term reliability.
        </motion.p>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {COMPANY.pricing.map((p) => (
            <motion.div
              key={p.tier}
              variants={fadeUp}
              className={`relative overflow-hidden rounded-3xl border p-6 shadow-sm transition ${
                p.highlighted
                  ? "border-indigo-300 bg-indigo-50/60 dark:border-indigo-500/30 dark:bg-indigo-500/5"
                  : "border-zinc-200 bg-white/70 dark:border-zinc-800 dark:bg-zinc-900/60"
              }`}
            >
              {p.highlighted && (
                <span className="absolute right-4 top-4 rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white">Popular</span>
              )}
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{p.tier}</h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{p.tagline}</p>
              <div className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">{p.price}</div>
              <ul className="mt-6 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> {f}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white/70 px-4 py-2 text-sm text-zinc-900 transition hover:-translate-y-0.5 hover:shadow dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-white"
              >
                <ArrowRight className="h-4 w-4" /> Get started
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Container>
  </Section>
);

/********************
 * FAQ               *
 ********************/

const FAQ = () => (
  <Section id="faq">
    <Container>
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-4xl dark:text-white">FAQ</motion.h2>
        <div className="mt-8 divide-y divide-zinc-200 rounded-3xl border border-zinc-200 bg-white/70 dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/60">
          {COMPANY.faqs.map((f, i) => (
            <details key={f.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left text-sm text-zinc-800 hover:bg-zinc-50/60 dark:text-zinc-200 dark:hover:bg-zinc-800/60">
                <span className="font-medium">{f.q}</span>
                <ChevronRight className="h-4 w-4 transition group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-6 text-sm text-zinc-600 dark:text-zinc-400">{f.a}</div>
              {i < COMPANY.faqs.length - 1 && <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />}
            </details>
          ))}
        </div>
      </motion.div>
    </Container>
  </Section>
);

/********************
 * Contact           *
 ********************/

const Contact = ({ webhook, onOpenCalendly }) => (
  <Section id="contact" className="bg-gradient-to-b from-transparent to-zinc-50 dark:to-zinc-950/40">
    <Container>
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-4xl dark:text-white">
          Let’s build your voice agent
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Share a few details and we\'ll reach out. Prefer live? Book instantly via Calendly.
        </motion.p>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <motion.div variants={fadeUp} className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            <LeadForm webhook={webhook} />
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-col justify-between rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Book a session</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">30‑minute discovery to map use‑cases, KPIs, and integration plan.</p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Zero‑pressure consult</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Timeline & budget alignment</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Security & compliance review</li>
              </ul>
            </div>
            <button
              onClick={onOpenCalendly}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-white dark:text-zinc-900"
            >
              <CalendarIcon /> Open Calendly
            </button>
          </motion.div>
        </div>
      </motion.div>
    </Container>
  </Section>
);

/********************
 * Navbar & Footer   *
 ********************/

const Nav = ({ onOpenCalendly, theme, setTheme }) => {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#services", label: "Services" },
    { href: "#work", label: "Work" },
    { href: "#mission", label: "Mission" },
    { href: "#about", label: "About" },
    { href: "#integrations", label: "Integrations" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contact" },
  ];

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  // Ensure the mobile menu icon is fully clickable and not blocked by any overlay
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const btn = document.querySelector('button[aria-label="Toggle menu"]');
    if (!btn) return;

    // Raise navbar z-index defensively
    const navWrapper = btn.closest('.fixed');
    if (navWrapper) { (navWrapper).style.zIndex = '1000'; }

    // Improve hit target and touch behavior
    Object.assign(btn.style, {
      touchAction: 'manipulation',
      WebkitTapHighlightColor: 'transparent',
      minWidth: '44px',
      minHeight: '44px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    });

    // Make sure clicking the SVG icon toggles as well
    const icon = btn.querySelector('svg');
    const onIconClick = (e) => { e.stopPropagation(); btn.click(); };
    if (icon) {
      icon.style.pointerEvents = 'auto';
      icon.addEventListener('click', onIconClick);
    }

    // Keyboard accessibility safeguard
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    };
    btn.addEventListener('keydown', onKey);

    return () => {
      if (icon) icon.removeEventListener('click', onIconClick);
      btn.removeEventListener('keydown', onKey);
    };
  }, []);

  // Make hash links (AI, Services, Work, Mission, About, Integrations, Pricing, FAQ, Contact) reliably clickable
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const anchors = Array.from(document.querySelectorAll('a[href^="#"]'));

    const onClick = (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        setOpen(false); // close mobile menu if open
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        try { history.replaceState(null, '', href); } catch {}
      }
    };

    anchors.forEach((a) => {
      a.style.pointerEvents = 'auto';
      a.addEventListener('click', onClick);
      a.setAttribute('role', a.getAttribute('role') || 'link');
      a.setAttribute('tabindex', a.getAttribute('tabindex') || '0');
    });

    return () => {
      anchors.forEach((a) => a.removeEventListener('click', onClick));
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 md:px-10">
        <div className="flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-white/70 px-4 py-2.5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <a href="#home" className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
              <Waves className="h-4 w-4" />
            </div>
            <span>Oceanside AI</span>
          </a>
          <div className="hidden items-center gap-6 md:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-zinc-700 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
                {l.label}
              </a>
            ))}
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <button
              onClick={onOpenCalendly}
              className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-white dark:text-zinc-900"
            >
              <PhoneCall className="h-4 w-4" /> Book a call
            </button>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white/70 p-2 text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300"
            >
              <ChevronRight className={`h-4 w-4 transition ${open ? "rotate-90" : ""}`} />
            </button>
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 overflow-hidden rounded-2xl border border-zinc-200 bg-white/80 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70 md:hidden"
            >
              <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
                {links.map((l) => (
                  <a key={l.href} href={l.href} className="px-4 py-3 text-sm text-zinc-800 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-800">
                    {l.label}
                  </a>
                ))}
                <button onClick={onOpenCalendly} className="flex items-center gap-2 px-4 py-3 text-left text-sm text-zinc-800 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-800">
                  <PhoneCall className="h-4 w-4" /> Book a call
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Footer = ({ onOpenCalendly }) => (
  <footer className="border-t border-zinc-200 bg-white/60 py-10 text-sm dark:border-zinc-800 dark:bg-zinc-950/40">
    <Container className="flex flex-col items-center justify-between gap-6 md:flex-row">
      <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
          <Waves className="h-4 w-4" />
        </div>
        <span>© {new Date().getFullYear()} {COMPANY.name}</span>
      </div>
      <div className="flex items-center gap-4">
        <a href="#privacy" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Privacy</a>
        <a href="#terms" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Terms</a>
        <button onClick={onOpenCalendly} className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-1.5 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900">
          <CalendarIcon /> Book
        </button>
      </div>
    </Container>
  </footer>
);

/********************
 * Page Component    *
 ********************/

export default function OceansideSite() {
  const { theme, setTheme } = useTheme();
  const [calOpen, setCalOpen] = useState(false);

  // Ensure services cards are keyboard-accessible and clickable without modifying existing markup
  useEffect(() => {
    if (typeof document === "undefined") return;
    const nodes = Array.from(document.querySelectorAll('#services .group'));
    nodes.forEach((el) => {
      try {
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        const onActivate = () => { window.location.hash = '#contact'; };
        const onKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onActivate(); } };
        el.addEventListener('click', onActivate);
        el.addEventListener('keydown', onKey);
        // store handlers for cleanup by attaching to element
        el.__oceanside_cleanup = { onActivate, onKey };
      } catch (err) {
        // swallow — DOM mutation might fail in SSR
      }
    });
    return () => {
      nodes.forEach((el) => {
        try {
          if (el.__oceanside_cleanup) {
            el.removeEventListener('click', el.__oceanside_cleanup.onActivate);
            el.removeEventListener('keydown', el.__oceanside_cleanup.onKey);
            delete el.__oceanside_cleanup;
          }
        } catch (err) {}
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-white">
      <Nav onOpenCalendly={() => setCalOpen(true)} theme={theme} setTheme={setTheme} />
      <main>
        {/* Hero */}
        <Hero onOpenCalendly={() => setCalOpen(true)} />
        {/* Services */}
        <Services />
        <GradientDivider />
        {/* Case Studies */}
        <CaseStudies />
        <GradientDivider />
        {/* Mission */}
        <Mission />
        <GradientDivider />
        {/* About */}
        <About />
        <GradientDivider />
        {/* Integrations */}
        <Integrations />
        <GradientDivider />
        {/* Pricing */}
        <Pricing />
        <GradientDivider />
        {/* FAQ */}
        <FAQ />
        <GradientDivider />
        {/* Contact */}
        <Contact webhook={COMPANY.webhook} onOpenCalendly={() => setCalOpen(true)} />
      </main>
      <Footer onOpenCalendly={() => setCalOpen(true)} />

      {/* Calendly Modal */}
      <CalendlyModal open={calOpen} onClose={() => setCalOpen(false)} url={COMPANY.calendly} />

      {/* Background decorative spotlight */}
      <div className="pointer-events-none fixed inset-x-0 top-[-10%] -z-10 mx-auto h-[40rem] w-[60rem] rounded-full bg-indigo-500/10 blur-3xl" />
    </div>
  );
}
