"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PackagePlus, PackageMinus, BarChart3, Settings, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/", label: "Tổng quan", icon: LayoutDashboard },
    { href: "/nhap-kho", label: "Nhập kho", icon: PackagePlus },
    { href: "/xuat-kho", label: "Xuất kho", icon: PackageMinus },
    { href: "/bao-cao", label: "Báo cáo", icon: BarChart3 },
    { href: "/cai-dat", label: "Cài đặt", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <Package size={28} strokeWidth={2.5} aria-hidden="true" />
                    <span>Kho Thép XD</span>
                </div>
            </div>
            <nav className="sidebar-nav" aria-label="Menu chính">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn("sidebar-link", isActive && "active")}
                            aria-current={isActive ? "page" : undefined}
                        >
                            <item.icon size={20} aria-hidden="true" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="sidebar-footer">
                <p>Quản lý Kho Thép v2.0</p>
                <p className="sidebar-footer-sub">© 2026</p>
            </div>
        </aside>
    );
}
