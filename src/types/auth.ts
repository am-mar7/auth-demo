export interface SignUpData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  }
  
  export interface SignInData {
    email: string;
    password: string;
  }
  
  export interface VerifyEmailData {
    email: string;
    OTP: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
      accessToken?: string;
      refreshToken?: string;
      user?: User;
    };
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
  }
  
  export interface FormErrors {
    [key: string]: string;
  }