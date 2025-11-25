"use client";
import React from "react";
import { getProjectById } from "@/data/projects/projects.model";
import ProjectDetailView from "./ProjectPage.view";

interface ProjectDetailControllerProps {
  id: string;
}

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
