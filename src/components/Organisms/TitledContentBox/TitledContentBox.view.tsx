import { Activity } from 'lucide-react';
import type { TitledContentBoxProps } from './TitledContentBox.interface';

const TitledContentBox = ({ title, items, icon }: TitledContentBoxProps) => {
    return (
        <>
            <div className="flex items-center gap-4 mb-2 mt-8">
                <div className="bg-black text-white p-2 border-2 border-black">{icon || <Activity size={24} />}</div>
                <h2 className="text-4xl font-black uppercase">{title}</h2>
            </div>
            <div className="border-4 border-black p-0">
                {items.map((item, index) => (
                    <div 
                        key={index} 
                        className={`p-6 ${index !== items.length - 1 ? 'border-b-4 border-black' : ''}`}
                        style={{ backgroundColor: item.bgColor ? item.bgColor : 'white' }}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-black uppercase">{item.heading}</h3>
                            <span className={`font-bold ${index === 0 ? 'bg-black text-white' : 'bg-white border-2 border-black'} px-2`}>
                                {item.meta}
                            </span>
                        </div>
                        <div className="font-bold text-sm mb-2">{item.subHeading}</div>
                        <p className="text-xs leading-relaxed border-l-2 border-black pl-2">{item.body}</p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default TitledContentBox;
