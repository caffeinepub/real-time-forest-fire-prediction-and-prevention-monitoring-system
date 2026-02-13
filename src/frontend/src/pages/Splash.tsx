import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Splash() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate({ to: '/login' });
  };

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: 'url(/assets/generated/ff-splash-bg.dim_1920x1080.png)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      
      <div className="relative z-10 flex flex-col items-center space-y-8 px-4 text-center">
        <div className="animate-fade-in">
          <img
            src="/assets/generated/ff-logo.dim_512x512.png"
            alt="Forest Fire Monitoring"
            className="h-32 w-32 drop-shadow-2xl md:h-40 md:w-40"
          />
        </div>
        
        <div className="space-y-3 animate-fade-in-delay">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl">
            Forest Fire Monitoring
          </h1>
          <p className="text-lg text-white/90 drop-shadow-md md:text-xl">
            Real-time Prediction & Prevention System
          </p>
        </div>

        <div className="space-y-2 animate-fade-in-delay-2 text-white/80">
          <p className="text-sm md:text-base">
            <span className="font-semibold">Creator:</span> Anurag Hota
          </p>
          <p className="text-sm md:text-base">
            <span className="font-semibold">Company:</span> A&R Infotect Pvt Ltd
          </p>
          <p className="text-sm md:text-base">
            <span className="font-semibold">Assistance by:</span> Manasi Herna, Iswari Bag, Swati Bachha
          </p>
        </div>

        <div className="animate-fade-in-delay-2 pt-4">
          <Button
            onClick={handleStart}
            size="lg"
            className="bg-emerald-700 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
