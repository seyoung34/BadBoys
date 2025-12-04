// app/admin/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../components/ui/utils";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const menu = [
        { name: "대시보드", href: "/admin" },
        { name: "라켓 관리", href: "/admin/rackets" },
    ];

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col gap-4">
                <h1 className="text-xl font-bold mb-6">ADMIN</h1>

                {menu.map((m) => (
                    <Link
                        key={m.href}
                        href={m.href}
                        className={cn(
                            "px-3 py-2 rounded-md text-sm",
                            pathname.startsWith(m.href)
                                ? "bg-slate-700"
                                : "text-slate-300 hover:bg-slate-800"
                        )}
                    >
                        {m.name}
                    </Link>
                ))}
            </aside>

            {/* Main area */}
            <main className="flex-1 p-10 bg-slate-50 min-h-screen">{children}</main>
        </div>
    );
}
