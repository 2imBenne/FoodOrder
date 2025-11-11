import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { User } from "../types";
import {
  AuthResponse,
  fetchProfile,
  login as loginRequest,
  refreshSession,
  register as registerRequest,
} from "../services/auth";
import { api, setAccessToken } from "../services/api";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  }) => Promise<void>;
  logout: () => void;
  ready: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "foodorder.tokens";

type PersistedTokens = {
  accessToken: string;
  refreshToken: string;
};

const storeTokens = (payload: AuthResponse) => {
  setAccessToken(payload.accessToken);
  localStorage.setItem(
    TOKEN_KEY,
    JSON.stringify({
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    })
  );
};

const loadTokens = (): PersistedTokens | null => {
  const raw = localStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PersistedTokens;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<PersistedTokens | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = loadTokens();
    if (saved) {
      setTokens(saved);
      setAccessToken(saved.accessToken);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!tokens?.accessToken) {
      setUser(null);
      return;
    }

    fetchProfile()
      .then((res) => setUser(res.user))
      .catch(() => {
        setUser(null);
      });
  }, [tokens?.accessToken]);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        if (
          error.response?.status === 401 &&
          tokens?.refreshToken &&
          !error.config?._retry
        ) {
          error.config._retry = true;
          try {
            const refreshed = await refreshSession(tokens.refreshToken);
            storeTokens(refreshed);
            setTokens({
              accessToken: refreshed.accessToken,
              refreshToken: refreshed.refreshToken,
            });
            error.config.headers.Authorization = `Bearer ${refreshed.accessToken}`;
            return api.request(error.config);
          } catch {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens?.refreshToken]);

  const handleAuthSuccess = useCallback((payload: AuthResponse) => {
    storeTokens(payload);
    setTokens({
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    });
    setUser(payload.user);
  }, []);

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      setLoading(true);
      try {
        const data = await loginRequest(credentials);
        handleAuthSuccess(data);
      } finally {
        setLoading(false);
      }
    },
    [handleAuthSuccess]
  );

  const register = useCallback(
    async (payload: {
      name: string;
      email: string;
      password: string;
      phone: string;
      address: string;
    }) => {
      setLoading(true);
      try {
        const data = await registerRequest(payload);
        handleAuthSuccess(data);
      } finally {
        setLoading(false);
      }
    },
    [handleAuthSuccess]
  );

  const logout = useCallback(() => {
    setUser(null);
    setTokens(null);
    setAccessToken(null);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      ready,
    }),
    [user, loading, login, register, logout, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
};
