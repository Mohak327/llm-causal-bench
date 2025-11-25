import { ArrowBigRight } from "lucide-react";
import { Theme } from "../../../Theme";
import type { TitledTagCloudProps } from "./TitledTagCloud.interface";

const TitledTagCloud = ({ title, skills }: TitledTagCloudProps) => {
  return (
    <section className="mb-16 border-4 border-black bg-white p-8 relative">
      <div
        style={{ backgroundColor: Theme.colors.yellow[400] }}
        className={`absolute -top-4 left-8 px-4 py-1 border-2 border-black font-bold uppercase transform -rotate-2`}
      >
        {title}
      </div>
      <div className="flex flex-col md:flex-row items-start gap-6 mt-4">
        <div className="flex flex-wrap gap-3 flex-1">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 border-2 border-black font-bold uppercase text-sm hover:bg-black hover:text-white transition-colors cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>
        <a
          href="/skills"
          className={`bg-black text-white px-6 py-3 font-bold uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[${Theme.colors.yellow[400]}] hover:text-black transition-all whitespace-nowrap  md:w-auto text-center flex items-center gap-2`}
        >
          Full Skill Matrix <ArrowBigRight />
        </a>
      </div>
    </section>
  );
};

export default TitledTagCloud;
