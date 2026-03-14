<<<<<<< HEAD
=======
/* eslint-disable @typescript-eslint/no-explicit-any */
>>>>>>> origin/main
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

<<<<<<< HEAD
type Props = {
  data: { time: string; stress: number }[];
};

export default function StressChart({ data }: Props) {
  return (
    <div className="h-52 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" hide />
          <YAxis domain={[0, 1]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="stress"
            stroke="#ef4444"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
=======
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
>>>>>>> origin/main
  );
}