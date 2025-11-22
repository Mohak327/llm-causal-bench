import React, { useState, useEffect } from "react";
import {
  Brain,
  Globe,
  Activity,
  Code,
  Terminal,
  Database,
  Cpu,
  ExternalLink,
  Mail,
  ArrowRight,
} from "lucide-react";

const Home = () => {
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme Colors
  const THEME = {
    bg: "bg-[#f0f0f0]", // Paper white/grey
    text: "text-black",
    border: "border-black",
    shadow: "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    hoverShadow:
      "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]",
    cardBg: "bg-white",
    accentPink: "bg-[#ff90e8]", // Brain/Neuro
    accentGreen: "bg-[#4ade80]", // Bio/Health
    accentPurple: "bg-[#a78bfa]", // Cosmos/Compute
    accentYellow: "bg-[#facc15]", // Core Tech
  };

  return (
    <div
      className={`min-h-screen ${THEME.bg} ${THEME.text} font-mono selection:bg-black selection:text-white overflow-x-hidden`}
    >
      {/* --- NAV MARQUEE --- */}
      <div className="fixed top-0 w-full z-50 border-b-4 border-black bg-[#facc15] overflow-hidden whitespace-nowrap py-2">
        <div className="animate-marquee inline-block">
          <span className="mx-4 text-lg font-bold uppercase tracking-tighter">
            MOHAK SHARMA • COLUMBIA UNIVERSITY • NEUROSCIENCE • HEALTHTECH •
            FULL STACK •
          </span>
          <span className="mx-4 text-lg font-bold uppercase tracking-tighter">
            MOHAK SHARMA • COLUMBIA UNIVERSITY • NEUROSCIENCE • HEALTHTECH •
            FULL STACK •
          </span>
        </div>
      </div>

      <main className="container mx-auto px-4 pt-24 pb-20 max-w-6xl">
        {/* --- HERO SECTION --- */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-4 border-black bg-white mb-16">
          <div className="lg:col-span-8 p-8 lg:p-16 border-b-4 lg:border-b-0 lg:border-r-4 border-black flex flex-col justify-center relative overflow-hidden">
            {/* Background Pattern */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #000 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            ></div>

            <h1 className="text-6xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter mb-6 relative z-10">
              Mohak
              <br />
              Sharma
            </h1>
            <p className="text-xl lg:text-2xl font-bold mb-8 max-w-2xl">
              Engineering the intersection of{" "}
              <span className="bg-[#ff90e8] px-1 border border-black">
                Biological Systems
              </span>{" "}
              and{" "}
              <span className="bg-[#a78bfa] px-1 border border-black">
                Computational Intelligence
              </span>
              .
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:ms7306@columbia.edu"
                className={`flex items-center gap-2 px-6 py-3 border-2 border-black font-bold uppercase bg-white transition-all ${THEME.shadow} ${THEME.hoverShadow}`}
              >
                <Mail size={20} /> Contact Me
              </a>
              {/* <a href="https://github.com/Mohak327" target="_blank" className={`flex items-center gap-2 px-6 py-3 border-2 border-black font-bold uppercase bg-white transition-all ${THEME.shadow} ${THEME.hoverShadow}`}>
                <Github size={20} /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/sharma-mohak/" target="_blank" className={`flex items-center gap-2 px-6 py-3 border-2 border-black font-bold uppercase bg-[#0077b5] text-white transition-all ${THEME.shadow} ${THEME.hoverShadow}`}>
                <Linkedin size={20} /> LinkedIn
              </a> */}
            </div>
          </div>

          <div className="lg:col-span-4 bg-black text-white p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-white pb-2">
                Current Status
              </h2>
              <p className="mb-6 text-lg">
                <span className="text-[#4ade80]">●</span> M.S. CS @ Columbia
                University
                <br />
                <span className="text-[#a78bfa]">●</span> Researcher @ CRIS Lab
              </p>
            </div>
            <div>
              <div className="border-2 border-white p-4 mb-4 rotate-1 hover:rotate-0 transition-transform">
                <span className="block text-xs uppercase opacity-70">
                  Location
                </span>
                <span className="text-xl font-bold">New York, NY</span>
              </div>
              <div className="border-2 border-white p-4 -rotate-1 hover:rotate-0 transition-transform">
                <span className="block text-xs uppercase opacity-70">
                  Focus
                </span>
                <span className="text-xl font-bold">Healthcare, Environment, Finance</span>
              </div>
            </div>
          </div>
        </header>

        {/* --- TECH STACK TICKER --- */}
        <section className="mb-16 border-4 border-black bg-white p-8 relative">
          <div className="absolute -top-4 left-8 bg-[#facc15] px-4 py-1 border-2 border-black font-bold uppercase transform -rotate-2">
            Technical Arsenal
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {[
              "Python",
              "C++",
              "React 19",
              "Next.js",
              "TypeScript",
              "GraphQL",
              "AWS",
              "AlphaFold",
              "Pytorch",
              "MongoDB",
            ].map((skill) => (
              <span
                key={skill}
                className={`px-3 py-1 border-2 border-black font-bold uppercase text-sm hover:bg-black hover:text-white transition-colors cursor-default`}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* --- EXPERIENCE COLUMN --- */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-black text-white p-2 border-2 border-black">
                <Terminal size={24} />
              </div>
              <h2 className="text-4xl font-black uppercase">Experience</h2>
            </div>

            {/* CRIS LAB */}
            <div
              className={`border-4 border-black bg-white p-6 relative group transition-all ${THEME.shadow}`}
            >
              <div
                className={`absolute top-0 right-0 p-2 border-l-4 border-b-4 border-black ${THEME.accentPurple} font-bold`}
              >
                2025 - Present
              </div>
              <h3 className="text-2xl font-black uppercase mb-1 mt-6">
                Graduate Research Assistant
              </h3>
              <div className="text-lg font-bold mb-4 flex items-center gap-2">
                CRIS Lab, NY <ExternalLink size={16} />
              </div>
              <ul className="list-disc list-inside space-y-2 text-sm font-medium">
                <li>
                  Analyzed Predicted Aligned Error (PAE) for 400-dim protein
                  matrices.
                </li>
                <li>
                  Probed embeddings from 200K+ protein structures (AlphaFold DB)
                  across 48 transformer layers.
                </li>
                <li>
                  Uncovered principles of biological representation for drug
                  discovery.
                </li>
              </ul>
            </div>

            {/* OUTSCAL */}
            <div
              className={`border-4 border-black bg-white p-6 relative group transition-all ${THEME.shadow}`}
            >
              <div
                className={`absolute top-0 right-0 p-2 border-l-4 border-b-4 border-black ${THEME.accentYellow} font-bold`}
              >
                2023 - 2025
              </div>
              <h3 className="text-2xl font-black uppercase mb-1 mt-6">
                Full Stack Engineer
              </h3>
              <div className="text-lg font-bold mb-4">Outscal, India </div>
              <ul className="list-disc list-inside space-y-2 text-sm font-medium">
                <li>
                  Overhauled architecture with Next.js & GraphQL, boosting
                  performance by 35%.
                </li>
                <li>Developed a JIT compiler cutting execution time by 40%.</li>
                <li>Optimized Web Vitals by 800% via SEO refactoring.</li>
                <li>Migrated JS codebase to TypeScript using AI tools.</li>
              </ul>
            </div>

            {/* TRAVCLAN */}
            <div
              className={`border-4 border-black bg-white p-6 relative group transition-all ${THEME.shadow}`}
            >
              <div
                className={`absolute top-0 right-0 p-2 border-l-4 border-b-4 border-black ${THEME.accentYellow} font-bold`}
              >
                2022 - 2023
              </div>
              <h3 className="text-2xl font-black uppercase mb-1 mt-6">
                Frontend Web Developer
              </h3>
              <div className="text-lg font-bold mb-4">Travclan </div>
              <ul className="list-disc list-inside space-y-2 text-sm font-medium">
                <li>
                  Built React admin panel accelerating output by 40% for 250+
                  teammates.
                </li>
                <li>
                  Implemented micro-frontend architecture, cutting build sizes
                  by 35%.
                </li>
              </ul>
            </div>
          </div>

          {/* --- RIGHT COLUMN: PROJECTS & EDUCATION --- */}
          <div className="flex flex-col gap-8">
            {/* PROJECTS HEADER */}
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-black text-white p-2 border-2 border-black">
                <Brain size={24} />
              </div>
              <h2 className="text-4xl font-black uppercase">Projects</h2>
            </div>

            {/* PROJECT 1: NEURAL */}
            <div
              className={`border-4 border-black ${THEME.accentPink} p-6 relative transition-all ${THEME.shadow} ${THEME.hoverShadow}`}
            >
              <div className="bg-white border-2 border-black inline-block px-3 py-1 font-bold text-xs uppercase mb-4">
                Neuroscience / Causal ML
              </div>
              <h3 className="text-2xl font-black uppercase mb-2 leading-tight">
                Causal & Time Series Analysis of Neural Activity
              </h3>
              <p className="text-sm font-bold mb-4 border-l-4 border-black pl-4">
                Using Hodgkin-Huxley & Rinzel models to investigate synaptic
                activity.
              </p>
              <div className="flex gap-2">
                <span className="bg-black text-white px-2 py-1 text-xs font-bold">
                  Python
                </span>
                <span className="bg-black text-white px-2 py-1 text-xs font-bold">
                  Simulations
                </span>
              </div>
            </div>

            {/* PROJECT 2: CARDIAC */}
            <div
              className={`border-4 border-black ${THEME.accentGreen} p-6 relative transition-all ${THEME.shadow} ${THEME.hoverShadow}`}
            >
              <div className="bg-white border-2 border-black inline-block px-3 py-1 font-bold text-xs uppercase mb-4">
                HealthTech / Biophysics
              </div>
              <h3 className="text-2xl font-black uppercase mb-2 leading-tight">
                Computational Cardiac Modeling
              </h3>
              <p className="text-sm font-bold mb-4 border-l-4 border-black pl-4">
                ECG signal modeling and Phase Response Curve (PRC) analysis
                using nonlinear ODE simulations.
              </p>
              <div className="flex gap-2">
                <span className="bg-black text-white px-2 py-1 text-xs font-bold">
                  Biophysics
                </span>
                <span className="bg-black text-white px-2 py-1 text-xs font-bold">
                  Nonlinear ODE
                </span>
              </div>
            </div>

            {/* EDUCATION SECTION */}
            <div className="flex items-center gap-4 mb-2 mt-8">
              <div className="bg-black text-white p-2 border-2 border-black">
                <Activity size={24} />
              </div>
              <h2 className="text-4xl font-black uppercase">Education</h2>
            </div>

            <div className="border-4 border-black bg-white p-0">
              {/* Columbia */}
              <div className="p-6 border-b-4 border-black bg-[#f0fdf4]">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black uppercase">
                    Columbia University
                  </h3>
                  <span className="font-bold bg-black text-white px-2">
                    2026
                  </span>
                </div>
                <div className="font-bold text-sm mb-2">
                  M.S. Computer Science
                </div>
                <p className="text-xs leading-relaxed border-l-2 border-black pl-2">
                  Coursework: Machine Learning, Causal Inference, Computational
                  Neuroscience, Quantum Computing.
                </p>
              </div>

              {/* GGSIPU */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black uppercase">GGSIPU</h3>
                  <span className="font-bold bg-white border-2 border-black px-2">
                    2023
                  </span>
                </div>
                <div className="font-bold text-sm mb-2">B.Tech Computer Science</div>
                <p className="text-xs leading-relaxed border-l-2 border-black pl-2">
                  Coursework: Advanced Math, Physics, OOPS, Data Structures,
                  Networks, OS, DBMS, Engineering Mechanics, Circuits & Systems,
                  Computer Organisation & Architecture, Theory of Computation,
                  Agile Methodologies, Switching Theory & Logical Design.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- FOOTER / EXTRACURRICULAR --- */}
        <footer className="mt-20 border-t-4 border-black pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className={`col-span-2 border-4 border-black p-8 bg-white relative ${THEME.shadow}`}
            >
              <div className="absolute -top-5 left-4 bg-black text-white px-4 py-1 font-bold uppercase rotate-1">
                Beyond the Code
              </div>
              {/* Leadership & Impact Section */}
              <h3 className="text-xl font-black uppercase tracking-tight border-b-2 border-black pb-2 mb-4">Leadership & Impact</h3>
              {/* Graduate Admissions Ambassador */}
              <div className="mb-6">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-lg">Graduate Admissions Ambassador, Columbia University</h4>
                  <span className="text-xs font-bold">Oct 2025 - Present</span>
                </div>
                <ul className="list-disc list-inside leading-relaxed mt-2 space-y-1 text-sm font-medium">
                  <li>Begun outreach & mentoring efforts impacting over <span className="font-bold">2,000</span> potential graduate candidates annually.</li>
                  <li>Serves as a primary resource during major admissions events guiding students toward informed enrollment decisions.</li>
                </ul>
              </div>
              {/* Student Volunteer */}
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-lg">Student Volunteer (Rotary Intl. Dist. 3012, NSS, GGSIPU)</h4>
                  <span className="text-xs font-bold">2019 - 2024</span>
                </div>
                <ul className="list-disc list-inside text-sm leading-relaxed mt-2 space-y-1 font-medium">
                  <li>District Editor & Events Coordinator; awarded “Pillar of the District” & “Best OC” at Rotary Youth Leadership Summit 2023.</li>
                  <li>Chaired Project Aashayein; curated syllabus for 60+ children (2020–21), taught Science & Economics, trained 12 teaching volunteers.</li>
                  <li>Oversaw 400% member growth, organized 300+ events, donated 100,000+ medical/sanitary kits, collected 300 kg plastic waste as ecobricks.</li>
                  <li>Co-founded CodeFlux tech community scaled to 1000+ members; organized 8+ coding workshops.</li>
                  <li>Co-Founded & Events Head (Cultural Committee BPIT); led 30+ technical & cultural events engaging 20,000+ students; secured $25,000 sponsorship.</li>
                  <li>Redressal Committee Student Representative, responsible for over 2000 students on campus.</li>
                  <li>Led cancer awareness team for Project Power of Ponytails: 10+ mammography sessions & 30+ awareness events.</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col justify-center items-start space-y-4">
              <h4 className="font-black uppercase text-xl">
                Let's Build The Future.
              </h4>
              <a
                href="mailto:ms7306@columbia.edu"
                className="text-lg font-bold hover:bg-[#ff90e8] hover:px-2 transition-all border-b-2 border-black"
              >
                ms7306@columbia.edu
              </a>
              <a
                href="https://www.linkedin.com/in/sharma-mohak/"
                className="text-lg font-bold hover:bg-[#0077b5] hover:text-white hover:px-2 transition-all border-b-2 border-black"
              >
                LinkedIn Profile
              </a>
            </div>
          </div>
          <div className="text-center mt-12 font-bold uppercase text-sm opacity-50">
            © 2025 Mohak Sharma.
          </div>
        </footer>
      </main>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
