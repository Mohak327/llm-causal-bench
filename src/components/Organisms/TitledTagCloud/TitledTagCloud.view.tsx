import { Theme } from "../../../Theme";
import type { TitledTagCloudProps } from "./TitledTagCloud.interface";

const TitledTagCloud = ({ title, skills }: TitledTagCloudProps) => {
    return (
        <section className="mb-16 border-4 border-black bg-white p-8 relative">
            <div style={{ backgroundColor: Theme.colors.yellow[400] }} className={`absolute -top-4 left-8 px-4 py-1 border-2 border-black font-bold uppercase transform -rotate-2`}>
                {title}
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
                {skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 border-2 border-black font-bold uppercase text-sm hover:bg-black hover:text-white transition-colors cursor-default">
                        {skill}
                    </span>
                ))}
            </div>
        </section>
    );
};

export default TitledTagCloud;
