
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">

      <div className="container mx-auto px-5 h-16 flex items-center justify-between">

        <div className="flex items-center gap-4">
          {onMenuClick && (
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
              <Menu className="h-5 w-5 text-slate-700" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            {/* <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm shadow-blue-200">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div> */}
            <span className="font-bold text-xl text-slate-900 tracking-tight">Bad<span className="text-blue-600">boys</span></span>
          </div>
        </div>

        {/* <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" className="text-slate-600 hover:text-blue-600 font-medium hidden md:flex">Comparison</Button>
          <Button variant="ghost" className="text-slate-600 hover:text-blue-600 font-medium hidden md:flex">Community</Button>
          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
          <Button variant="ghost" className="text-slate-600 hover:text-blue-600 font-medium">Sign In</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200">Join Free</Button>
        </div> */}

      </div>
    </header>
  );
}
