type TokenBundle = {
  accessToken: string | null;
  refreshToken: string | null;
  expiration: string | null;
};

const ACCESS_TOKEN_KEY = "orangec_access_token";
const REFRESH_TOKEN_KEY = "orangec_refresh_token";
const EXPIRATION_KEY = "orangec_token_expiration";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function read(key: string) {
  if (!canUseStorage()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  if (!canUseStorage()) return;
  try {
    if (value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, value);
    }
  } catch {
    return;
  }
}

export class TokenManager {
  static saveTokens(accessToken: string, refreshToken: string, expiration?: string) {
    write(ACCESS_TOKEN_KEY, accessToken);
    write(REFRESH_TOKEN_KEY, refreshToken);
    if (expiration) {
      write(EXPIRATION_KEY, expiration);
    }
  }

  static getTokens(): TokenBundle {
    return {
      accessToken: read(ACCESS_TOKEN_KEY),
      refreshToken: read(REFRESH_TOKEN_KEY),
      expiration: read(EXPIRATION_KEY),
    };
  }

  static clearTokens() {
    write(ACCESS_TOKEN_KEY, null);
    write(REFRESH_TOKEN_KEY, null);
    write(EXPIRATION_KEY, null);
  }

  static hasTokens() {
    const tokens = TokenManager.getTokens();
    return Boolean(tokens.accessToken && tokens.refreshToken);
  }

  static isTokenExpired() {
    const expiration = read(EXPIRATION_KEY);
    if (!expiration) return false;

    const expirationTime = Date.parse(expiration);
    if (Number.isNaN(expirationTime)) return false;

    return Date.now() >= expirationTime;
  }
}
