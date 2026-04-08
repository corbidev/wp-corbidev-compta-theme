import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const TransactionChart = ({ data = [] }: any) => {
  const safeData = data ?? [];

  const grouped = Object.values(
    safeData.reduce((acc: any, t: any) => {
      if (!t?.dt_posted) return acc;

      if (!acc[t.dt_posted]) {
        acc[t.dt_posted] = { date: t.dt_posted, total: 0 };
      }

      acc[t.dt_posted].total += Number(t.amount || 0);
      return acc;
    }, {})
  );

  return (
    <div className="h-64">
      <ResponsiveContainer>
        <LineChart data={grouped}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line dataKey="total" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};