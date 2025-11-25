import ProjectDetailController from "@/pages/ProjectPage/ProjectPage.controller";
import { use } from "react";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  return <ProjectDetailController id={resolvedParams.id} />;
};

export default Page;
