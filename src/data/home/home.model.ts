
import { allProjects } from "@/data/projects/projects.model";
import { Theme } from "../../Theme";

export const homeData = {
  marquee:
    "MOHAK SHARMA • COLUMBIA UNIVERSITY • NEUROSCIENCE • HEALTHTECH • FULL STACK",
  hero: {
    title: ["Mohak", "Sharma"],
    subtitle: {
      prefix: "Engineering the intersection of",
      highlight1: "Biological Systems",
      and: "and",
      highlight2: "Computational Intelligence",
    },
    contact: "Contact Me",
  },
  status: {
    title: "Current Status",
    lines: [
      { text: "M.S. CS @ Columbia University", color: "text-green-400" },
      { text: "Researcher @ CRIS Lab", color: "text-purple-400" },
    ],
  },
  meta: [
    { label: "Location", value: "New York, NY" },
    { label: "Focus", value: "Healthcare, Environment, Finance" },
  ],
  techArsenal: {
    title: "Technical Arsenal",
    skills: [
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
    ],
  },
  experience: {
    title: "Experience",
    jobs: [
      {
        role: "Graduate Research Assistant",
        company: "CRIS Lab, NY",
        duration: "2025 - Present",
        tasks: [
          "Analyzed Predicted Aligned Error (PAE) for 400-dim protein matrices.",
          "Probed embeddings from 200K+ protein structures (AlphaFold DB) across 48 transformer layers.",
          "Uncovered principles of biological representation for drug discovery.",
        ],
        accent: Theme.colors.purple[400],
        bgColor: Theme.colors.white,
      },
      {
        role: "Full Stack Engineer",
        company: "Outscal, India",
        duration: "2023 - 2025",
        tasks: [
          "Overhauled architecture with Next.js & GraphQL, boosting performance by 35%.",
          "Developed a JIT compiler cutting execution time by 40%.",
          "Optimized Web Vitals by 800% via SEO refactoring.",
          "Migrated JS codebase to TypeScript using AI tools.",
        ],
        accent: Theme.colors.yellow[400],
        bgColor: Theme.colors.white,
      },
      {
        role: "Frontend Web Developer",
        company: "Travclan",
        duration: "2022 - 2023",
        tasks: [
          "Built React admin panel accelerating output by 40% for 250+ teammates.",
          "Implemented micro-frontend architecture, cutting build sizes by 35%.",
        ],
        accent: Theme.colors.yellow[400],
        bgColor: Theme.colors.white,
      },
    ],
  },
  projects: {
    title: "Projects",
    items: allProjects.map((p) => ({
      id: p.id,
      link: `/projects/${p.id}`,
      category: p.category,
      title: p.title,
      description: p.summary,
      tags: p.tags,
      accent: p.accentColor,
      bgColor: p.accentColor,
    })),
  },
  education: {
    title: "Education",
    degrees: [
      {
        university: "Columbia University",
        year: "2026",
        degree: "M.S. Computer Science",
        courses:
          "Coursework: Machine Learning, Causal Inference, Computational Neuroscience, Quantum Computing.",
        bgColor: Theme.colors.blue[100],
      },
      {
        university: "GGSIPU",
        year: "2023",
        degree: "B.Tech Computer Science",
        courses:
          "Coursework: Advanced Math, Physics, OOPS, Data Structures, Networks, OS, DBMS, Engineering Mechanics, Circuits & Systems, Computer Organisation & Architecture, Theory of Computation, Agile Methodologies, Switching Theory & Logical Design.",
      },
    ],
  },
  footer: {
    beyondTheCode: {
      title: "Beyond the Code",
      subtitle: "Leadership & Impact",
      sections: [
        {
          title: "Graduate Admissions Ambassador, Columbia University",
          duration: "Oct 2025 - Present",
          points: [
            "Begun outreach & mentoring efforts impacting over 2,000 potential graduate candidates annually.",
            "Serves as a primary resource during major admissions events guiding students toward informed enrollment decisions.",
          ],
        },
        {
          title: "Student Volunteer (Rotary Intl. Dist. 3012, NSS, GGSIPU)",
          duration: "2019 - 2024",
          points: [
            "District Editor & Events Coordinator; awarded “Pillar of the District” & “Best OC” at Rotary Youth Leadership Summit 2023.",
            "Chaired Project Aashayein; curated syllabus for 60+ children (2020–21), taught Science & Economics, trained 12 teaching volunteers.",
            "Oversaw 400% member growth, organized 300+ events, donated 100,000+ medical/sanitary kits, collected 300 kg plastic waste as ecobricks.",
            "Co-founded CodeFlux tech community scaled to 1000+ members; organized 8+ coding workshops.",
            "Co-Founded & Events Head (Cultural Committee BPIT); led 30+ technical & cultural events engaging 20,000+ students; secured $25,000 sponsorship.",
            "Redressal Committee Student Representative, responsible for over 2000 students on campus.",
            "Led cancer awareness team for Project Power of Ponytails: 10+ mammography sessions & 30+ awareness events.",
          ],
        },
      ],
    },
    contact: {
      title: "Let's Build The Future.",
      links: [
        {
          text: "ms7306@columbia.edu",
          href: "mailto:ms7306@columbia.edu",
          hoverClass: "hover:px-1 hover:bg-[#ff90e8]",
        },
        {
          text: "LinkedIn Profile",
          href: "https://www.linkedin.com/in/sharma-mohak/",
          hoverClass: "hover:px-1 hover:bg-[#0077b5] hover:text-white",
        },
      ],
    },
    copyright: "© 2025 Mohak Sharma.",
  },
};
