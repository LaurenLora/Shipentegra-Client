<template>
  <PreLoader v-if="isLoading" />
  <div class="xl:px-24 px-10">
    <Header />
    <router-view :key="$route.path" />
  </div>
</template>

<script setup lang="ts">
import Header from "./components/ui/Header.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const isLoading = ref(false);
const router = useRouter();

router.beforeEach((to, from, next) => {
  isLoading.value = true;
  next();
});

router.afterEach(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
});

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
});
</script>
