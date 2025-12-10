'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { signUp } from '../../lib/api';
import { validateSignUp } from '../../lib/validations';
import { SignUpData, FormErrors } from '../../types/auth';

export const SignUpForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    const validationErrors = validateSignUp(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await signUp(formData);
      setAlert({ type: 'success', message: response.message });
      
      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      }, 1500);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      setAlert({
        type: 'error',
        message: error.message || 'Failed to sign up. Please try again.',
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
        label="Full Name"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="John Doe"
        required
      />

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
        helperText="Must be at least 8 characters"
        required
      />

      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        placeholder="••••••••"
        required
      />
{/* 
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role<span className="text-red-500 ml-1">*</span>
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-200"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && <p className="mt-2 text-sm text-red-600">{errors.role}</p>}
      </div> */}

      <Button type="submit" fullWidth isLoading={isLoading}>
        Sign Up
      </Button>
    </form>
  );
};