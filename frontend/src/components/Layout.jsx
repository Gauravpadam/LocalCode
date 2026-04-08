import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

/**
 * Layout component with slate background and new theme
 * Wraps all pages with consistent navigation and footer
 */
function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Navbar />
      
      <main className="flex-1 bg-base-100">
        <Outlet />
      </main>
      
     <footer className="bg-slate-850 border-t border-slate-700 text-slate-400 py-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
      
      <p className="text-sm">
        Built in the open.
      </p>

      <nav className="text-sm flex justify-center gap-3">
        <a href="https://github.com/Gauravpadam/Localcode" className="hover:text-slate-200 transition">Contribute</a>
        <span>•</span>
        <a href="https://github.com/Gauravpadam/Localcode/issues" className="hover:text-slate-200 transition">Issues</a>
        <span>•</span>
        <a href="#" className="hover:text-slate-200 transition">Discussions (soon)</a>
      </nav>

    </div>
  </footer>
 
    </div>
  );
}

export default Layout;
