import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, LogIn } from 'lucide-react';
import { login } from '../state/authSession';
import { generateCaptcha } from '../lib/captcha';

export default function Login() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const refreshCaptcha = () => {
    const newCaptcha = generateCaptcha();
    setCaptchaValue(newCaptcha);
    setCaptchaInput('');
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate credentials
    if (userId !== 'Admin') {
      setError('Invalid User ID');
      setIsLoading(false);
      return;
    }

    if (password !== 'Project@123') {
      setError('Invalid Password');
      setIsLoading(false);
      return;
    }

    if (captchaInput !== captchaValue) {
      setError('Invalid Captcha. Please try again.');
      refreshCaptcha();
      setIsLoading(false);
      return;
    }

    // Login successful
    login();
    setTimeout(() => {
      navigate({ to: '/dashboard' });
    }, 500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-950 via-slate-900 to-orange-950 p-4">
      <Card className="w-full max-w-md border-emerald-800/30 bg-slate-900/80 backdrop-blur-sm">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto mb-2">
            <img
              src="/assets/generated/ff-logo.dim_512x512.png"
              alt="Logo"
              className="h-20 w-20 drop-shadow-lg"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-emerald-50">
            Forest Fire Monitoring
          </CardTitle>
          <CardDescription className="text-emerald-100/70">
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId" className="text-emerald-50">
                User ID
              </Label>
              <Input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter User ID"
                required
                className="border-emerald-800/50 bg-slate-800/50 text-emerald-50 placeholder:text-emerald-100/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-emerald-50">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
                className="border-emerald-800/50 bg-slate-800/50 text-emerald-50 placeholder:text-emerald-100/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="captcha" className="text-emerald-50">
                Captcha
              </Label>
              <div className="flex items-center gap-2">
                <div className="flex h-12 flex-1 items-center justify-center rounded-md border border-emerald-800/50 bg-slate-800/80 font-mono text-xl font-bold tracking-widest text-emerald-400">
                  {captchaValue}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={refreshCaptcha}
                  className="h-12 w-12 border-emerald-800/50 bg-slate-800/50 hover:bg-slate-700/50"
                >
                  <RefreshCw className="h-4 w-4 text-emerald-400" />
                </Button>
              </div>
              <Input
                id="captcha"
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Enter Captcha"
                required
                className="border-emerald-800/50 bg-slate-800/50 text-emerald-50 placeholder:text-emerald-100/30"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-800/50 bg-red-950/50">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-600"
              disabled={isLoading}
            >
              {isLoading ? (
                'Logging in...'
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
