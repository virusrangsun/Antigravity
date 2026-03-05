export type TransactionType = "import" | "export";

export interface Transaction {
    id: string;
    type: TransactionType;
    productId: string;
    quantity: number;
    date: string;
    supplier?: string;
    customer?: string;
    invoiceNumber?: string;
    note?: string;
    weightKg?: number;
}

export interface StockLevel {
    productId: string;
    currentStock: number;
    minStock: number;
}

export interface StockSettings {
    [productId: string]: number; // minStock per product
}

export interface MonthlyRow {
    month: string;       // "2026-03"
    monthLabel: string;  // "T3/2026"
    totalImport: number;
    totalExport: number;
    details: {
        productId: string;
        imported: number;
        exported: number;
    }[];
}
