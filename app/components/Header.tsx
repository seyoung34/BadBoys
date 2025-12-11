
import Link from "next/link";
import { Menu, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { AdminPasswordDialog } from "./AdminPasswordDialog";
import { useState } from "react";


export function Header() {

  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">

      <div className="container mx-auto px-5 h-16 flex items-center justify-between">

        <div className="flex items-center gap-4">
          <Link href="/">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl p-0.5 rounded-xs text-slate-900 tracking-tight hover:bg-slate-100">Bad<span className="text-blue-600">boys</span></span>
            </div>
          </Link>
        </div>


        {/* Admin 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setAdminOpen(true)}
          aria-label="Admin"
        >
          <Shield className="h-5 w-5" />
        </Button>

        <AdminPasswordDialog
          open={adminOpen}
          onOpenChange={setAdminOpen}
        />

      </div>
    </header>
  );
}
