"use client";
import React from "react";
import { projects } from "@/page-data/projects/projects.model";
import ProjectDetailView from "./ProjectPage.view";
import { ProjectInterface } from "@/page-data/projects/projects.interface";

interface ProjectDetailControllerProps {
  id: string;
}

 const getProjectById = (id: string): ProjectInterface | undefined => {
  return projects.find((p) => p.id === id);
};

const ProjectDetailController: React.FC<ProjectDetailControllerProps> = ({
  id,
}) => {
  const project = getProjectById(id);

  if (!project) {
    return <div>Project not found.</div>;
  }

  return <ProjectDetailView {...project} />;
};

export default ProjectDetailController;
