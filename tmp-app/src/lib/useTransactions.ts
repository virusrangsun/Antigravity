"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { collection, onSnapshot, addDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Transaction, StockLevel, StockSettings, MonthlyRow } from "./types";
import { STEEL_PRODUCTS, DEFAULT_MIN_STOCK, calcWeight } from "./steelProducts";

export function useInventory() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [stockSettings, setStockSettings] = useState<StockSettings>({});
    const [isLoaded, setIsLoaded] = useState(false);

    // Load transactions from Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "transactions"), (snapshot) => {
            const txs: Transaction[] = [];
            snapshot.forEach((doc) => {
                txs.push({ id: doc.id, ...doc.data() } as Transaction);
            });
            // Sort by date descending
            txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setTransactions(txs);
            setIsLoaded(true);
        }, (error) => {
            console.error("Error fetching transactions:", error);
            setIsLoaded(true); // Prevent infinite loading state on error
        });

        return () => unsubscribe();
    }, []);

    // Load settings from Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "settings"), (snapshot) => {
            const settings: StockSettings = {};
            snapshot.forEach((doc) => {
                settings[doc.id] = doc.data().minStock;
            });
            setStockSettings(settings);
        }, (error) => {
            console.error("Error fetching settings:", error);
        });

        return () => unsubscribe();
    }, []);

    // Compute stock levels
    const stockLevels: StockLevel[] = useMemo(() => {
        const map = new Map<string, number>();
        STEEL_PRODUCTS.forEach((p) => map.set(p.id, 0));

        transactions.forEach((tx) => {
            const current = map.get(tx.productId) ?? 0;
            if (tx.type === "import") {
                map.set(tx.productId, current + tx.quantity);
            } else {
                map.set(tx.productId, current - tx.quantity);
            }
        });

        return STEEL_PRODUCTS.map((p) => ({
            productId: p.id,
            currentStock: map.get(p.id) ?? 0,
            minStock: stockSettings[p.id] ?? DEFAULT_MIN_STOCK,
        }));
    }, [transactions, stockSettings]);

    // Get stock for a specific product
    const getStock = useCallback(
        (productId: string): number => {
            return stockLevels.find((s) => s.productId === productId)?.currentStock ?? 0;
        },
        [stockLevels]
    );

    // Add transaction
    const addTransaction = useCallback(
        async (data: Omit<Transaction, "id" | "weightKg">) => {
            // Block export if insufficient stock
            if (data.type === "export") {
                const current = stockLevels.find((s) => s.productId === data.productId)?.currentStock ?? 0;
                if (data.quantity > current) {
                    return { success: false, error: `Tồn kho không đủ! Hiện có ${current} cây.` };
                }
            }

            try {
                const weightKg = calcWeight(data.productId, data.quantity);
                const txData = { ...data, weightKg };
                await addDoc(collection(db, "transactions"), txData);
                return { success: true, error: null };
            } catch (error: any) {
                console.error("Error adding transaction:", error);
                return { success: false, error: error.message || "Lỗi khi lưu dữ liệu lên đám mây" };
            }
        },
        [stockLevels]
    );

    // Delete transaction
    const deleteTransaction = useCallback(async (id: string) => {
        try {
            await deleteDoc(doc(db, "transactions", id));
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    }, []);

    // Update min stock setting
    const updateMinStock = useCallback(async (productId: string, min: number) => {
        try {
            await setDoc(doc(db, "settings", productId), { minStock: min }, { merge: true });
        } catch (error) {
            console.error("Error updating min stock:", error);
        }
    }, []);

    // Low-stock products
    const lowStockProducts = useMemo(() => {
        return stockLevels.filter((s) => s.currentStock <= s.minStock);
    }, [stockLevels]);

    // Quick stats
    const stats = useMemo(() => {
        const now = new Date();
        const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

        let monthImport = 0;
        let monthExport = 0;
        let totalStock = 0;

        transactions.forEach((tx) => {
            const txMonth = tx.date.slice(0, 7);
            if (txMonth === thisMonth) {
                if (tx.type === "import") monthImport += tx.quantity;
                else monthExport += tx.quantity;
            }
        });

        stockLevels.forEach((s) => {
            totalStock += s.currentStock;
        });

        return { monthImport, monthExport, totalStock };
    }, [transactions, stockLevels]);

    // Monthly report data
    const getMonthlyReport = useCallback(
        (year: number): MonthlyRow[] => {
            const rows: MonthlyRow[] = [];

            for (let m = 1; m <= 12; m++) {
                const monthKey = `${year}-${String(m).padStart(2, "0")}`;
                const monthTxs = transactions.filter((tx) => tx.date.startsWith(monthKey));

                if (monthTxs.length === 0 && m > new Date().getMonth() + 1 && year >= new Date().getFullYear()) continue;

                const details: { productId: string; imported: number; exported: number }[] = [];
                STEEL_PRODUCTS.forEach((p) => {
                    const imported = monthTxs
                        .filter((tx) => tx.productId === p.id && tx.type === "import")
                        .reduce((s, tx) => s + tx.quantity, 0);
                    const exported = monthTxs
                        .filter((tx) => tx.productId === p.id && tx.type === "export")
                        .reduce((s, tx) => s + tx.quantity, 0);
                    if (imported > 0 || exported > 0) {
                        details.push({ productId: p.id, imported, exported });
                    }
                });

                rows.push({
                    month: monthKey,
                    monthLabel: `T${m}/${year}`,
                    totalImport: monthTxs.filter((tx) => tx.type === "import").reduce((s, tx) => s + tx.quantity, 0),
                    totalExport: monthTxs.filter((tx) => tx.type === "export").reduce((s, tx) => s + tx.quantity, 0),
                    details,
                });
            }

            return rows;
        },
        [transactions]
    );

    // Recent transactions by type
    const getRecent = useCallback(
        (type: "import" | "export", limit = 10): Transaction[] => {
            return transactions.filter((tx) => tx.type === type).slice(0, limit);
        },
        [transactions]
    );

    return {
        isLoaded,
        transactions,
        stockLevels,
        stockSettings,
        lowStockProducts,
        stats,
        getStock,
        addTransaction,
        deleteTransaction,
        updateMinStock,
        getMonthlyReport,
        getRecent,
    };
}
