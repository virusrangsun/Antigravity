"use client";

import { Trash2, PackagePlus, PackageMinus } from "lucide-react";
import { Transaction } from "@/lib/types";
import { STEEL_PRODUCTS } from "@/lib/steelProducts";
import { formatDate, formatNumber, formatWeight } from "@/lib/utils";
import { useState } from "react";

interface RecentTransactionsProps {
    transactions: Transaction[];
    onDelete: (id: string) => void;
    type: "import" | "export";
}

export default function RecentTransactions({ transactions, onDelete, type }: RecentTransactionsProps) {
    const [confirmId, setConfirmId] = useState<string | null>(null);

    if (transactions.length === 0) {
        return (
            <div className="tx-list-empty">
                {type === "import" ? (
                    <PackagePlus size={48} strokeWidth={1} aria-hidden="true" />
                ) : (
                    <PackageMinus size={48} strokeWidth={1} aria-hidden="true" />
                )}
                <p>Chưa có giao dịch {type === "import" ? "nhập" : "xuất"} nào</p>
                <p className="tx-list-empty-sub">
                    {type === "import" ? "Hãy tạo phiếu nhập kho đầu tiên!" : "Hãy tạo phiếu xuất kho đầu tiên!"}
                </p>
            </div>
        );
    }

    const handleDelete = (id: string) => {
        if (confirmId === id) {
            onDelete(id);
            setConfirmId(null);
        } else {
            setConfirmId(id);
            setTimeout(() => setConfirmId(null), 3000);
        }
    };

    return (
        <div className="tx-list-container">
            <h3 className="tx-list-title">
                {type === "import" ? "Phiếu nhập gần đây" : "Phiếu xuất gần đây"}
                <span className="tx-list-count">{transactions.length}</span>
            </h3>
            <div className="tx-table-wrapper">
                <table className="tx-table">
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Trọng lượng</th>
                            <th>{type === "import" ? "NCC" : "Khách hàng"}</th>
                            <th>Số phiếu</th>
                            <th>Ngày</th>
                            <th>Ghi chú</th>
                            <th><span className="sr-only">Hành động</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => {
                            const product = STEEL_PRODUCTS.find((p) => p.id === tx.productId);
                            return (
                                <tr key={tx.id} className="tx-row">
                                    <td className="tx-product-name">{product?.name ?? tx.productId}</td>
                                    <td className="tx-quantity">{formatNumber(tx.quantity)} cây</td>
                                    <td className="tx-quantity">{tx.weightKg ? formatWeight(tx.weightKg) : "—"}</td>
                                    <td>{(type === "import" ? tx.supplier : tx.customer) || "—"}</td>
                                    <td className="tx-invoice">{tx.invoiceNumber || "—"}</td>
                                    <td className="tx-date">{formatDate(tx.date)}</td>
                                    <td className="tx-note">{tx.note || "—"}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(tx.id)}
                                            className={`tx-delete-btn ${confirmId === tx.id ? "tx-delete-btn--confirm" : ""}`}
                                            aria-label={confirmId === tx.id ? "Xác nhận xóa" : `Xóa phiếu ${tx.invoiceNumber || tx.id}`}
                                        >
                                            <Trash2 size={16} aria-hidden="true" />
                                            {confirmId === tx.id && <span className="delete-confirm-text">Xác nhận?</span>}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
