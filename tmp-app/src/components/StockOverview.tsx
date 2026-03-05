"use client";

import { STEEL_PRODUCTS } from "@/lib/steelProducts";
import { StockLevel } from "@/lib/types";
import { formatNumber, getStockStatus } from "@/lib/utils";

interface StockOverviewProps {
    stockLevels: StockLevel[];
}

export default function StockOverview({ stockLevels }: StockOverviewProps) {
    return (
        <div className="stock-grid">
            {STEEL_PRODUCTS.map((product) => {
                const level = stockLevels.find((s) => s.productId === product.id);
                const current = level?.currentStock ?? 0;
                const min = level?.minStock ?? 50;
                const status = getStockStatus(current, min);
                const percent = min > 0 ? Math.min((current / min) * 100, 100) : 100;

                return (
                    <div key={product.id} className={`stock-card stock-card--${status}`}>
                        <div className="stock-card-header">
                            <span className="stock-card-phi">{product.name}</span>
                            <span className={`stock-badge stock-badge--${status}`}>
                                {status === "ok" && "Đủ hàng"}
                                {status === "low" && "Sắp hết"}
                                {status === "out" && "Hết hàng"}
                            </span>
                        </div>
                        <div className="stock-card-value">
                            <span className="stock-card-number">{formatNumber(current)}</span>
                            <span className="stock-card-unit">{product.unit}</span>
                        </div>
                        <div className="stock-bar-track">
                            <div
                                className={`stock-bar-fill stock-bar-fill--${status}`}
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                        <div className="stock-card-footer">
                            <span>Tối thiểu: {formatNumber(min)}</span>
                            <span>Φ{product.diameter}mm · {product.weightPerMeter} kg/m</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
