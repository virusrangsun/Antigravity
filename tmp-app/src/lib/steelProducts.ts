export interface SteelProduct {
    id: string;
    name: string;
    diameter: number; // mm
    weightPerMeter: number; // kg/m
    standardLength: number; // m (thường 11.7m)
    unit: string; // "Cây"
}

export const STEEL_PRODUCTS: SteelProduct[] = [
    { id: "phi-6", name: "Thép Φ6", diameter: 6, weightPerMeter: 0.222, standardLength: 11.7, unit: "Cây" },
    { id: "phi-8", name: "Thép Φ8", diameter: 8, weightPerMeter: 0.395, standardLength: 11.7, unit: "Cây" },
    { id: "phi-10", name: "Thép Φ10", diameter: 10, weightPerMeter: 0.617, standardLength: 11.7, unit: "Cây" },
    { id: "phi-12", name: "Thép Φ12", diameter: 12, weightPerMeter: 0.888, standardLength: 11.7, unit: "Cây" },
    { id: "phi-14", name: "Thép Φ14", diameter: 14, weightPerMeter: 1.208, standardLength: 11.7, unit: "Cây" },
    { id: "phi-16", name: "Thép Φ16", diameter: 16, weightPerMeter: 1.578, standardLength: 11.7, unit: "Cây" },
    { id: "phi-18", name: "Thép Φ18", diameter: 18, weightPerMeter: 1.998, standardLength: 11.7, unit: "Cây" },
    { id: "phi-20", name: "Thép Φ20", diameter: 20, weightPerMeter: 2.466, standardLength: 11.7, unit: "Cây" },
    { id: "phi-22", name: "Thép Φ22", diameter: 22, weightPerMeter: 2.984, standardLength: 11.7, unit: "Cây" },
    { id: "phi-25", name: "Thép Φ25", diameter: 25, weightPerMeter: 3.853, standardLength: 11.7, unit: "Cây" },
    { id: "phi-28", name: "Thép Φ28", diameter: 28, weightPerMeter: 4.834, standardLength: 11.7, unit: "Cây" },
    { id: "phi-32", name: "Thép Φ32", diameter: 32, weightPerMeter: 6.313, standardLength: 11.7, unit: "Cây" },
];

export function getProduct(id: string): SteelProduct | undefined {
    return STEEL_PRODUCTS.find((p) => p.id === id);
}

export function calcWeight(productId: string, quantity: number): number {
    const product = getProduct(productId);
    if (!product) return 0;
    return Math.round(quantity * product.weightPerMeter * product.standardLength * 100) / 100;
}

export const DEFAULT_MIN_STOCK = 50;
