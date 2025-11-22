import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
// import ProjectDetail from './ProjectDetail';
import { ArrowLeft } from 'lucide-react';
import Home from './sections/Home/Home.controller';
import Skills from './sections/Skills/Skills.controller';
import ProjectDetail from './sections/ProjectDetail/ProjectDetail.controller';

// Navigation Wrapper to show "Back" button on inner pages
const Layout = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen font-mono selection:bg-black selection:text-white">
      {!isHome && (
        <nav className="bg-[#facc15] border-b-4 border-black p-4 sticky top-0 z-50 flex justify-between items-center">
           <Link to="/" className="flex items-center gap-2 font-bold uppercase border-2 border-black bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
             <ArrowLeft size={16} /> Back to HQ
           </Link>
           <span className="font-black uppercase text-lg tracking-tighter">Mohak Sharma / Systems</span>
        </nav>
      )}
      {children}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;