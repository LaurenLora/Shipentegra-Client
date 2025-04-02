import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore(
  "settings",
  () => {
    const language = ref<string | null>(
      localStorage.getItem("language") || null
    );

    return {
      language
    };
  },
  {
    persist: {
      storage: localStorage,
      key: import.meta.env.VITE_PERSIST_SETTINGS_KEY
    }
  }
);
