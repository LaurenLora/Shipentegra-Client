import { createApp } from "vue";
import "./assets/style.css";
import App from "./App.vue";
import router from "./router";
import { createI18n } from "vue-i18n";
import messages from "./locales/index";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import PreLoader from "./components/PreLoader.vue";

const i18n = createI18n({
  locale: localStorage.getItem("language") || "en",
  legacy: false,
  fallbackLocale: "en",
  messages
});

const pinia = createPinia();
const app = createApp(App);

pinia.use(piniaPluginPersistedstate);

app.use(i18n);
app.use(router);
app.use(pinia);

app.mount("#app");

app.component("PreLoader", PreLoader);
