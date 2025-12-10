import { SignUpData, SignInData, VerifyEmailData, AuthResponse } from '../types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        result.message || 'Failed to sign up'
      );
    }

    return {
      success: true,
      message: result.message || 'Sign up successful. Please verify your email.',
      data: result.data,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Network error. Please try again.');
  }
};

export const signIn = async (data: SignInData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        result.message || 'Failed to sign in'
      );
    }

    return {
      success: true,
      message: result.message || 'Sign in successful',
      data: result.data,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Network error. Please try again.');
  }
};

export const verifyEmail = async (data: VerifyEmailData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        result.message || 'Failed to verify email'
      );
    }

    return {
      success: true,
      message: result.message || 'Email verified successfully',
      data: result.data,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Network error. Please try again.');
  }
};