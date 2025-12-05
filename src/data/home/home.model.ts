import { projects } from "@/data/projects/projects.model_tmp";
import { Theme } from "../../Theme";
import { ArrowBigRight } from "lucide-react";
import { MdEmail } from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export const homeData = {
  marquee:
    "MOHAK SHARMA • COLUMBIA UNIVERSITY • NEUROSCIENCE • HEALTHTECH • FULL STACK",
  hero: {
    title: ["Mohak", "Sharma"],
    subtitle: {
      prefix: "Fullstack developer with 3+ years of experience, engineering at the intersection of",
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
    // { label: "Focus", value: "Healthcare, Environment, Finance" },
  ],
  techArsenal: {
    title: "Developer Arsenal",
    ctaLink: "/skills",
    ctaText: "Full Skill Matrix",
    ctaIcon: ArrowBigRight,
  },
  experience: {
    title: "Experience",
    jobs: [
      {
        role: "Student Research Assistant",
        company:
          "Complex Resilient Intelligent Systems Laboratory (CRIS), Columbia University",
        duration: "2025 - Present",
        link: undefined,
        tasks: [
          "Leveraged <b>statistical</b> and <i>machine learning</i> models and protein structure visualization tools like <span class='highlight'>ChimeraX</span> to analyze Predicted Aligned Error (PAE) matrices, uncovering mechanistic insights into protein interactions and structural uncertainty in 400-dimensional protein structures.",
          "Probed embeddings from <span class='highlight'>200K+</span> protein structures (AlphaFold DB) across 48 transformer layers.",
        ],
        accent: Theme.colors.purple[400],
        bgColor: Theme.colors.white,
      },
      {
        role: "Full Stack Engineer (Growth)",
        company: "Outscal, India",
        duration: "2023 - 2025",
        link: undefined,
        tasks: [
          "Overhauled website architecture using Next.js and GraphQL, implementing object-oriented design patterns for scalability, boosting pageperformance by 35%, and reliably serving a userbase exceeding 400K+ users.",
          "Integrated Strapi as an end-to-end CMS and UI builder for real-time page creation and deployment, saving 60+ dev hours/week, effectively making everyone in the team a front-end developer.",
          "Developed a JIT compiler with Piston and JDoodle, enabling users to run code in-browser and cutting execution time by 40%.",
          "Optimized SEO by refactoring codebase, generating XML sitemaps, and embedding structured data, resulting in improved search enginerankings and Web Vitals scores (CLS, TBT, LCP, Speed Index) by up to 800%, down to 100ms for some pages",
          "Scheduled deployments, allocated cloud resources, and operated cross-team risk/issue management; set up monitoring systems withCloudWatch and Lambda, reducing downtime alerts by 50%.",
          "Directed product management by analyzing user funnel data, shaping business requirements with stakeholders, and collaborating across teams to run targeted product experiments as sole growth engineer, increasing conversion rates by 15%.",
          "Migrated JavaScript codebase into TypeScript leveraging Jules AI, Codex, and Google Gemini; leveraged AI tools to streamline code reviewsand prototyping, enhancing developer productivity by ~50%.",
        ],
        accent: Theme.colors.yellow[400],
        bgColor: Theme.colors.white,
      },
      {
        role: "Frontend Web Developer",
        company: "Travclan",
        duration: "2022 - 2023",
        link: undefined,
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
    items: projects.map((p) => ({
      id: p.id,
      link: `/projects/${p.id}`,
      focus: p.focus,
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
        university: "Columbia University (NY, USA)",
        year: "2025 - 2027",
        degree: "M.S. Computer Science",
        courses:
          "Coursework: Machine Learning, Causal Inference, Computational Neuroscience, Quantum Computing, Mechanistic Interpretibility of Neural Nets.",
        bgColor: Theme.colors.blue[100],
      },
      {
        university: "GGSIPU (Delhi, India)",
        year: "2019 - 2023",
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
          icon: MdEmail,
          href: "mailto:ms7306@columbia.edu",
          hoverClass: "hover:px-1 hover:bg-[#ff90e8]",
        },
        {
          text: "LinkedIn Profile",
          icon: FaLinkedin,
          href: "https://www.linkedin.com/in/sharma-mohak/",
          hoverClass: "hover:px-1 hover:bg-[#0077b5] hover:text-white",
        },
        {
          text: "Github Profile",
          icon: FaGithub,
          href: "https://github.com/Mohak327",
          hoverClass: "hover:px-1 hover:bg-[#5b21b6] hover:text-white",
        },
      ],
    },
    copyright: "© 2025 Mohak Sharma.",
  },
};
