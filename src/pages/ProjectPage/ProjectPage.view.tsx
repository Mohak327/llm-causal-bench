"use client";
import { ProjectInterface } from "@/data/projects/projects.interface";
import React from "react";
import ContentRenderer from "../../components/Organisms/ContentRenderer/ContentRenderer.view";

const ProjectDetailView: React.FC<ProjectInterface> = ({
  id,
  accentColor,
  title,
  sections,
  tags,
}) => {
  if (!id) {
    return <div>Project not found.</div>;
  }


  return (
    <div className="min-h-screen bg-white">
      <div
        style={{ backgroundColor: accentColor }}
        className={`h-64 border-b-4 border-black relative overflow-hidden`}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)",
            backgroundSize: "20px 20px",
          }}
        ></div>
        <div className="container mx-auto h-full flex items-end p-4 md:p-8 relative z-10">
          <h1 className="text-4xl md:text-6xl font-black uppercase bg-white border-4 border-black px-4 py-2 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex gap-2 container mx-auto px-4 py-12 max-w-4xl gap-8">
        <div className="flex-1">
          <ContentRenderer sections={sections} />
        </div>
        <div className="max-w-[240px] w-full">
          <div className="border-4 border-black p-6 bg-[#f0f0f0]">
            <h3 className="font-black uppercase mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 border-2 border-black bg-white font-bold text-xs uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="border-4 border-black p-6 bg-black text-white">
            <h3 className="font-black uppercase mb-4">Role</h3>
            <p className="font-bold">Researcher / Engineer</p>
            <div className="mt-4 pt-4 border-t-2 border-white/30 text-sm opacity-80">
              Focus: Simulation & Analysis
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailView;
