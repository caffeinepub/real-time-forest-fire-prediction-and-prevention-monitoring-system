import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PieChartIcon } from 'lucide-react';
import type { AlertStatus } from '../../lib/alertStatus';

interface StatusPieChartProps {
  alertStatus: AlertStatus;
  demoMode: boolean;
}

export default function StatusPieChart({ alertStatus, demoMode }: StatusPieChartProps) {
  const data = [
    { name: 'Safe', value: alertStatus.prediction.level === 'safe' ? 70 : 30, color: '#10b981' },
    { name: 'Warning', value: alertStatus.prediction.level === 'warning' ? 50 : 20, color: '#f59e0b' },
    { name: 'Critical', value: alertStatus.prevention.level === 'critical' ? 80 : 10, color: '#ef4444' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-emerald-500" />
          Alert Status Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
