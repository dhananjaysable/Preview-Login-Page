import React, { createContext, useContext, useState } from 'react';

interface LoginResponse {
  success: boolean;
  message: string;
  status?: 'ok_password' | 'locked' | 'invalid';
  method?: 'token' | 'otp';
}

interface TokenVerifyResponse {
  success: boolean;
  message: string;
  status?: 'ok' | 'invalid' | 'expired';
}

interface AuthContextType {
  login: (username: string, password: string) => Promise<LoginResponse>;
  verifyToken: (username: string, token: string) => Promise<TokenVerifyResponse>;
  resendToken: (username: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [tokenAttempts, setTokenAttempts] = useState(0);

  const login = async (username: string, password: string): Promise<LoginResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if account is locked
    if (failedAttempts >= 5) {
      return {
        success: false,
        message: 'Account locked. Please contact support.',
        status: 'locked'
      };
    }

    // Mock authentication - default credentials: admin / 12345
    if (username === 'admin' && password === '12345') {
      setFailedAttempts(0);
      return {
        success: true,
        message: 'Password verified. Please enter the 6-digit token.',
        status: 'ok_password',
        method: 'token'
      };
    }

    // Invalid credentials
    setFailedAttempts(prev => prev + 1);
    return {
      success: false,
      message: 'Invalid credentials',
      status: 'invalid'
    };
  };

  const verifyToken = async (username: string, token: string): Promise<TokenVerifyResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // Rate limiting - max 5 attempts
    if (tokenAttempts >= 5) {
      return {
        success: false,
        message: 'Too many attempts. Please try again later.',
        status: 'invalid'
      };
    }

    // Simulate expired token (token "999999")
    if (token === '999999') {
      return {
        success: false,
        message: 'Token expired.',
        status: 'expired'
      };
    }

    // Mock token verification (correct token is 123456)
    if (token === '123456') {
      setIsAuthenticated(true);
      setTokenAttempts(0);
      return {
        success: true,
        message: 'Login successful!',
        status: 'ok'
      };
    }

    // Invalid token
    setTokenAttempts(prev => prev + 1);
    return {
      success: false,
      message: 'Invalid token. Please try again.',
      status: 'invalid'
    };
  };

  const resendToken = async (username: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: 'Token resent successfully'
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setFailedAttempts(0);
    setTokenAttempts(0);
  };

  return (
    <AuthContext.Provider value={{ login, verifyToken, resendToken, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
