import { defineStore } from "pinia";
import { ref } from "vue";
import type { LoginForm, User } from "../types";
import { API } from "../plugins/axios";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const user = ref<User | null>(null);
    const isAuthenticated = ref(false);
    const token = ref<string | null>(localStorage.getItem("token") || null);

    if (token.value) {
      isAuthenticated.value = true;
    }

    async function login(credentials: LoginForm) {
      try {
        const response = await API.post("/auth/login", credentials);
        token.value = response.data.access_token;
        user.value = response.data.user;

        if (token.value) {
          localStorage.setItem("token", token.value);
          isAuthenticated.value = true;
        }
      } catch (error: any) {
        token.value = null;
        user.value = null;
        isAuthenticated.value = false;
        localStorage.removeItem("token");
        throw new Error(error.response?.data?.message || "Login failed");
      }
    }

    async function register(credentials: LoginForm) {
      try {
        const response = await API.post("/users/register", credentials);
        token.value = response.data.access_token;
        user.value = response.data.user;

        if (token.value) {
          localStorage.setItem("token", token.value);
          isAuthenticated.value = true;
        }
      } catch (error: any) {
        token.value = null;
        user.value = null;
        isAuthenticated.value = false;
        localStorage.removeItem("token");
        throw new Error(error.response?.data?.message || "Registration failed");
      }
    }

    async function logout() {
      try {
        token.value = null;
        user.value = null;
        isAuthenticated.value = false;
        localStorage.removeItem("token");
      } catch (error: any) {
        console.error(
          "Logout failed:",
          error.response?.data?.message || error.message
        );
      }
    }

    return {
      user,
      isAuthenticated,
      token,
      login,
      register,
      logout
    };
  },
  {
    persist: {
      key: import.meta.env.VITE_PERSIST_AUTH_KEY,
      storage: localStorage
    }
  }
);
