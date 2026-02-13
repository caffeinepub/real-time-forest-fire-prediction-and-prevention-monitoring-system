import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Wind, Droplets, Sprout, User, Flame, CloudFog } from 'lucide-react';
import type { Telemetry } from '../../types/telemetry';

interface SummaryCardsProps {
  telemetry: Telemetry;
  demoMode: boolean;
}

export default function SummaryCards({ telemetry, demoMode }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Temperature',
      value: demoMode ? '32°C' : telemetry.temperature ? `${telemetry.temperature}°C` : 'N/A',
      icon: Thermometer,
      color: 'text-orange-500',
    },
    {
      title: 'Wind Speed',
      value: demoMode ? '15 km/h' : telemetry.windSpeed ? `${telemetry.windSpeed} km/h` : 'N/A',
      icon: Wind,
      color: 'text-cyan-500',
    },
    {
      title: 'Humidity',
      value: demoMode ? '45%' : telemetry.humidity ? `${telemetry.humidity}%` : 'N/A',
      icon: Droplets,
      color: 'text-blue-500',
    },
    {
      title: 'Soil Moisture',
      value: demoMode ? '28%' : telemetry.soilMoisture ? `${telemetry.soilMoisture}%` : 'N/A',
      icon: Sprout,
      color: 'text-emerald-500',
    },
    {
      title: 'Human Detection',
      value: demoMode ? 'No' : telemetry.pirDetection ? 'Yes' : 'No',
      icon: User,
      color: 'text-purple-500',
    },
    {
      title: 'Flame Sensor',
      value: demoMode ? 'Normal' : telemetry.flameDetected ? 'Detected' : 'Normal',
      icon: Flame,
      color: telemetry.flameDetected ? 'text-red-500' : 'text-gray-500',
    },
    {
      title: 'Smoke Level',
      value: demoMode ? 'Low' : telemetry.smokeLevel || 'N/A',
      icon: CloudFog,
      color: 'text-gray-400',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
