import { StateCreator, create, createStore } from "zustand";
import { User } from "../../interfaces";
import { AuthService } from "../../services/auth.service";
import { devtools, persist } from "zustand/middleware";

export enum AuthStatus {
  Authenticated = "Authenticated",
  NotAuthenticated = "NotAuthenticated",
  Pending = "Pending",
}

export interface AuthState {
  status: AuthStatus;
  token?: string;
  user?: User;

  loginUser: (email: string, password: string) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  logoutUser: () => void;
}

type AuthMiddlewares = [
  ["zustand/persist", unknown],
  ["zustand/devtools", never]
];

const storeApi: StateCreator<AuthState, AuthMiddlewares, []> = (set) => ({
  status: AuthStatus.Pending,
  token: undefined,
  user: undefined,

  loginUser: async (email: string, password: string) => {
    try {
      const { token, ...user } = await AuthService.login(email, password);

      set(
        { status: AuthStatus.Authenticated, token, user },
        false,
        "loginUser"
      );
    } catch (error) {
      set(
        {
          status: AuthStatus.NotAuthenticated,
          token: undefined,
          user: undefined,
        },
        false,
        "loginUser"
      );
      throw error;
    }
  },
  checkAuthStatus: async () => {
    try {
      const { token, ...user } = await AuthService.checkSession();
      set(
        { status: AuthStatus.Authenticated, token, user },
        false,
        "checkAuthStatus"
      );
    } catch (error) {
      set(
        {
          status: AuthStatus.NotAuthenticated,
          token: undefined,
          user: undefined,
        },
        false,
        "checkAuthStatus"
      );
      throw error;
    }
  },
  logoutUser: () => {
    set(
      {
        status: AuthStatus.NotAuthenticated,
        token: undefined,
        user: undefined,
      },
      false,
      "logoutUser"
    );
  },
});

const authMiddlewareWrapper = (
  f: StateCreator<AuthState, AuthMiddlewares, []>
) =>
  persist(devtools(f, { name: "AuthStore" }), {
    name: "AuthStore",
    partialize: (state) =>
      Object.fromEntries(
        Object.entries(state).filter(([key]) => !["status"].includes(key))
      ),
  });

export const useAuthStore = create<AuthState>()(
  authMiddlewareWrapper(storeApi)
);
