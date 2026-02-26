import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl font-black text-slate-100 select-none">404</div>
      <h1 className="text-2xl font-bold text-slate-800 mt-4">Page not found</h1>
      <p className="text-slate-500 text-sm mt-2">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6">
        <Home className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </div>
  );
}
