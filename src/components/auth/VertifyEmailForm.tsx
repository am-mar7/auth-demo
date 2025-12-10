'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { verifyEmail } from '../../lib/api';
import { validateVerifyEmail } from '../../lib/validations';
import { VerifyEmailData, FormErrors } from '../../types/auth';

export const VerifyEmailForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');

  const [formData, setFormData] = useState<VerifyEmailData>({
    email: emailParam || '',
    OTP: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  useEffect(() => {
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
  }, [emailParam]);

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

    const validationErrors = validateVerifyEmail(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await verifyEmail(formData);
      setAlert({ type: 'success', message: response.message });
      
      setTimeout(() => {
        router.push('/signin');
      }, 1500);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.message || 'Failed to verify email. Please try again.',
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

      <div className="text-center mb-6">
        <p className="text-gray-600">
          We&apos;ve sent a verification code to{' '}
          <span className="font-medium text-gray-900">{formData.email}</span>
        </p>
      </div>

      <Input
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="john@example.com"
        required
        disabled={!!emailParam}
      />

      <Input
        label="Verification Code"
        name="OTP"
        type="text"
        value={formData.OTP}
        onChange={handleChange}
        error={errors.OTP}
        placeholder="Enter 4-digit code"
        maxLength={4}
        helperText="Enter the 4-digit code sent to your email"
        required
      />

      <Button type="submit" fullWidth isLoading={isLoading}>
        Verify Email
      </Button>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
          onClick={() => {
            setAlert({ type: 'info', message: 'Verification code resent!' });
          }}
        >
          Didn&apos;t receive the code? Resend
        </button>
      </div>
    </form>
  );
};