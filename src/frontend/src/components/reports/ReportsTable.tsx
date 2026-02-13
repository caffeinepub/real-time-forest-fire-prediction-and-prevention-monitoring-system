import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import type { AggregatedData } from '../../lib/reporting';

interface ReportsTableProps {
  data: AggregatedData[];
  period: 'monthly' | 'yearly';
  isEmpty: boolean;
}

export default function ReportsTable({ data, period, isEmpty }: ReportsTableProps) {
  if (isEmpty) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const totals = data.reduce(
    (acc, item) => ({
      warnings: acc.warnings + item.warnings,
      criticalAlerts: acc.criticalAlerts + item.criticalAlerts,
    }),
    { warnings: 0, criticalAlerts: 0 }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary Table</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{period === 'monthly' ? 'Month' : 'Year'}</TableHead>
              <TableHead className="text-right">Warnings</TableHead>
              <TableHead className="text-right">Critical Alerts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.period}>
                <TableCell className="font-medium">{item.period}</TableCell>
                <TableCell className="text-right">{item.warnings}</TableCell>
                <TableCell className="text-right">{item.criticalAlerts}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-bold">Total</TableCell>
              <TableCell className="text-right font-bold">{totals.warnings}</TableCell>
              <TableCell className="text-right font-bold">{totals.criticalAlerts}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}
