'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { signIn } from '../../lib/api';
import { validateSignIn } from '../../lib/validations';
import { tokenStorage } from '../../utils/tokenStorage';
import { SignInData, FormErrors } from '../../types/auth';

export const SignInForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignInData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    const validationErrors = validateSignIn(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await signIn(formData);
      
      if (response.data?.accessToken) {
        tokenStorage.setAccessToken(response.data.accessToken);
        
        if (response.data.refreshToken) {
          tokenStorage.setRefreshToken(response.data.refreshToken);
        }
      }

      setAlert({ type: 'success', message: response.message });
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.message || 'Invalid email or password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <Input
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="john@example.com"
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        placeholder="••••••••"
        required
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
            Forgot password?
          </a>
        </div>
      </div>

      <Button type="submit" fullWidth isLoading={isLoading}>
        Sign In
      </Button>
    </form>
  );
};