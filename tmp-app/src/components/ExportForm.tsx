"use client";

import { useState, type FormEvent } from "react";
import { PackageMinus, AlertTriangle } from "lucide-react";
import { STEEL_PRODUCTS, calcWeight } from "@/lib/steelProducts";
import { formatWeight, formatNumber, todayISO } from "@/lib/utils";
import type { Transaction } from "@/lib/types";

interface ExportFormProps {
    onSubmit: (data: Omit<Transaction, "id" | "weightKg">) => Promise<{ success: boolean; error: string | null }>;
    getStock: (productId: string) => number;
}

export default function ExportForm({ onSubmit, getStock }: ExportFormProps) {
    const [productId, setProductId] = useState(STEEL_PRODUCTS[0].id);
    const [quantity, setQuantity] = useState("");
    const [customer, setCustomer] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [date, setDate] = useState(todayISO);
    const [note, setNote] = useState("");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentStock = getStock(productId);
    const weight = quantity ? calcWeight(productId, Number(quantity)) : 0;
    const isOverStock = quantity ? Number(quantity) > currentStock : false;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!quantity || Number(quantity) <= 0 || isSubmitting) return;

        setIsSubmitting(true);
        setMessage(null);

        const result = await onSubmit({
            type: "export",
            productId,
            quantity: Number(quantity),
            date,
            customer: customer.trim() || undefined,
            invoiceNumber: invoiceNumber.trim() || undefined,
            note: note.trim() || undefined,
        });

        setIsSubmitting(false);

        if (result.success) {
            const product = STEEL_PRODUCTS.find(p => p.id === productId);
            setMessage({ type: "success", text: `Đã xuất ${quantity} cây ${product?.name}` });
            setQuantity("");
            setCustomer("");
            setInvoiceNumber("");
            setNote("");
            setTimeout(() => setMessage(null), 3000);
        } else {
            setMessage({ type: "error", text: result.error ?? "Lỗi không xác định" });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="tx-form">
            <h3 className="tx-form-title">
                <PackageMinus size={20} aria-hidden="true" />
                Phiếu xuất kho
            </h3>

            {message && (
                <div className={`form-message form-message--${message.type}`} role="status" aria-live="polite">
                    {message.text}
                </div>
            )}

            <div className="tx-fields">
                <div className="tx-field">
                    <label className="tx-label" htmlFor="export-product">Loại thép</label>
                    <select
                        id="export-product"
                        name="productId"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        className="tx-input"
                    >
                        {STEEL_PRODUCTS.map((p) => (
                            <option key={p.id} value={p.id}>{p.name} (Φ{p.diameter}mm)</option>
                        ))}
                    </select>
                </div>

                <div className="stock-info-bar">
                    <span>Tồn kho hiện tại:</span>
                    <strong className={currentStock <= 0 ? "text-danger" : ""}>{formatNumber(currentStock)} cây</strong>
                </div>

                <div className="tx-field-row">
                    <div className="tx-field">
                        <label className="tx-label" htmlFor="export-quantity">Số lượng xuất (cây)</label>
                        <input
                            id="export-quantity"
                            name="quantity"
                            type="number"
                            min="1"
                            max={currentStock}
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Nhập số lượng…"
                            className={`tx-input ${isOverStock ? "tx-input--error" : ""}`}
                            required
                        />
                        {isOverStock && (
                            <span className="field-error" role="alert">
                                <AlertTriangle size={14} aria-hidden="true" />
                                Vượt quá tồn kho ({formatNumber(currentStock)} cây)
                            </span>
                        )}
                    </div>
                    <div className="tx-field">
                        <label className="tx-label">Trọng lượng</label>
                        <div className="tx-weight-display">{weight > 0 ? formatWeight(weight) : "—"}</div>
                    </div>
                </div>

                <div className="tx-field-row">
                    <div className="tx-field">
                        <label className="tx-label" htmlFor="export-customer">Khách hàng</label>
                        <input
                            id="export-customer"
                            name="customer"
                            type="text"
                            value={customer}
                            onChange={(e) => setCustomer(e.target.value)}
                            placeholder="Tên khách hàng…"
                            className="tx-input"
                        />
                    </div>
                    <div className="tx-field">
                        <label className="tx-label" htmlFor="export-invoice">Số phiếu xuất</label>
                        <input
                            id="export-invoice"
                            name="invoiceNumber"
                            type="text"
                            value={invoiceNumber}
                            onChange={(e) => setInvoiceNumber(e.target.value)}
                            placeholder="PX-001…"
                            className="tx-input"
                            autoComplete="off"
                        />
                    </div>
                </div>

                <div className="tx-field-row">
                    <div className="tx-field">
                        <label className="tx-label" htmlFor="export-date">Ngày xuất</label>
                        <input
                            id="export-date"
                            name="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="tx-input"
                            required
                        />
                    </div>
                    <div className="tx-field">
                        <label className="tx-label" htmlFor="export-note">Ghi chú</label>
                        <input
                            id="export-note"
                            name="note"
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Thêm ghi chú…"
                            className="tx-input"
                        />
                    </div>
                </div>
            </div>

            <button type="submit" className="tx-submit-btn tx-submit-btn--export" disabled={isOverStock || currentStock <= 0 || isSubmitting}>
                <PackageMinus size={18} aria-hidden="true" />
                {isSubmitting ? "Đang xử lý..." : "Xuất kho"}
            </button>
        </form>
    );
}
