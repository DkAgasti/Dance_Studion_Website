"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Rectangle,
} from "recharts";

function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs">
      <p className="font-bold text-foreground">{label}</p>
      <p className="text-muted-foreground">{formatter(payload[0].value)}</p>
    </div>
  );
}

// Admin dashboard charts (revenue trend + enrollment by class) — data comes
// from lib/dashboard.js (real Fee/Student aggregates).
export function RevenueChart({ data }) {
  if (!data?.some((d) => d.revenue > 0)) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-sm text-muted-foreground">
        No paid fees yet.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff2d55" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#ff2d55" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#a1a1aa", fontSize: 12 }}
          />
          <YAxis hide domain={["dataMin - 20000", "dataMax + 20000"]} />
          <Tooltip
            cursor={{ stroke: "rgba(255,255,255,0.1)" }}
            content={<ChartTooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} />}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#ff2d55"
            strokeWidth={2.5}
            fill="url(#revenueFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EnrollmentChart({ data }) {
  if (!data?.length) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-sm text-muted-foreground">
        No active students yet.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
        >
          <XAxis type="number" hide domain={[0, 100]} />
          <YAxis
            type="category"
            dataKey="style"
            axisLine={false}
            tickLine={false}
            width={90}
            tick={{ fill: "#f5f5f7", fontSize: 13 }}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            content={<ChartTooltip formatter={(v) => `${v}%`} />}
          />
          <Bar
            dataKey="percent"
            barSize={16}
            isAnimationActive={false}
            shape={(shapeProps) => (
              <Rectangle
                x={shapeProps.x}
                y={shapeProps.y}
                width={shapeProps.width}
                height={shapeProps.height}
                radius={[0, 6, 6, 0]}
                fill={shapeProps.payload.color}
              />
            )}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
