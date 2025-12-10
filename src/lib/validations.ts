import { SignUpData, SignInData, VerifyEmailData, FormErrors } from "../types/auth";

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validateSignUp = (data: SignUpData): FormErrors => {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(data.password)) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!data.role) {
    errors.role = 'Role is required';
  }

  return errors;
};

export const validateSignIn = (data: SignInData): FormErrors => {
  const errors: FormErrors = {};

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  }

  return errors;
};

export const validateVerifyEmail = (data: VerifyEmailData): FormErrors => {
  const errors: FormErrors = {};

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.OTP.trim()) {
    errors.OTP = 'OTP is required';
  } else if (data.OTP.length !== 4) {
    errors.OTP = 'OTP must be 6 digits';
  }

  return errors;
};