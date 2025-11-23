import type { SiteFooterProps } from "./SiteFooter.interface";

const SiteFooter = ({ beyondTheCode, contact, copyright }: SiteFooterProps) => {
    return (
        <footer className="mt-20 border-t-4 border-black pt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className={`col-span-2 border-4 border-black p-8 bg-white relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                    <div className="absolute -top-5 left-4 bg-black text-white px-4 py-1 font-bold uppercase rotate-1">
                        {beyondTheCode.title}
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight border-b-2 border-black pb-2 mb-4">{beyondTheCode.subtitle}</h3>
                    {beyondTheCode.sections.map((section, index) => (
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
                    <h4 className="font-black uppercase text-xl">{contact.title}</h4>
                    {contact.links.map((link, index) => (
                        <a key={index} href={link.href} className={`text-lg font-bold ${link.hoverClass} transition-all border-b-2 border-black`}>
                            {link.text}
                        </a>
                    ))}
                </div>
            </div>
            <div className="text-center mt-12 font-bold uppercase text-sm opacity-50">
                {copyright}
            </div>
        </footer>
    );
};

export default SiteFooter;
