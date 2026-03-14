/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StressChart({ data }: any) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <XAxis dataKey="time" />
        <YAxis domain={[0, 1]} />
        <Tooltip />
        <Line type="monotone" dataKey="stress" stroke="#ef4444" />
      </LineChart>
    </ResponsiveContainer>
  );
}