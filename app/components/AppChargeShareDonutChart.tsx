"use client";

import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";
import type { PieSectorShapeProps } from "recharts";
import type { AppChargeShareItem } from "../lib/analysisStats";
import { formatCurrency } from "../lib/format";

const chartColors = [
  "#3b82f6",
  "#60a5fa",
  "#34d399",
  "#f59e0b",
  "#a78bfa",
  "#fb7185",
  "#64748b",
];

type AppChargeShareDonutChartProps = {
  items: AppChargeShareItem[];
  size?: "compact" | "large";
};

function renderDonutSector(props: PieSectorShapeProps, index: number) {
  return (
    <Sector
      {...props}
      fill={chartColors[index % chartColors.length]}
      stroke="none"
    />
  );
}

export default function AppChargeShareDonutChart({
  items,
  size = "compact",
}: AppChargeShareDonutChartProps) {
  const layoutClass =
    size === "large"
      ? "grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-center md:gap-6"
      : "grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center";
  const chartSizeClass =
    size === "large" ? "mx-auto h-40 w-40 md:h-64 md:w-64" : "mx-auto h-40 w-40";
  const legendHeightClass =
    size === "large" ? "max-h-44 overflow-y-auto pr-1 md:max-h-64" : "max-h-44 overflow-y-auto pr-1";

  if (items.length === 0) {
    return (
      <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center">
        <p className="text-sm font-bold text-slate-500">
          課金データがありません
        </p>
      </div>
    );
  }

  return (
    <div className={layoutClass}>
      <div className={chartSizeClass}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={items}
              dataKey="appTotalAmount"
              nameKey="gameName"
              innerRadius="40%"
              outerRadius="78%"
              paddingAngle={2}
              stroke="none"
              shape={renderDonutSector}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              labelFormatter={(label) => String(label)}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className={legendHeightClass}>
        <ul className="grid gap-2">
          {items.map((item, index) => (
            <li
              key={item.gameId}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-slate-50 px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      chartColors[index % chartColors.length],
                  }}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800">
                    {item.gameName}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-500">
                    {formatCurrency(item.appTotalAmount)}
                  </p>
                </div>
              </div>
              <p className="text-sm font-bold text-slate-950">
                {item.percentage}%
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
