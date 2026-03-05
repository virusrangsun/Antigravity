"use client";

import { Save } from "lucide-react";
import { STEEL_PRODUCTS } from "@/lib/steelProducts";
import { StockLevel } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { useState } from "react";

interface StockSettingsProps {
    stockLevels: StockLevel[];
    onUpdateMinStock: (productId: string, min: number) => void;
}

export default function StockSettings({ stockLevels, onUpdateMinStock }: StockSettingsProps) {
    const [saved, setSaved] = useState<string | null>(null);

    const handleSave = (productId: string, value: string) => {
        const num = parseInt(value, 10);
        if (!isNaN(num) && num >= 0) {
            onUpdateMinStock(productId, num);
            setSaved(productId);
            setTimeout(() => setSaved(null), 2000);
        }
    };

    return (
        <div className="settings-container">
            <h2 className="settings-title">Cài đặt mức tồn kho tối thiểu</h2>
            <p className="settings-desc">
                Thiết lập số lượng tối thiểu cho từng loại thép. Hệ thống sẽ cảnh báo khi tồn kho giảm xuống dưới mức này.
            </p>

            <div className="settings-grid">
                {STEEL_PRODUCTS.map((product) => {
                    const level = stockLevels.find((s) => s.productId === product.id);
                    const currentMin = level?.minStock ?? 50;
                    const currentStock = level?.currentStock ?? 0;

                    return (
                        <div key={product.id} className="settings-card">
                            <div className="settings-card-header">
                                <span className="settings-card-name">{product.name}</span>
                                <span className="settings-card-info">Φ{product.diameter}mm · {product.weightPerMeter} kg/m</span>
                            </div>
                            <div className="settings-card-stock">
                                Tồn kho: <strong>{formatNumber(currentStock)}</strong> cây
                            </div>
                            <div className="settings-card-input">
                                <label htmlFor={`min-${product.id}`} className="tx-label">Mức tối thiểu (cây)</label>
                                <div className="settings-input-row">
                                    <input
                                        id={`min-${product.id}`}
                                        name={`min_${product.id}`}
                                        type="number"
                                        min="0"
                                        defaultValue={currentMin}
                                        className="tx-input"
                                        onBlur={(e) => handleSave(product.id, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleSave(product.id, (e.target as HTMLInputElement).value);
                                            }
                                        }}
                                    />
                                    {saved === product.id && (
                                        <span className="settings-saved" role="status" aria-live="polite">
                                            <Save size={14} aria-hidden="true" /> Đã lưu
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
