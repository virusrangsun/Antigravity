"use client";

import { AlertTriangle, XCircle } from "lucide-react";
import { STEEL_PRODUCTS } from "@/lib/steelProducts";
import { StockLevel } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface LowStockAlertsProps {
    lowStockProducts: StockLevel[];
}

export default function LowStockAlerts({ lowStockProducts }: LowStockAlertsProps) {
    if (lowStockProducts.length === 0) {
        return (
            <div className="alerts-empty">
                <span className="alerts-empty-icon" aria-hidden="true">✓</span>
                <p>Tất cả sản phẩm đều đủ tồn kho</p>
            </div>
        );
    }

    return (
        <div className="alerts-container">
            <h3 className="alerts-title">
                <AlertTriangle size={18} aria-hidden="true" />
                Cảnh báo tồn kho ({lowStockProducts.length})
            </h3>
            <div className="alerts-list">
                {lowStockProducts.map((item) => {
                    const product = STEEL_PRODUCTS.find((p) => p.id === item.productId);
                    if (!product) return null;
                    const isOut = item.currentStock <= 0;

                    return (
                        <div key={item.productId} className={`alert-item ${isOut ? "alert-item--out" : "alert-item--low"}`}>
                            <div className="alert-item-icon" aria-hidden="true">
                                {isOut ? <XCircle size={18} /> : <AlertTriangle size={18} />}
                            </div>
                            <div className="alert-item-info">
                                <span className="alert-item-name">{product.name}</span>
                                <span className="alert-item-detail">
                                    Tồn: {formatNumber(item.currentStock)} / Tối thiểu: {formatNumber(item.minStock)}
                                </span>
                            </div>
                            <span className={`alert-tag ${isOut ? "alert-tag--out" : "alert-tag--low"}`}>
                                {isOut ? "Hết hàng" : "Sắp hết"}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
