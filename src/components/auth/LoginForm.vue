<template>
  <div class="w-full flex justify-center items-center">
    <div
      class="p-8 border rounded-xl xl:w-1/3 w-full max-w-md text-white bg-blue-550/90 shadow-lg">
      <h1 class="text-2xl text-center mb-8 font-semibold">
        {{ $t("login") }}
      </h1>

      <form @submit.prevent="submitForm" class="flex flex-col gap-5">
        <div>
          <label for="email" class="block text-sm font-medium mb-1">{{
            $t("email")
          }}</label>
          <input
            v-model="loginForm.email"
            type="email"
            id="email"
            autocomplete="off"
            class="block w-full p-3 border rounded-md bg-blue-550/20 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-orange-550 focus:border-orange-550 focus:outline-none transition-all"
            :placeholder="$t('email')"
            :disabled="isSubmitting" />
          <p v-if="err.email" class="text-red-400 text-xs mt-1">
            {{ err.email }}
          </p>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium mb-1">{{
            $t("password")
          }}</label>
          <input
            v-model="loginForm.password"
            type="password"
            id="password"
            autocomplete="off"
            class="block w-full p-3 border rounded-md bg-blue-550/20 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-orange-550 focus:border-orange-550 focus:outline-none transition-all"
            minlength="6"
            :placeholder="$t('password')"
            :disabled="isSubmitting" />
          <p v-if="err.password" class="text-red-400 text-xs mt-1">
            {{ err.password }}
          </p>
        </div>

        <button
          type="submit"
          class="w-full bg-orange-550 p-3 rounded-md text-white font-medium hover:bg-orange-600 transition-colors flex items-center justify-center"
          :disabled="isSubmitting">
          <span v-if="!isSubmitting">{{ $t("login") }}</span>
          <span v-else class="flex items-center gap-2">
            <svg
              class="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h-8z"></path>
            </svg>
            {{ $t("submitting") }}
          </span>
        </button>
      </form>

      <p class="text-center mt-4 text-sm">
        {{ $t("no-account") }}
        <router-link to="/register" class="text-orange-400 hover:underline">{{
          $t("register")
        }}</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import type { LoginForm } from "../../types";
import { useAuthStore } from "../../store/useAuthStore";

const router = useRouter();
const authStore = useAuthStore();

const loginForm = ref<LoginForm>({
  email: "",
  password: ""
});

const err = ref({
  email: "",
  password: ""
});

const isSubmitting = ref(false);

const submitForm = async () => {
  err.value = {
    email: "",
    password: ""
  };

  if (!loginForm.value.email) {
    err.value.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(loginForm.value.email)) {
    err.value.email = "Invalid email format";
  }
  if (!loginForm.value.password) {
    err.value.password = "Password is required";
  } else if (loginForm.value.password.length < 6) {
    err.value.password = "Password must be at least 6 characters";
  }

  if (!err.value.email && !err.value.password) {
    isSubmitting.value = true;
    try {
      await authStore.login({
        email: loginForm.value.email,
        password: loginForm.value.password
      });

      router.push("/dashboard");
    } catch (error: any) {
      const errorMsg = error.message || "Login failed";
      if (errorMsg.includes("Invalid")) {
        err.value.email = "Invalid email or password";
      } else {
        err.value.email = errorMsg;
      }
    } finally {
      isSubmitting.value = false;
    }
  }
};
</script>

<style scoped>
input:-webkit-autofill,
input:-webkit-autofill:focus {
  background-color: rgba(30, 64, 175, 0.2) !important;
  color: white !important;
  -webkit-text-fill-color: white !important;
  transition: background-color 5000s ease-in-out 0s;
}
</style>
