"use client";

import React, { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { STEEL_PRODUCTS } from "@/lib/steelProducts";
import { MonthlyRow } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface MonthlyReportProps {
    getMonthlyReport: (year: number) => MonthlyRow[];
}

function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="chart-tooltip">
                <p className="chart-tooltip-label">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ color: entry.color }} className="chart-tooltip-value">
                        {entry.name}: {formatNumber(entry.value)} cây
                    </p>
                ))}
            </div>
        );
    }
    return null;
}

export default function MonthlyReport({ getMonthlyReport }: MonthlyReportProps) {
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);

    const data = getMonthlyReport(year);
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    const chartData = data.map((row) => ({
        month: row.monthLabel,
        "Nhập kho": row.totalImport,
        "Xuất kho": row.totalExport,
    }));

    return (
        <div className="report-section">
            <div className="report-header">
                <h2 className="report-title">Báo cáo xuất nhập kho</h2>
                <div className="report-filter">
                    <label htmlFor="report-year" className="tx-label">Năm</label>
                    <select
                        id="report-year"
                        name="year"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="tx-input tx-input--sm"
                    >
                        {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Chart */}
            <div className="chart-container">
                <h3 className="chart-title">Biểu đồ Nhập/Xuất theo tháng — {year}</h3>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                            <defs>
                                <linearGradient id="importGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                                    <stop offset="100%" stopColor="#818cf8" stopOpacity={0.6} />
                                </linearGradient>
                                <linearGradient id="exportGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.9} />
                                    <stop offset="100%" stopColor="#fb923c" stopOpacity={0.6} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                            <XAxis
                                dataKey="month"
                                tick={{ fill: "#94a3b8", fontSize: 12 }}
                                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                            />
                            <YAxis
                                tick={{ fill: "#94a3b8", fontSize: 12 }}
                                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                wrapperStyle={{ paddingTop: "16px" }}
                                formatter={(value: string) => (
                                    <span style={{ color: "#cbd5e1", fontSize: "13px" }}>{value}</span>
                                )}
                            />
                            <Bar dataKey="Nhập kho" fill="url(#importGradient)" radius={[6, 6, 0, 0]} barSize={28} />
                            <Bar dataKey="Xuất kho" fill="url(#exportGradient)" radius={[6, 6, 0, 0]} barSize={28} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Detail Table */}
            <div className="report-table-container">
                <h3 className="chart-title">Chi tiết theo sản phẩm — {year}</h3>
                <div className="tx-table-wrapper">
                    <table className="tx-table report-table">
                        <thead>
                            <tr>
                                <th>Tháng</th>
                                {STEEL_PRODUCTS.map((p) => (
                                    <th key={p.id} colSpan={2}>{p.name}</th>
                                ))}
                                <th colSpan={2}>Tổng cộng</th>
                            </tr>
                            <tr className="report-sub-header">
                                <th></th>
                                {STEEL_PRODUCTS.map((p) => (
                                    <React.Fragment key={p.id}>
                                        <th className="th-import">Nhập</th>
                                        <th className="th-export">Xuất</th>
                                    </React.Fragment>
                                ))}
                                <th className="th-import">Nhập</th>
                                <th className="th-export">Xuất</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row) => (
                                <tr key={row.month} className="tx-row">
                                    <td className="tx-product-name">{row.monthLabel}</td>
                                    {STEEL_PRODUCTS.map((p) => {
                                        const detail = row.details.find((d) => d.productId === p.id);
                                        return (
                                            <React.Fragment key={p.id}>
                                                <td className="tx-quantity cell-import">{detail?.imported ? formatNumber(detail.imported) : "—"}</td>
                                                <td className="tx-quantity cell-export">{detail?.exported ? formatNumber(detail.exported) : "—"}</td>
                                            </React.Fragment>
                                        );
                                    })}
                                    <td className="tx-quantity cell-import total-cell">{row.totalImport ? formatNumber(row.totalImport) : "—"}</td>
                                    <td className="tx-quantity cell-export total-cell">{row.totalExport ? formatNumber(row.totalExport) : "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
