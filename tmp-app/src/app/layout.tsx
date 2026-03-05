import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Quản lý Kho Thép XD | Steel Inventory",
  description: "Hệ thống quản lý kho thép xây dựng — Theo dõi nhập xuất kho, cảnh báo tồn kho, báo cáo tháng",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" style={{ colorScheme: "dark" }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0a0e1a" />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Bỏ qua đến nội dung chính
        </a>
        <div className="app-layout">
          <Sidebar />
          <main id="main-content" className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
