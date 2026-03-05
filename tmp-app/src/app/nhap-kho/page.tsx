"use client";

import ImportForm from "@/components/ImportForm";
import RecentTransactions from "@/components/RecentTransactions";
import { useInventory } from "@/lib/useTransactions";

export default function NhapKhoPage() {
    const { addTransaction, deleteTransaction, getRecent, isLoaded } = useInventory();

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
                <h1 className="page-title">Nhập Kho</h1>
                <p className="page-subtitle">Tạo phiếu nhập kho thép xây dựng</p>
            </div>
            <div className="tx-page-layout">
                <ImportForm onSubmit={addTransaction} />
                <RecentTransactions
                    transactions={getRecent("import")}
                    onDelete={deleteTransaction}
                    type="import"
                />
            </div>
        </div>
    );
}
