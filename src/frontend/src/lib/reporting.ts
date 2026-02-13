import type { TelemetryTimeSeries } from '../types/telemetry';

export interface AggregatedData {
  period: string;
  warnings: number;
  criticalAlerts: number;
}

export function aggregateMonthly(timeSeries: TelemetryTimeSeries[], demoMode: boolean): AggregatedData[] {
  if (demoMode || timeSeries.length === 0) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month) => ({
      period: month,
      warnings: Math.floor(Math.random() * 10),
      criticalAlerts: Math.floor(Math.random() * 3),
    }));
  }

  // Aggregate real data by month
  const monthMap = new Map<string, { warnings: number; criticalAlerts: number }>();
  
  timeSeries.forEach((item) => {
    const month = item.time.split(' ')[0]; // Simplified
    if (!monthMap.has(month)) {
      monthMap.set(month, { warnings: 0, criticalAlerts: 0 });
    }
    const data = monthMap.get(month)!;
    if (item.temperature > 35) data.warnings++;
    if (item.temperature > 40) data.criticalAlerts++;
  });

  return Array.from(monthMap.entries()).map(([period, data]) => ({
    period,
    ...data,
  }));
}

export function aggregateYearly(timeSeries: TelemetryTimeSeries[], demoMode: boolean): AggregatedData[] {
  if (demoMode || timeSeries.length === 0) {
    const years = ['2021', '2022', '2023', '2024', '2025'];
    return years.map((year) => ({
      period: year,
      warnings: Math.floor(Math.random() * 50),
      criticalAlerts: Math.floor(Math.random() * 15),
    }));
  }

  // For real data, return a single year aggregate
  return [{
    period: new Date().getFullYear().toString(),
    warnings: timeSeries.filter(item => item.temperature > 35).length,
    criticalAlerts: timeSeries.filter(item => item.temperature > 40).length,
  }];
}
