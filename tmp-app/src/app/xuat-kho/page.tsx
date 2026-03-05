"use client";

import ExportForm from "@/components/ExportForm";
import RecentTransactions from "@/components/RecentTransactions";
import { useInventory } from "@/lib/useTransactions";

export default function XuatKhoPage() {
    const { addTransaction, deleteTransaction, getRecent, getStock, isLoaded } = useInventory();

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
                <h1 className="page-title">Xuất Kho</h1>
                <p className="page-subtitle">Tạo phiếu xuất kho thép xây dựng</p>
            </div>
            <div className="tx-page-layout">
                <ExportForm onSubmit={addTransaction} getStock={getStock} />
                <RecentTransactions
                    transactions={getRecent("export")}
                    onDelete={deleteTransaction}
                    type="export"
                />
            </div>
        </div>
    );
}
