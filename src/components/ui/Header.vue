<template>
  <div class="w-full flex justify-between items-center h-20 px-4">
    <div class="flex-shrink-0">
      <img
        src="@/assets/se-logo.svg"
        alt="Logo"
        class="w-40 h-40 object-contain" />
    </div>

    <div class="hidden lg:flex items-center gap-4">
      <select
        v-model="settingsStore.language"
        class="lang-select bg-gray-100 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-550">
        <option value="tr">TR</option>
        <option value="en">EN</option>
      </select>

      <div class="flex gap-3">
        <template v-if="!isAuth">
          <button
            class="bg-blue-550 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            @click="goToLogin">
            {{ $t("login") }}
          </button>
          <button
            class="bg-transparent border border-blue-550 text-blue-550 px-4 py-2 rounded hover:bg-blue-50 transition-colors"
            @click="goToRegister">
            {{ $t("register") }}
          </button>
        </template>
        <button
          v-else
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          @click="logout">
          {{ $t("logout") }}
        </button>
      </div>
    </div>

    <button
      @click="isMenuOpen = !isMenuOpen"
      class="lg:hidden text-gray-700 focus:outline-none">
      <svg
        v-if="!isMenuOpen"
        class="w-8 h-8"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4 6h16M4 12h16m-7 6h7"></path>
      </svg>
      <svg
        v-else
        class="w-8 h-8"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>

    <div
      v-show="isMenuOpen"
      class="absolute top-20 right-0 w-48 bg-white shadow-md rounded-md lg:hidden flex flex-col items-start gap-2 p-4">
      <select
        v-model="settingsStore.language"
        class="w-full bg-gray-100 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-550">
        <option value="tr">TR</option>
        <option value="en">EN</option>
      </select>

      <template v-if="!isAuth">
        <button
          class="w-full bg-blue-550 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          @click="goToLogin">
          {{ $t("login") }}
        </button>
        <button
          class="w-full bg-transparent border border-blue-550 text-blue-550 px-4 py-2 rounded hover:bg-blue-50 transition-colors"
          @click="goToRegister">
          {{ $t("register") }}
        </button>
      </template>
      <button
        v-else
        class="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        @click="logout">
        {{ $t("logout") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "../../store/useAuthStore";
import { ref, computed, watch } from "vue";
import { useSettingsStore } from "../../store/useSettingsStore";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();

const isMenuOpen = ref(false);

const isAuth = computed(() => authStore.isAuthenticated);
const router = useRouter();

const goToLogin = () => router.push("/login");
const goToRegister = () => router.push("/register");
const logout = () => {
  authStore.logout();
  router.push("/login");
};

watch(
  () => settingsStore.language,
  (newLang) => {
    locale.value = newLang ?? "en";
    localStorage.setItem("language", newLang ?? "en");
  }
);
</script>

<style scoped>
.lang-select {
  min-width: 60px;
}
</style>
