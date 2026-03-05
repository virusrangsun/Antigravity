import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("vi-VN").format(num);
}

export function formatWeight(kg: number): string {
  return new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(kg) + " kg";
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatMonthYear(dateStr: string): string {
  const date = new Date(dateStr + "-01");
  return new Intl.DateTimeFormat("vi-VN", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function generateId(): string {
  return `GD-${Date.now().toString(36).toUpperCase()}`;
}

export function getStockStatus(current: number, min: number): "ok" | "low" | "out" {
  if (current <= 0) return "out";
  if (current <= min) return "low";
  return "ok";
}

export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}
