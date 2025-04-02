<template>
  <div class="w-full h-full flex flex-col items-center justify-center">
    <div class="text-5xl text-red-500 p-4">
      <h1>Not Found Page</h1>
    </div>
    <div>
      <div class="w-full text-white flex gap-5 mt-2">
        <button class="p-4 bg-blue-500 rounded-xl" @click="goMainPage">
          Go Main Page
        </button>
        <button class="p-4 bg-blue-500 rounded-xl" @click="goBack">
          Go back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/useAuthStore";
import { useSettingsStore } from "../store/useSettingsStore";

const router = useRouter();
const authStore = useAuthStore();

const settingsStore = useSettingsStore();

console.log(settingsStore.language);

console.log(authStore.user);

const goMainPage = () => {
  router.push("/dashboard");
};

const goBack = () => {
  router.back();
};
</script>
