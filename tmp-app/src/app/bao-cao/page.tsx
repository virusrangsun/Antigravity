"use client";

import MonthlyReport from "@/components/MonthlyReport";
import { useInventory } from "@/lib/useTransactions";

export default function BaoCaoPage() {
    const { getMonthlyReport, isLoaded } = useInventory();

    if (!isLoaded) {
        return (
            <div className="page-loading">
                <div className="spinner" />
                <p>Đang tải dữ liệu…</p>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">Báo Cáo</h1>
                <p className="page-subtitle">Thống kê xuất nhập kho theo tháng</p>
            </div>
            <MonthlyReport getMonthlyReport={getMonthlyReport} />
        </div>
    );
}
