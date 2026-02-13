import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { AggregatedData } from '../../lib/reporting';

interface ReportsChartProps {
  data: AggregatedData[];
  period: 'monthly' | 'yearly';
  isEmpty: boolean;
}

export default function ReportsChart({ data, period, isEmpty }: ReportsChartProps) {
  if (isEmpty) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No data available for the selected period
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="period" stroke="rgba(255,255,255,0.5)" />
        <YAxis stroke="rgba(255,255,255,0.5)" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Bar dataKey="warnings" fill="#f59e0b" name="Warnings" />
        <Bar dataKey="criticalAlerts" fill="#ef4444" name="Critical Alerts" />
      </BarChart>
    </ResponsiveContainer>
  );
}
