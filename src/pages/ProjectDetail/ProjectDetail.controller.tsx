"use client";
import React from "react";
import { getProjectData } from "./ProjectDetail.model";
import ProjectDetailView from "./ProjectDetail.view";

interface ProjectDetailControllerProps {
  id: string;
}

const ProjectDetailController: React.FC<ProjectDetailControllerProps> = ({
  id,
}) => {
  const project = getProjectData(id);

  if (!project) {
    return <div>Project not found.</div>;
  }

  return <ProjectDetailView projectId={id} {...project} />;
};

export default ProjectDetailController;
