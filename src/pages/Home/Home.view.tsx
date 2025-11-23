import { homeData } from "./Home.model";
import HeroSection from "../../components/Organisms/HeroSection/HeroSection.view";
import TitledTagCloud from "../../components/Organisms/TitledTagCloud/TitledTagCloud.view";
import TitledCardList from "../../components/Organisms/TitledCardList/TitledCardList.view";
import TitledContentBox from "../../components/Organisms/TitledContentBox/TitledContentBox.view";
import SiteFooter from "../../components/Organisms/SiteFooter/SiteFooter.view";
import { ExternalLink, Brain } from "lucide-react";
import Marquee from "../../components/Organisms/Marquee/Marquee.view";

const HomeView = () => {
  return (
    <div
      className={`min-h-screen text-black font-mono selection:bg-black selection:text-white overflow-x-hidden`}
    >
      <Marquee text={homeData.marquee} />

      <main className="container mx-auto px-4 pt-24 pb-20 max-w-6xl">
        <HeroSection
          hero={homeData.hero}
          status={homeData.status}
          meta={homeData.meta}
        />
        <TitledTagCloud
          title={homeData.techArsenal.title}
          skills={homeData.techArsenal.skills}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <TitledCardList
            title={homeData.experience.title}
            items={homeData.experience.jobs}
            renderItem={(job) => (
              <>
                <div
                  style={{ backgroundColor: job.accent }}
                  className={`absolute top-0 right-0 p-2 border-l-4 border-b-4 border-black font-bold`}
                >
                  {job.duration}
                </div>
                <h3 className="text-2xl font-black uppercase mb-1 mt-6">
                  {job.role}
                </h3>
                <div className="text-lg font-bold mb-4 flex items-center gap-2">
                  {job.company}{" "}
                  {job.company.includes("CRIS") && <ExternalLink size={16} />}
                </div>
                <ul className="list-disc list-inside space-y-2 text-sm font-medium">
                  {job.tasks.map((task, i) => (
                    <li key={i}>{task}</li>
                  ))}
                </ul>
              </>
            )}
          />

          <div className="flex flex-col gap-8">
            <TitledCardList
              title={homeData.projects.title}
              items={homeData.projects.items}
              icon={<Brain size={24} />}
              renderItem={(project) => (
                <>
                  <div className="bg-white border-2 border-black inline-block px-3 py-1 font-bold text-xs uppercase mb-4">
                    {project.category}
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-2 leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-sm font-bold mb-4 border-l-4 border-black pl-4">
                    {project.description}
                  </p>
                  <div className="flex gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-black text-white px-2 py-1 text-xs font-bold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            />
            <TitledContentBox
              title={homeData.education.title}
              items={homeData.education.degrees.map((degree) => ({
                heading: degree.university,
                meta: degree.year,
                subHeading: degree.degree,
                body: degree.courses,
                bgColor: degree.bgColor,
              }))}
            />
          </div>
        </div>

        <SiteFooter
          beyondTheCode={homeData.footer.beyondTheCode}
          contact={homeData.footer.contact}
          copyright={homeData.footer.copyright}
        />
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
