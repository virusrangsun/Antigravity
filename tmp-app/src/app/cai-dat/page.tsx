"use client";

import StockSettingsComponent from "@/components/StockSettings";
import { useInventory } from "@/lib/useTransactions";

export default function CaiDatPage() {
    const { stockLevels, updateMinStock, isLoaded } = useInventory();

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
                <h1 className="page-title">Cài Đặt</h1>
                <p className="page-subtitle">Thiết lập cảnh báo tồn kho</p>
            </div>
            <StockSettingsComponent
                stockLevels={stockLevels}
                onUpdateMinStock={updateMinStock}
            />
        </div>
    );
}
