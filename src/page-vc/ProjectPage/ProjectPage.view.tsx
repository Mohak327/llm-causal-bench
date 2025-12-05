"use client";
import { ProjectInterface } from "@/page-data/projects/projects.interface";
import React from "react";
import ContentRenderer from "../../components/Organisms/ContentRenderer/ContentRenderer.view";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { GrTechnology } from "react-icons/gr";
import { RiFocus3Line } from "react-icons/ri";

const ProjectDetailView: React.FC<ProjectInterface> = ({
  id,
  accentColor,
  title,
  subtitle,
  sections,
  tags,
  role,
  focus,
  github,
}) => {
  if (!id) {
    return <div>Project not found.</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div
        style={{ backgroundColor: accentColor }}
        className={`border-b-4 border-black relative overflow-hidden`}
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
          <div className="bg-white border-4 border-black p-4 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl md:text-5xl font-black uppercase">
              {title}
            </h1>
            {/* <h2 className="text-2xl md:text-4xl font-black">
              {subtitle}
            </h2> */}
          </div>
        </div>
      </div>

      <div className="flex gap-2 container mx-auto px-4 py-12 max-w-4xl gap-8">
        <div className="flex-1">
          <ContentRenderer sections={sections} />
        </div>
        <div className="max-w-[240px] w-full">
          {github && (
            <div className="border-4 border-black p-6 bg-black text-white">
              <h3 className="flex items-center gap-2 font-black uppercase mb-4 text-lg">
                <FaGithub /> Github
              </h3>

              <Link
                href={github.toString()}
                className="font-bold underline transition-all break-all hover:text-[var(--accent-color)]"
                style={{ "--accent-color": accentColor } as React.CSSProperties}
              >
                {" "}
                {github.toString()}{" "}
              </Link>
            </div>
          )}

          <div className="border-4 border-black p-6 bg-[#f0f0f0]">
            <h3 className=" flex items-center gap-2 font-black uppercase mb-4">
              <GrTechnology />
              Tech Stack
            </h3>
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

          {(focus || role) && (
            <div className="border-4 border-black p-6 bg-black text-white">
              {focus && (
                <>
                  <h3 className="flex items-center gap-2 font-black uppercase mb-4">
                    <RiFocus3Line /> Focus
                  </h3>
                  <p className="font-bold">{focus}</p>
                </>
              )}
              {role && (
                <div className="mt-4 pt-4 border-t-2 border-white/30 text-sm opacity-80">
                  Role: {role}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailView;
