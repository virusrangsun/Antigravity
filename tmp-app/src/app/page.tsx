"use client";

import StockOverview from "@/components/StockOverview";
import LowStockAlerts from "@/components/LowStockAlerts";
import { useInventory } from "@/lib/useTransactions";
import { formatNumber } from "@/lib/utils";
import { PackagePlus, PackageMinus, Layers } from "lucide-react";

export default function DashboardPage() {
  const { stockLevels, lowStockProducts, stats, isLoaded } = useInventory();

  if (!isLoaded) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <p>Đang tải dữ liệu…</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Tổng quan Kho Thép</h1>
        <p className="page-subtitle">Theo dõi tình hình tồn kho thép xây dựng</p>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="quick-stat quick-stat--import">
          <PackagePlus size={20} aria-hidden="true" />
          <div>
            <span className="quick-stat-label">Nhập tháng này</span>
            <span className="quick-stat-value">{formatNumber(stats.monthImport)} cây</span>
          </div>
        </div>
        <div className="quick-stat quick-stat--export">
          <PackageMinus size={20} aria-hidden="true" />
          <div>
            <span className="quick-stat-label">Xuất tháng này</span>
            <span className="quick-stat-value">{formatNumber(stats.monthExport)} cây</span>
          </div>
        </div>
        <div className="quick-stat quick-stat--total">
          <Layers size={20} aria-hidden="true" />
          <div>
            <span className="quick-stat-label">Tổng tồn kho</span>
            <span className="quick-stat-value">{formatNumber(stats.totalStock)} cây</span>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <LowStockAlerts lowStockProducts={lowStockProducts} />

      {/* Stock Overview */}
      <div className="section-title">
        <h2>Tồn kho theo loại thép</h2>
      </div>
      <StockOverview stockLevels={stockLevels} />
    </div>
  );
}
