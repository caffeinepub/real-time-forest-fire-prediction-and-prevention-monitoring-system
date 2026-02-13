import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, AlertTriangle } from 'lucide-react';
import { useTelemetry } from '../hooks/useTelemetry';
import ReportsChart from '../components/reports/ReportsChart';
import ReportsTable from '../components/reports/ReportsTable';
import { aggregateMonthly, aggregateYearly } from '../lib/reporting';

export default function Reports() {
  const { timeSeries, isEmpty } = useTelemetry();
  const [demoMode, setDemoMode] = useState(false);
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const monthlyData = aggregateMonthly(timeSeries, demoMode);
  const yearlyData = aggregateYearly(timeSeries, demoMode);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Historical data analysis and trends
          </p>
        </div>
        {isEmpty && (
          <div className="flex items-center gap-2">
            <Label htmlFor="demo-reports" className="text-sm">Demo Mode</Label>
            <Switch
              id="demo-reports"
              checked={demoMode}
              onCheckedChange={setDemoMode}
            />
          </div>
        )}
      </div>

      {isEmpty && !demoMode && (
        <Alert className="border-amber-800/30 bg-amber-950/20">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-100">
            No historical data available. Enable demo mode to preview report layouts.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={period} onValueChange={(v) => setPeriod(v as 'monthly' | 'yearly')}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-500" />
                Monthly Alert Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReportsChart data={monthlyData} period="monthly" isEmpty={isEmpty && !demoMode} />
            </CardContent>
          </Card>

          <ReportsTable data={monthlyData} period="monthly" isEmpty={isEmpty && !demoMode} />
        </TabsContent>

        <TabsContent value="yearly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-500" />
                Yearly Alert Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReportsChart data={yearlyData} period="yearly" isEmpty={isEmpty && !demoMode} />
            </CardContent>
          </Card>

          <ReportsTable data={yearlyData} period="yearly" isEmpty={isEmpty && !demoMode} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
