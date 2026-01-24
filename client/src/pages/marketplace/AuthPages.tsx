import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Truck, AlertCircle, CheckCircle, ShoppingCart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { PasswordStrengthIndicator } from '@/components/marketplace/PasswordStrengthIndicator';
import { login, register } from '@/lib/marketplace-api';
import { t } from '@/lib/marketplace-i18n';
import { getCurrentLanguage } from '@/lib/i18n-simple';

// Login Page
export function LoginPage() {
  const [, navigate] = useLocation();
  const lang = getCurrentLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      
      // Check for redirect URL
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      
      if (redirect) {
        navigate(redirect);
      } else {
        navigate(`/${lang}/marketplace/dashboard`);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 bg-[#0A3161] rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">{t('loginTitle')}</CardTitle>
              <CardDescription>
                {t('marketplace')}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('password')}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="button" className="text-sm text-[#0A3161] hover:underline">
                    {t('forgotPassword')}
                  </button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#0A3161] hover:bg-[#0A3161]/90"
                  disabled={isLoading}
                >
                  {isLoading ? t('loading') : t('login')}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">{t('noAccount')} </span>
                <button 
                  onClick={() => navigate(`/${lang}/marketplace/register`)}
                  className="text-[#0A3161] font-medium hover:underline"
                >
                  {t('register')}
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

// Register Page
export function RegisterPage() {
  const [, navigate] = useLocation();
  const lang = getCurrentLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isPasswordStrong, setIsPasswordStrong] = useState(false);
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    companyName: '',
    phone: '',
  });

  // Read role from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    if (roleParam === 'seller') {
      setRole('seller');
    } else {
      setRole('buyer');
    }
  }, []);

  const handlePasswordStrengthChange = useCallback((isStrong: boolean) => {
    setIsPasswordStrong(isStrong);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(lang === 'es' ? 'Las contraseñas no coinciden' : 'Passwords do not match');
      return;
    }

    if (!isPasswordStrong) {
      setError(lang === 'es' ? 'La contraseña no cumple los requisitos de seguridad' : 'Password does not meet security requirements');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        companyName: formData.companyName,
        phone: formData.phone,
        role: role,
      });
      
      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate(`/${lang}/marketplace/login`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t('registrationSuccessful')}
            </h1>
            <p className="text-gray-600 mb-4">
              {t('accountCreated')}
            </p>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${role === 'seller' ? 'bg-[#A93226]' : 'bg-[#0A3161]'}`}>
                {role === 'seller' ? <TrendingUp className="w-8 h-8 text-white" /> : <ShoppingCart className="w-8 h-8 text-white" />}
              </div>
              <CardTitle className="text-2xl">
                {role === 'seller' ? t('registerAsSeller') : t('registerAsBuyer')}
              </CardTitle>
              <CardDescription>
                {role === 'seller' ? t('sellerDescription') : t('buyerDescription')}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t('firstName')}</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t('lastName')}</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">{t('companyName')}</Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Your Company Inc."
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')} *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t('phone')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('password')} *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={lang === 'es' ? 'Crear contraseña segura' : 'Create secure password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      autoComplete="new-password"
                      className={formData.password && !isPasswordStrong ? 'border-orange-300 focus:border-orange-500' : ''}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <PasswordStrengthIndicator 
                    password={formData.password}
                    language={lang as 'en' | 'es'}
                    onStrengthChange={handlePasswordStrengthChange}
                    showRules={true}
                    minScore={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('confirmPassword')} *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={lang === 'es' ? 'Confirmar contraseña' : 'Confirm your password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    autoComplete="new-password"
                    className={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-300 focus:border-red-500' : ''}
                  />
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {lang === 'es' ? 'Las contraseñas no coinciden' : 'Passwords do not match'}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className={`w-full ${role === 'seller' ? 'bg-[#A93226] hover:bg-[#922B21]' : 'bg-[#0A3161] hover:bg-[#0A3161]/90'}`}
                  disabled={isLoading}
                >
                  {isLoading ? t('creatingAccount') : t('register')}
                </Button>
              </form>

              {/* Switch role link */}
              <div className="mt-4 text-center text-sm border-t pt-4">
                <span className="text-gray-600">
                  {role === 'seller' ? t('wantToBuyer') : t('wantToSeller')}{' '}
                </span>
                <button 
                  onClick={() => navigate(`/${lang}/marketplace/register?role=${role === 'seller' ? 'buyer' : 'seller'}`)}
                  className={`font-medium hover:underline ${role === 'seller' ? 'text-[#0A3161]' : 'text-[#A93226]'}`}
                >
                  {role === 'seller' ? t('registerAsBuyerLink') : t('registerAsSellerLink')}
                </button>
              </div>

              <div className="mt-4 text-center text-sm">
                <span className="text-gray-600">{t('haveAccount')} </span>
                <button 
                  onClick={() => navigate(`/${lang}/marketplace/login`)}
                  className="text-[#0A3161] font-medium hover:underline"
                >
                  {t('login')}
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
