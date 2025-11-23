import Home from "../pages/Home/Home.controller";
import Skills from "../pages/Skills/Skills.controller";
import ProjectDetail from "../pages/ProjectDetail/ProjectDetail.controller";

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
