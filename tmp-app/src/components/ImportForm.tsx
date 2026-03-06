"use client";

import { useState, type FormEvent } from "react";
import { PackagePlus } from "lucide-react";
import { STEEL_PRODUCTS, calcWeight } from "@/lib/steelProducts";
import { formatWeight, todayISO } from "@/lib/utils";
import type { Transaction } from "@/lib/types";

interface ImportFormProps {
    onSubmit: (data: Omit<Transaction, "id" | "weightKg">) => Promise<{ success: boolean; error: string | null }>;
}

export default function ImportForm({ onSubmit }: ImportFormProps) {
    const [productId, setProductId] = useState(STEEL_PRODUCTS[0].id);
    const [quantity, setQuantity] = useState("");
    const [supplier, setSupplier] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [date, setDate] = useState(todayISO);
    const [note, setNote] = useState("");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const weight = quantity ? calcWeight(productId, Number(quantity)) : 0;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!quantity || Number(quantity) <= 0 || isSubmitting) return;

        setIsSubmitting(true);
        setMessage(null);

        const result = await onSubmit({
            type: "import",
            productId,
            quantity: Number(quantity),
            date,
            supplier: supplier.trim() || undefined,
            invoiceNumber: invoiceNumber.trim() || undefined,
            note: note.trim() || undefined,
        });

        setIsSubmitting(false);

        if (result.success) {
            setMessage({ type: "success", text: `Đã nhập ${quantity} cây ${STEEL_PRODUCTS.find(p => p.id === productId)?.name}` });
            setQuantity("");
            setSupplier("");
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
                <PackagePlus size={20} aria-hidden="true" />
                Phiếu nhập kho
            </h3>

            {message && (
                <div className={`form-message form-message--${message.type}`} role="status" aria-live="polite">
                    {message.text}
                </div>
            )}

            <div className="tx-fields">
                <div className="tx-field">
                    <label className="tx-label" htmlFor="import-product">Loại thép</label>
                    <select
                        id="import-product"
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

                <div className="tx-field-row">
                    <div className="tx-field">
                        <label className="tx-label" htmlFor="import-quantity">Số lượng (cây)</label>
                        <input
                            id="import-quantity"
                            name="quantity"
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Nhập số lượng…"
                            className="tx-input"
                            required
                        />
                    </div>
                    <div className="tx-field">
                        <label className="tx-label">Trọng lượng</label>
                        <div className="tx-weight-display">{weight > 0 ? formatWeight(weight) : "—"}</div>
                    </div>
                </div>

                <div className="tx-field-row">
                    <div className="tx-field">
                        <label className="tx-label" htmlFor="import-supplier">Nhà cung cấp</label>
                        <input
                            id="import-supplier"
                            name="supplier"
                            type="text"
                            value={supplier}
                            onChange={(e) => setSupplier(e.target.value)}
                            placeholder="Tên nhà cung cấp…"
                            className="tx-input"
                        />
                    </div>
                    <div className="tx-field">
                        <label className="tx-label" htmlFor="import-invoice">Số phiếu nhập</label>
                        <input
                            id="import-invoice"
                            name="invoiceNumber"
                            type="text"
                            value={invoiceNumber}
                            onChange={(e) => setInvoiceNumber(e.target.value)}
                            placeholder="PN-001…"
                            className="tx-input"
                            autoComplete="off"
                        />
                    </div>
                </div>

                <div className="tx-field-row">
                    <div className="tx-field">
                        <label className="tx-label" htmlFor="import-date">Ngày nhập</label>
                        <input
                            id="import-date"
                            name="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="tx-input"
                            required
                        />
                    </div>
                    <div className="tx-field">
                        <label className="tx-label" htmlFor="import-note">Ghi chú</label>
                        <input
                            id="import-note"
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

            <button type="submit" className="tx-submit-btn tx-submit-btn--import" disabled={isSubmitting}>
                <PackagePlus size={18} aria-hidden="true" />
                {isSubmitting ? "Đang xử lý..." : "Nhập kho"}
            </button>
        </form>
    );
}
