<template>
  <div class="bg-white rounded-xl shadow-md p-6 mb-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">
      {{ $t("filter.filterTasks") }}
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{
          $t("status")
        }}</label>
        <select
          v-model="localFilters.status"
          @change="emitFilters"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
          <option value="">{{ $t("filter.all") }}</option>
          <option value="active">{{ $t("active") }}</option>
          <option value="completed">{{ $t("completed") }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{
          $t("priority")
        }}</label>
        <select
          v-model="localFilters.priority"
          @change="emitFilters"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
          <option value="">{{ $t("filter.all") }}</option>
          <option value="high">{{ $t("high") }}</option>
          <option value="medium">{{ $t("medium") }}</option>
          <option value="low">{{ $t("low") }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{
          $t("category")
        }}</label>
        <select
          v-model="localFilters.category"
          @change="emitFilters"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
          <option value="">{{ $t("filter.all") }}</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id">
            {{ $t(`categories.${category.name}`) }}
          </option>
        </select>
      </div>
    </div>

    <button
      @click="resetFilters"
      class="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
      {{ $t("filter.clearFilters") }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useTaskStore } from "../../store/useTasksStore";

const emit = defineEmits(["update:filters"]);
const taskStore = useTaskStore();

const localFilters = ref({
  status: "",
  priority: "",
  category: ""
});

const categories = computed(() => taskStore.categories);

const emitFilters = () => {
  emit("update:filters", { ...localFilters.value });
};

const resetFilters = () => {
  localFilters.value = { status: "", priority: "", category: "" };
  emit("update:filters", { ...localFilters.value });
};

onMounted(() => {});
</script>
