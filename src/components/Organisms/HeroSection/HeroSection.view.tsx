import { Mail } from 'lucide-react';
import { Theme } from '../../../Theme';
import React from 'react';

interface HeaderProps {
    hero: {
        title: string[];
        subtitle: {
            prefix: string;
            highlight1: string;
            and: string;
            highlight2: string;
        };
        contact: string;
    };
    status: {
        title: string;
        lines: { text: string; color: string }[];
    };
    meta: { label: string; value: string }[];
}

const HeroSection = ({ hero, status, meta }: HeaderProps) => {
    return (
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
                    {hero.title[0]}<br />{hero.title[1]}
                </h1>
                <p className="text-xl lg:text-2xl font-bold mb-8 max-w-2xl">
                    {hero.subtitle.prefix}{" "}
                    <span style={{ backgroundColor: Theme.colors.pink[400] }} className={`px-1 border border-black`}>{hero.subtitle.highlight1}</span>{" "}
                    {hero.subtitle.and}{" "}
                    <span style={{ backgroundColor: Theme.colors.purple[400] }} className={`px-1 border border-black`}>{hero.subtitle.highlight2}</span>.
                </p>
                <div className="flex flex-wrap gap-4">
                    <a href="mailto:ms7306@columbia.edu" className={`flex items-center gap-2 px-6 py-3 border-2 border-black font-bold uppercase bg-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]`}>
                        <Mail size={20} /> {hero.contact}
                    </a>
                </div>
            </div>
            <div className="lg:col-span-4 bg-black text-white p-8 flex flex-col justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-4 border-b-2 border-white pb-2">{status.title}</h2>
                    <p className="mb-6 text-lg">
                        {status.lines.map((line, index) => (
                            <React.Fragment key={index}>
                                <span className={line.color}>●</span> {line.text}<br />
                            </React.Fragment>
                        ))}
                    </p>
                </div>
                <div>
                    {meta.map((item, index) => (
                        <div key={index} className={`border-2 border-white p-4 mb-4 ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 transition-transform`}>
                            <span className="block text-xs uppercase opacity-70">{item.label}</span>
                            <span className="text-xl font-bold">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default HeroSection;
