<template>
  <transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 backdrop-blur-2xl bg-opacity-50 flex justify-center items-center z-[1000]">
      <div
        class="bg-white rounded-lg w-[90%] max-w-[450px] shadow-lg overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title">
        <div
          class="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 id="modal-title" class="m-0 text-xl text-gray-800">
            {{ $t("newTask") }}
          </h2>
          <button
            @click="closeModal"
            class="bg-transparent border-none text-2xl cursor-pointer text-gray-500 hover:text-gray-800 p-2"
            aria-label="Modalı kapat">
            ×
          </button>
        </div>

        <div class="p-5">
          <div class="mb-4">
            <label
              for="title-input"
              class="block mb-2 font-medium text-gray-700">
              {{ $t("task.title") }}
            </label>
            <input
              id="title-input"
              ref="inputField"
              v-model="taskData.title"
              type="text"
              :placeholder="$t('newTaskInputTitle')"
              class="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              maxlength="100"
              autofocus />
          </div>

          <div class="mb-4">
            <label
              for="description-input"
              class="block mb-2 font-medium text-gray-700">
              {{ $t("task.description") }}
            </label>
            <textarea
              id="description-input"
              v-model="taskData.description"
              class="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 min-h-[80px] resize-y"
              :placeholder="$t('task.description')"></textarea>
          </div>

          <div class="mb-4">
            <label
              for="priority-select"
              class="block mb-2 font-medium text-gray-700">
              {{ $t("priority") }}
            </label>
            <select
              id="priority-select"
              v-model="taskData.priority"
              class="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              <option value="low">{{ $t("low") }}</option>
              <option value="medium">{{ $t("medium") }}</option>
              <option value="high">{{ $t("high") }}</option>
            </select>
          </div>

          <div class="mb-4">
            <label
              for="category-select"
              class="block mb-2 font-medium text-gray-700">
              {{ $t("category") }}
            </label>
            <select
              id="category-select"
              v-model="taskData.category"
              class="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category">
                {{ $t("categories." + category.name) }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label
              for="trello-select"
              class="block mb-2 font-medium text-gray-700">
              {{ $t("trelloList") }}
            </label>
            <select
              id="trello-select"
              @change.prevent
              v-model="taskData.trelloListId"
              class="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              <option
                v-for="(item, index) in trelloList"
                :key="'TRELLOITEM_' + index"
                :value="item.id">
                {{ $t(item.name) }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label
              for="status-select"
              class="block mb-2 font-medium text-gray-700">
              {{ $t("status") }}
            </label>
            <select
              id="status-select"
              v-model="taskData.status"
              class="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              <option value="active">{{ $t("active") }}</option>
              <option value="completed">{{ $t("completed") }}</option>
            </select>
          </div>
          <div class="mb-4">
            <button
              @click="openFileInput"
              class="px-4 py-2 bg-blue-500 w-full text-white rounded-md font-medium hover:bg-blue-600 transition-colors">
              {{ $t("task.uploadFile") }}
            </button>
            <input
              type="file"
              class="hidden"
              ref="fileInput"
              @change="handleFileChange" />
            <p v-if="file" class="mt-2 text-sm text-gray-600">
              Selected file: {{ file.name }}
            </p>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors">
              {{ $t("task.cancel") }}
            </button>
            <button
              type="button"
              @click="() => handleSubmit()"
              class="px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              :disabled="!taskData.title.trim()">
              {{ $t("task.add") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, computed, onMounted } from "vue";
import { useAuthStore } from "../../store/useAuthStore";
import { useTaskStore } from "../../store/useTasksStore";
import type { Ref } from "vue";
import type { Category } from "../../types";

interface TaskData {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  trelloListId: string;
  category: Category | null;
  status: "active" | "completed";
  userId: string;
}

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit", data: any): void;
}>();

const authStore = useAuthStore();
const taskStore = useTaskStore();
const fileInput: Ref<HTMLInputElement | null> = ref(null);
const file: Ref<File | null> = ref(null);
const isLoading = ref(false);
const categories = computed(() => taskStore.categories);
const trelloList = computed(() => taskStore.trelloLists);

const taskData: Ref<TaskData> = ref({
  title: "",
  description: "",
  priority: "medium",
  trelloListId: "",
  category: null,
  status: "active",
  userId: authStore.user?.id || ""
});

const inputField: Ref<HTMLInputElement | null> = ref(null);

const openFileInput = (): void => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileChange = (event: Event): void => {
  file.value = (event.target as HTMLInputElement).files?.[0] || null;
};

const loadCategories = async (): Promise<void> => {
  try {
    await taskStore.fetchCategories();
    if (categories.value.length > 0) {
      taskData.value.category = categories.value[0];
    }
  } catch (error) {
    console.error("err category", error);
  }
};

onMounted(async (): Promise<void> => {
  await loadCategories();
  await taskStore.getTrelloLists();
});

watch(
  () => props.isOpen,
  async (isOpen: boolean): Promise<void> => {
    if (isOpen) {
      taskData.value.userId = authStore.user?.id || "";
      await nextTick(() => {
        inputField.value?.focus();
      });
    } else {
      taskData.value = {
        title: "",
        description: "",
        priority: "medium",
        trelloListId: "",
        category: categories.value?.[0] || null,
        status: "active",
        userId: authStore.user?.id || ""
      };
    }
  }
);

const closeModal = (): void => {
  console.log("Modal kapatılıyor...");
  emit("close");
};

const handleSubmit = async (): Promise<void> => {
  if (isLoading.value) return;

  if (!taskData.value.title.trim() || !taskData.value.category) {
    return;
  }

  isLoading.value = true;

  try {
    const createdTask = await taskStore.createTask({
      ...taskData.value,
      category: taskData.value.category
    });

    if (file.value && createdTask?.id) {
      try {
        await taskStore.uploadThumbnail(createdTask.id, file.value);
        closeModal();
      } catch (uploadError) {
        console.error("Dosya yükleme hatası:", uploadError);
        throw uploadError;
      }
    }

    emit("submit", createdTask);
    closeModal();
  } catch (error) {
    console.error("Task oluşturma hatası:", error);
  } finally {
    isLoading.value = false;
    file.value = null;
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
