<template>
  <transition name="fade">
    <div
      v-if="isOpen"
      class="fixed top-0 left-0 right-0 backdrop-blur-2xl bottom-0 bg-opacity-50 flex justify-center items-center z-50">
      <div
        class="bg-white rounded-lg w-full max-w-[450px] shadow-md overflow-hidden">
        <div
          class="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 class="m-0 text-xl text-gray-800">{{ $t("editTask") }}</h2>
          <button
            @click="closeModal"
            class="bg-none border-none text-lg cursor-pointer text-gray-600 px-2 hover:text-gray-800"
            aria-label="Modalı kapat">
            ×
          </button>
        </div>

        <div class="p-5">
          <div class="mb-4">
            <label
              for="title-input"
              class="block mb-2 font-medium text-gray-700"
              >{{ $t("task.title") }}</label
            >
            <input
              id="title-input"
              ref="inputField"
              v-model="formData.title"
              type="text"
              :placeholder="$t('editTaskInputTitle')"
              class="w-full p-2 border border-gray-300 rounded-md text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
              maxlength="100"
              autofocus />
          </div>

          <div class="mb-4">
            <label for="description-input" class="block mb-2 text-gray-700">{{
              $t("task.description")
            }}</label>
            <textarea
              id="description-input"
              v-model="formData.description"
              class="w-full p-2 border border-gray-300 rounded-md text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              :placeholder="$t('task.description')"></textarea>
          </div>

          <div class="mb-4">
            <label for="priority-select" class="block mb-2 text-gray-700">{{
              $t("priority")
            }}</label>
            <select
              id="priority-select"
              v-model="formData.priority"
              class="w-full p-2 border border-gray-300 rounded-md text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required>
              <option value="low">{{ $t("low") }}</option>
              <option value="medium">{{ $t("medium") }}</option>
              <option value="high">{{ $t("high") }}</option>
            </select>
          </div>

          <div class="mb-4">
            <label for="category-select" class="block mb-2 text-gray-700">{{
              $t("category")
            }}</label>
            <select
              id="category-select"
              v-model="formData.categoryId"
              class="w-full p-2 border border-gray-300 rounded-md text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required>
              <option value="" disabled>{{ $t("selectCategory") }}</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label for="trello-list-select" class="block mb-2 text-gray-700">{{
              $t("trelloList")
            }}</label>
            <select
              id="trello-list-select"
              v-model="formData.trelloListId"
              class="w-full p-2 border border-gray-300 rounded-md text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              :disabled="formData.status === 'completed'">
              <option value="" disabled>{{ $t("selectList") }}</option>
              <option
                v-for="item in trelloList"
                :key="item.id"
                :value="item.id">
                {{ item.name }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label for="status-select" class="block mb-2 text-gray-700">{{
              $t("status")
            }}</label>
            <select
              id="status-select"
              v-model="formData.status"
              class="w-full p-2 border border-gray-300 rounded-md text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              :disabled="originalStatus === 'completed'">
              <option value="active">{{ $t("active") }}</option>
              <option value="completed">{{ $t("completed") }}</option>
            </select>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100">
              {{ $t("cancel") }}
            </button>
            <button
              type="button"
              @click="handleSubmit"
              class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              :disabled="isSubmitting || !isFormValid">
              <span v-if="isSubmitting">{{ $t("saving") }}...</span>
              <span v-else>{{ $t("save") }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, nextTick, computed } from "vue";
import { useTaskStore } from "../../store/useTasksStore";
import { useAuthStore } from "../../store/useAuthStore";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  task: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(["close", "submit"]);

const taskStore = useTaskStore();
const authStore = useAuthStore();

const isSubmitting = ref(false);
const originalStatus = ref("");

const formData = ref({
  id: "",
  title: "",
  description: "",
  priority: "medium",
  trelloListId: "",
  categoryId: "",
  status: "active"
});

const categories = computed(() => taskStore.categories);
const trelloList = computed(() => taskStore.trelloLists);
const isFormValid = computed(() => {
  return formData.value.title.trim() && formData.value.categoryId;
});

const inputField = ref(null);

const loadRequiredData = async () => {
  try {
    await Promise.all([
      taskStore.fetchCategories(),
      taskStore.getTrelloLists()
    ]);
  } catch (error) {
    console.error("Data loading failed:", error);
  }
};

const resetForm = () => {
  formData.value = {
    id: "",
    title: "",
    description: "",
    priority: "medium",
    trelloListId: "",
    categoryId: "",
    status: "active"
  };
};

const initFormData = () => {
  if (props.task) {
    formData.value = {
      id: props.task.id,
      title: props.task.title,
      description: props.task.description || "",
      priority: props.task.priority,
      trelloListId: props.task.trelloListId || "",
      categoryId: props.task.category?.id || props.task.categoryId || "",
      status: props.task.status
    };
    originalStatus.value = props.task.status;
  }
};

const closeModal = () => {
  emit("close");
};

const handleSubmit = async () => {
  if (!isFormValid.value || isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    const updateData = {
      title: formData.value.title,
      description: formData.value.description,
      priority: formData.value.priority,
      trelloListId: formData.value.trelloListId,
      categoryId: formData.value.categoryId,
      status: formData.value.status
    };

    const updatedTask = await taskStore.updateTask(
      formData.value.id,
      updateData
    );
    emit("submit", updatedTask);
    closeModal();
  } catch (error) {
    console.error("Task update failed:", error);
  } finally {
    isSubmitting.value = false;
  }
};

watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen) {
      await loadRequiredData();
      initFormData();
      nextTick(() => {
        inputField.value?.focus();
      });
    } else {
      resetForm();
    }
  },
  { immediate: true }
);
</script>
