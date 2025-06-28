/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "./User";
import { apiRequest } from "../../service/api-request/apiRequest";
import { ApiResponse } from "../../service/api-request/ApiResponse";

type AuthResponse = {
  user: User;
  token: string;
};
export const TOKEN_LOCAL_STORAGE_KEY = "ship-sail-user-token";

// Create the context
type AuthContextType = {
  user: User | "guest" | null;
  login: (
    email: string,
    password: string
  ) => Promise<ApiResponse<AuthResponse>>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<ApiResponse<AuthResponse>>;
  logout: () => Promise<ApiResponse<object>>;
};
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Create a provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | "guest" | null>(null);

  useEffect(() => {
    apiRequest<AuthResponse>("/auth/user", null, { method: "GET" })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser("guest"));
  }, []);

  const login = (email: string, password: string) =>
    apiRequest<AuthResponse>("/auth/login", { email, password }).then((res) => {
      setUser(res.data.user);
      localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, res.data.token);
      return res;
    });

  const register = (name: string, email: string, password: string) =>
    apiRequest<AuthResponse>("/auth/register", { name, email, password }).then(
      (res) => {
        setUser(res.data.user);
        localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, res.data.token);
        return res;
      }
    );

  const logout = () =>
    apiRequest<object>("/auth/logout").then((res) => {
      setUser("guest");
      return res;
    });

  const value = {
    user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

// Default export for the custom hook
export default useAuth;
