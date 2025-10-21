import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { translations, Language } from '../translations';
import { GraduationCap } from 'lucide-react';
import { ADMIN_CREDENTIALS } from '../data/mockData';

interface LoginRegistrationProps {
  onLogin: (userData: {
    name: string;
    email: string;
    nationality: 'Japanese' | 'Vietnamese';
  }) => void;
  onAdminLogin?: () => void;
  language: Language;
}

export function LoginRegistration({ onLogin, onAdminLogin, language }: LoginRegistrationProps) {
  const t = translations[language];
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    nationality: '' as 'Japanese' | 'Vietnamese' | ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      // Check for admin credentials
      if (formData.email === ADMIN_CREDENTIALS.username && formData.password === ADMIN_CREDENTIALS.password) {
        if (onAdminLogin) {
          onAdminLogin();
          return;
        }
      }

      // Mock login for regular users
      onLogin({
        name: 'Demo User',
        email: formData.email,
        nationality: 'Japanese'
      });
    } else {
      // Mock registration
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      if (!formData.nationality) {
        alert('Please select a nationality');
        return;
      }
      onLogin({
        name: formData.name,
        email: formData.email,
        nationality: formData.nationality
      });
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    // Mock social login - in production, this would redirect to OAuth provider
    const mockUserData = {
      google: {
        name: 'Google User',
        email: 'user@gmail.com',
        nationality: 'Japanese' as const
      },
      facebook: {
        name: 'Facebook User',
        email: 'user@facebook.com',
        nationality: 'Japanese' as const
      }
    };

    onLogin(mockUserData[provider]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 border-2 shadow-xl">
        <div className="flex items-center justify-center mb-8">
          <GraduationCap className="w-12 h-12 text-blue-600 mr-3" />
          <h1 className="text-3xl">TeachMate</h1>
        </div>

        <h2 className="text-center mb-6">
          {isLogin ? t.welcomeBack : t.createAccount}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <Label htmlFor="name">{t.fullName}</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="mt-1"
              />
            </div>
          )}

          <div>
            <Label htmlFor="email">{t.email}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">{t.password}</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="nationality">{t.nationality}</Label>
                <Select
                  value={formData.nationality}
                  onValueChange={(value: string) => setFormData({ ...formData, nationality: value as 'Japanese' | 'Vietnamese' })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={t.selectNationality} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Japanese">{t.japanese}</SelectItem>
                    <SelectItem value="Vietnamese">{t.vietnamese}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {isLogin ? t.login : t.register}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-gray-500">{t.orContinueWith}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin('google')}
              className="w-full border-2 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t.continueWithGoogle}
            </Button>



            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin('facebook')}
              className="w-full border-2 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              {t.continueWithFacebook}
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? t.dontHaveAccount : t.alreadyHaveAccount}
          </p>
          <Button
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
            className="mt-1"
          >
            {isLogin ? t.registerHere : t.loginHere}
          </Button>
        </div>
      </Card>
    </div>
  );
}
