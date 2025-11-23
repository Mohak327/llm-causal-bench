import React from 'react';
import { homeData } from './Home.model';
import { Brain, Activity, Terminal, ExternalLink, Mail } from 'lucide-react';
import { Theme } from '../../Theme';

const HomeView = () => {
  return (
    <div className={`min-h-screen text-black font-mono selection:bg-black selection:text-white overflow-x-hidden`}>
      <div style={{ backgroundColor: Theme.colors.yellow[400] }} className={`fixed top-0 w-full z-50 border-b-4 border-black overflow-hidden whitespace-nowrap py-2`}>
        <div className="animate-marquee inline-block">
          <span className="mx-4 text-lg font-bold uppercase tracking-tighter">{homeData.marquee}</span>
          <span className="mx-4 text-lg font-bold uppercase tracking-tighter">{homeData.marquee}</span>
        </div>
      </div>

      <main className="container mx-auto px-4 pt-24 pb-20 max-w-6xl">
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-4 border-black bg-white mb-16">
          <div className="lg:col-span-8 p-8 lg:p-16 border-b-4 lg:border-b-0 lg:border-r-4 border-black flex flex-col justify-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            ></div>
            <h1 className="text-6xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter mb-6 relative z-10">
              {homeData.hero.title[0]}<br />{homeData.hero.title[1]}
            </h1>
            <p className="text-xl lg:text-2xl font-bold mb-8 max-w-2xl">
              {homeData.hero.subtitle.prefix}{" "}
              <span style={{ backgroundColor: Theme.colors.pink[400] }} className={`px-1 border border-black`}>{homeData.hero.subtitle.highlight1}</span>{" "}
              {homeData.hero.subtitle.and}{" "}
              <span style={{ backgroundColor: Theme.colors.purple[400] }} className={`px-1 border border-black`}>{homeData.hero.subtitle.highlight2}</span>.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="mailto:ms7306@columbia.edu" className={`flex items-center gap-2 px-6 py-3 border-2 border-black font-bold uppercase bg-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]`}>
                <Mail size={20} /> {homeData.hero.contact}
              </a>
            </div>
          </div>
          <div className="lg:col-span-4 bg-black text-white p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-white pb-2">{homeData.status.title}</h2>
              <p className="mb-6 text-lg">
                {homeData.status.lines.map((line, index) => (
                  <React.Fragment key={index}>
                    <span className={line.color}>●</span> {line.text}<br />
                  </React.Fragment>
                ))}
              </p>
            </div>
            <div>
              {homeData.meta.map((item, index) => (
                <div key={index} className={`border-2 border-white p-4 mb-4 ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 transition-transform`}>
                  <span className="block text-xs uppercase opacity-70">{item.label}</span>
                  <span className="text-xl font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section className="mb-16 border-4 border-black bg-white p-8 relative">
          <div style={{ backgroundColor: Theme.colors.yellow[400] }} className={`absolute -top-4 left-8 px-4 py-1 border-2 border-black font-bold uppercase transform -rotate-2`}>
            {homeData.techArsenal.title}
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {homeData.techArsenal.skills.map((skill) => (
              <span key={skill} className="px-3 py-1 border-2 border-black font-bold uppercase text-sm hover:bg-black hover:text-white transition-colors cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-black text-white p-2 border-2 border-black"><Terminal size={24} /></div>
              <h2 className="text-4xl font-black uppercase">{homeData.experience.title}</h2>
            </div>
            {homeData.experience.jobs.map((job, index) => (
              <div key={index} className={`border-4 border-black bg-white p-6 relative group transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                <div style={{ backgroundColor: Theme.colors[job.accent as keyof typeof Theme.colors][400] }} className={`absolute top-0 right-0 p-2 border-l-4 border-b-4 border-black font-bold`}>
                  {job.duration}
                </div>
                <h3 className="text-2xl font-black uppercase mb-1 mt-6">{job.role}</h3>
                <div className="text-lg font-bold mb-4 flex items-center gap-2">
                  {job.company} {job.company.includes('CRIS') && <ExternalLink size={16} />}
                </div>
                <ul className="list-disc list-inside space-y-2 text-sm font-medium">
                  {job.tasks.map((task, i) => <li key={i}>{task}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-black text-white p-2 border-2 border-black"><Brain size={24} /></div>
              <h2 className="text-4xl font-black uppercase">{homeData.projects.title}</h2>
            </div>
            {homeData.projects.items.map((project, index) => (
              <div key={index} style={{ backgroundColor: Theme.colors[project.accent as keyof typeof Theme.colors][400] }} className={`border-4 border-black p-6 relative transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]`}>
                <div className="bg-white border-2 border-black inline-block px-3 py-1 font-bold text-xs uppercase mb-4">
                  {project.category}
                </div>
                <h3 className="text-2xl font-black uppercase mb-2 leading-tight">{project.title}</h3>
                <p className="text-sm font-bold mb-4 border-l-4 border-black pl-4">{project.description}</p>
                <div className="flex gap-2">
                  {project.tags.map(tag => <span key={tag} className="bg-black text-white px-2 py-1 text-xs font-bold">{tag}</span>)}
                </div>
              </div>
            ))}

            <div className="flex items-center gap-4 mb-2 mt-8">
              <div className="bg-black text-white p-2 border-2 border-black"><Activity size={24} /></div>
              <h2 className="text-4xl font-black uppercase">{homeData.education.title}</h2>
            </div>
            <div className="border-4 border-black bg-white p-0">
              {homeData.education.degrees.map((degree, index) => (
                <div key={index} className={`p-6 ${index === 0 ? 'border-b-4 border-black' : ''} ${degree.style}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-black uppercase">{degree.university}</h3>
                    <span className={`font-bold ${index === 0 ? 'bg-black text-white' : 'bg-white border-2 border-black'} px-2`}>
                      {degree.year}
                    </span>
                  </div>
                  <div className="font-bold text-sm mb-2">{degree.degree}</div>
                  <p className="text-xs leading-relaxed border-l-2 border-black pl-2">{degree.courses}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="mt-20 border-t-4 border-black pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`col-span-2 border-4 border-black p-8 bg-white relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
              <div className="absolute -top-5 left-4 bg-black text-white px-4 py-1 font-bold uppercase rotate-1">
                {homeData.footer.beyondTheCode.title}
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight border-b-2 border-black pb-2 mb-4">{homeData.footer.beyondTheCode.subtitle}</h3>
              {homeData.footer.beyondTheCode.sections.map((section, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg">{section.title}</h4>
                    <span className="text-xs font-bold">{section.duration}</span>
                  </div>
                  <ul className="list-disc list-inside leading-relaxed mt-2 space-y-1 text-sm font-medium">
                    {section.points.map((point, i) => <li key={i} dangerouslySetInnerHTML={{ __html: point.replace(/(\d+,?\d*)/g, '<span class="font-bold">$1</span>') }}></li>)}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center items-start space-y-4">
              <h4 className="font-black uppercase text-xl">{homeData.footer.contact.title}</h4>
              {homeData.footer.contact.links.map((link, index) => (
                <a key={index} href={link.href} className={`text-lg font-bold ${link.hoverClass} transition-all border-b-2 border-black`}>
                  {link.text}
                </a>
              ))}
            </div>
          </div>
          <div className="text-center mt-12 font-bold uppercase text-sm opacity-50">
            {homeData.footer.copyright}
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

export default HomeView;
