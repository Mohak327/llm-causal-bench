import Home from "../sections/Home/Home.controller";
import Skills from "../sections/Skills/Skills.controller";
import ProjectDetail from "../sections/ProjectDetail/ProjectDetail.controller";

interface RouteInterface {
    path: string;
    element: React.ComponentType;
}

export const routes: RouteInterface[] = [
    {
        path: "/",
        element: Home,
    },
    {
        path: "/skills",
        element: Skills,
    },
    {
        path: "/project/:id",
        element: ProjectDetail,
    }
];
