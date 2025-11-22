import React from 'react';

const Skills = () => {
  const skillCategories = [
    {
      category: "Artificial Intelligence",
      color: "bg-[#c084fc]", // Cosmic Purple
      elements: [
        { symbol: "Pt", name: "PyTorch", num: 1 },
        { symbol: "Gpt", name: "ChatGPT", num: 2 },
        { symbol: "Cld", name: "Claude", num: 3 },
        { symbol: "Gem", name: "Gemini", num: 4 },
        { symbol: "Cau", name: "CausalML", num: 5 }, // [cite: 53]
        { symbol: "Of", name: "OpenFold", num: 6 }, // [cite: 53]
      ]
    },
    {
      category: "Full Stack Eng",
      color: "bg-[#facc15]", // Tech Yellow
      elements: [
        { symbol: "Ts", name: "TypeScript", num: 7 }, // [cite: 49]
        { symbol: "Re", name: "React 19", num: 8 },
        { symbol: "Nx", name: "Next.js", num: 9 },
        { symbol: "Gql", name: "GraphQL", num: 10 }, // [cite: 50]
        { symbol: "No", name: "Node.js", num: 11 },
        { symbol: "Py", name: "Python", num: 12 },
      ]
    },
    {
      category: "DevOps & Cloud",
      color: "bg-[#ff90e8]", // Neuro Pink
      elements: [
        { symbol: "Aws", name: "AWS", num: 13 }, // [cite: 52]
        { symbol: "Lam", name: "Lambda", num: 14 },
        { symbol: "Ec2", name: "EC2", num: 15 },
        { symbol: "Dkr", name: "Docker", num: 16 },
        { symbol: "Jen", name: "Jenkins", num: 17 },
        { symbol: "Rds", name: "RDS", num: 18 },
      ]
    },
    {
      category: "Data & Science",
      color: "bg-[#4ade80]", // Bio Green
      elements: [
        { symbol: "Chi", name: "ChimeraX", num: 19 }, // [cite: 53]
        { symbol: "Bri", name: "Brian2", num: 20 }, // [cite: 53]
        { symbol: "El", name: "Elastic", num: 21 }, // [cite: 50]
        { symbol: "Sql", name: "SQL", num: 22 },
        { symbol: "Mon", name: "MongoDB", num: 23 },
        { symbol: "Red", name: "Redis", num: 24 },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f0f0f0] p-4 lg:p-12 pb-24">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 border-b-4 border-black pb-6">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4">
            Skill<br/>Matrix
          </h1>
          <p className="text-xl font-bold max-w-2xl">
            The elemental composition of my technical capabilities. Organized by domain affinity.
          </p>
        </header>

        <div className="space-y-16">
          {skillCategories.map((cat, idx) => (
            <div key={idx}>
              <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-4">
                <span className={`w-6 h-6 border-2 border-black ${cat.color}`}></span>
                {cat.category}
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {cat.elements.map((el) => (
                  <div key={el.name} className={`aspect-square border-4 border-black bg-white relative p-2 flex flex-col justify-between hover:-translate-y-2 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group cursor-default`}>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold opacity-50">{el.num}</span>
                      <div className={`w-3 h-3 rounded-full border border-black ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                    </div>
                    <div className="text-center">
                      <span className="block text-3xl md:text-4xl font-black tracking-tighter">{el.symbol}</span>
                      <span className="text-xs font-bold uppercase mt-1 block truncate">{el.name}</span>
                    </div>
                    <div className="text-[10px] font-mono opacity-40 uppercase text-right">
                      {cat.category.split(' ')[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 border-4 border-black bg-white p-8 text-center">
           <h3 className="text-2xl font-black uppercase mb-4">Ready to synthesize?</h3>
           <p className="font-bold mb-6">Combining these elements to build resilient, complex systems.</p>
           <a href="mailto:ms7306@columbia.edu" className="inline-block bg-black text-white px-8 py-4 font-bold uppercase text-lg hover:bg-[#facc15] hover:text-black transition-colors border-2 border-transparent hover:border-black">
             Initiate Collaboration
           </a>
        </div>
      </div>
    </div>
  );
};

export default Skills;