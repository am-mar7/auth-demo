const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenStorage = {
  setAccessToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
  },

  getAccessToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return null;
  },

  setRefreshToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  },

  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  },

  clearTokens: (): void => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },
};