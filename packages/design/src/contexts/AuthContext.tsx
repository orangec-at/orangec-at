'use client';

import React, {createContext, useContext, useEffect, useState, useCallback} from 'react';
import {TokenManager} from '@/utils/token-manager';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (accessToken: string, refreshToken: string, expiration?: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
  showPasswordChange: boolean;
  setShowPasswordChange: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({children}: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState<boolean>(false);

  // 초기 인증 상태 확인
  useEffect(() => {
    const tokens = TokenManager.getTokens();
    // 토큰이 만료되었으면 로그아웃 상태로 설정
    if (tokens.accessToken && tokens.refreshToken && !TokenManager.isTokenExpired()) {
      setIsAuthenticated(true);
      setAccessToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);
    } else if (tokens.accessToken && tokens.refreshToken && TokenManager.isTokenExpired()) {
      // 만료된 토큰 제거
      TokenManager.clearTokens();
      setIsAuthenticated(false);
      setAccessToken(null);
      setRefreshToken(null);
    }
  }, []);

  // 로그인
  const login = useCallback((newAccessToken: string, newRefreshToken: string, expiration?: string) => {
    TokenManager.saveTokens(newAccessToken, newRefreshToken, expiration);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setIsAuthenticated(true);
  }, []);

  // 로그아웃 (에러 발생 여부와 무관하게 무조건 실행)
  const logout = useCallback(() => {
    try {
      TokenManager.clearTokens();
    } catch (error) {
      console.warn('토큰 제거 중 에러 발생 (무시):', error);
    } finally {
      setAccessToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);
    }
  }, []);

  // 인증 상태 확인
  const checkAuth = useCallback((): boolean => {
    return TokenManager.hasTokens();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    accessToken,
    refreshToken,
    login,
    logout,
    checkAuth,
    showPasswordChange,
    setShowPasswordChange,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * AuthContext 사용 훅
 * @throws {Error} AuthProvider 외부에서 사용 시
 */
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
}
