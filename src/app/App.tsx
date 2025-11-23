import React from "react";
import {
  BrowserRouter as Router,
  Link,
  useLocation,
} from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EnergyFieldController from "../components/EnergyFieldBackground/EnergyField.controller";
import AppRoutes from "../routes/routes.view";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen font-mono selection:bg-black selection:text-white relative">
      <EnergyFieldController />

      {!isHome && (
        <nav className="bg-[#facc15] border-b-4 border-black p-4 sticky top-0 z-50 flex justify-between items-center relative">
           <Link to="/" className="flex items-center gap-2 font-bold uppercase border-2 border-black bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
             <ArrowLeft size={16} /> Back to HQ
           </Link>
           <span className="font-black uppercase text-lg tracking-tighter hidden md:block">Mohak Sharma / Skills</span>
        </nav>
      )}

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};


const App = () => {
  return (
    <Router>
      <Layout>
        <AppRoutes />
      </Layout>
    </Router>
  );
};

export default App;
