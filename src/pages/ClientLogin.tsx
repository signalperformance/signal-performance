import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
export default function ClientLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: t('portal.login.loginSuccess'),
          description: t('portal.login.welcomeMessage')
        });
        navigate('/client');
      } else {
        setError(t('portal.login.invalidCredentials'));
      }
    } catch (err) {
      setError(t('portal.login.errorOccurred'));
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center relative">
            <div className="absolute top-6 right-6 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">EN</span>
              <Switch
                checked={language === 'zh'}
                onCheckedChange={handleLanguageToggle}
                className="data-[state=checked]:bg-primary"
              />
              <span className="text-sm text-muted-foreground">中文</span>
            </div>
            <CardTitle className="text-2xl font-heading">{t('portal.login.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('portal.login.email')}</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('portal.login.emailPlaceholder')} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('portal.login.password')}</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder={t('portal.login.passwordPlaceholder')} required />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-background border-t-transparent rounded-full"></div>
                    {t('portal.login.signingIn')}
                  </div> : <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    {t('portal.login.signIn')}
                  </div>}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              
              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}