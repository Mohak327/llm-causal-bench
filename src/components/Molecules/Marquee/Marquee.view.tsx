import { Theme } from "../../../Theme";
import type { MarqueeProps } from "./Marquee.interface";

const Marquee = ({ text }: MarqueeProps) => {
    return (
        <div style={{ backgroundColor: Theme.colors.yellow[400] }} className={`fixed top-0 w-full z-50 border-b-4 border-black overflow-hidden whitespace-nowrap py-2`}>
            <div className="animate-marquee inline-block">
                <span className="mx-4 text-lg font-bold uppercase tracking-tighter">{text}</span>
                <span className="mx-4 text-lg font-bold uppercase tracking-tighter">{text}</span>
            </div>
        </div>
    );
};

export default Marquee;
