// stores/useTasksStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { AuthAPI } from "../plugins/axios";
import type {
  Category,
  CreateTask,
  Task,
  TrelloList,
  UpdateTask
} from "../types";
import { acceptedSize, acceptedType } from "../utils/helper";

export const useTaskStore = defineStore("tasks", () => {
  const tasks = ref<Task[]>([]);
  const currentTask = ref<Task | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const categories = ref<Category[]>([]);
  const trelloLists = ref<TrelloList[]>([]);
  const filteredTasks = ref<Task[]>([]);
  const pagination = ref({
    page: 1,
    limit: 5,
    total: 0
  });

  const totalPages = computed(() =>
    Math.ceil(pagination.value.total / pagination.value.limit)
  );
  const hasNextPage = computed(() => pagination.value.page < totalPages.value);
  const hasPreviousPage = computed(() => pagination.value.page > 1);

  const getTrelloListName = computed(() => (listId: string) => {
    const list = trelloLists.value.find((list) => list.id === listId);
    return list ? list.name.toLowerCase().replace(" ", "") : "";
  });

  const fetchTasks = async (userId: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await AuthAPI.get<{ tasks: Task[]; count: number }>(
        `/tasks/tasks/${userId}`,
        {
          params: {
            page: pagination.value.page,
            limit: pagination.value.limit
          }
        }
      );

      tasks.value = response.data.tasks;
      pagination.value.total = response.data.count;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to fetch tasks";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchTaskById = async (taskId: string) => {
    loading.value = true;
    try {
      const response = await AuthAPI.get<Task>(`/tasks/${taskId}`);
      currentTask.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to fetch task";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getTrelloLists = async () => {
    try {
      const response = await AuthAPI.get<TrelloList[]>("/trello/lists");
      trelloLists.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value =
        err.response?.data?.message || "Failed to fetch Trello lists";
      throw err;
    }
  };

  const uploadThumbnail = async (taskId: string, file: File) => {
    if (!file) return;

    if (!acceptedType.includes(file.type)) {
      error.value = "Invalid file type. Only JPEG and PNG are allowed";
      return false;
    }

    if (file.size > acceptedSize) {
      error.value = "File size exceeds 2MB limit";
      return false;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await AuthAPI.post<Task>(
        `/tasks/thumbnail/${taskId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      const index = tasks.value.findIndex((t) => t.id === taskId);
      if (index !== -1) {
        tasks.value[index] = response.data;
      }
      console.log(response.data);

      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to upload thumbnail";
      throw err;
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await AuthAPI.get<Category[]>("/categories");
      categories.value = response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to fetch categories";
      throw err;
    }
  };

  const createTask = async (taskData: CreateTask) => {
    loading.value = true;
    try {
      const response = await AuthAPI.post<Task>("/tasks", taskData);
      tasks.value.unshift(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to create task";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const setTaskCompleted = async (taskId: string) => {
    try {
      const response = await AuthAPI.patch<Task>(`/tasks/${taskId}/complete`);

      const index = tasks.value.findIndex((t) => t.id === taskId);
      if (index !== -1) {
        tasks.value[index] = response.data;
      }

      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to complete task";
      throw err;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await AuthAPI.delete(`/tasks/${taskId}`);
      tasks.value = tasks.value.filter((task) => task.id !== taskId);

      if (currentTask.value?.id === taskId) {
        currentTask.value = null;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to delete task";
      throw err;
    }
  };

  const updateTask = async (taskId: string, taskData: UpdateTask) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await AuthAPI.patch<Task>(`/tasks/${taskId}`, taskData);

      const index = tasks.value.findIndex((t) => t.id === taskId);
      if (index !== -1) {
        tasks.value[index] = response.data;
      }

      if (currentTask.value?.id === taskId) {
        currentTask.value = response.data;
      }

      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to update task";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const changePage = async (userId: string, newPage: number) => {
    if (newPage < 1 || newPage > totalPages.value) return;
    pagination.value.page = newPage;
    await fetchTasks(userId);
  };

  const changeLimit = async (userId: string, newLimit: number) => {
    pagination.value.limit = newLimit;
    pagination.value.page = 1;
    await fetchTasks(userId);
  };

  return {
    tasks,
    currentTask,
    loading,
    error,
    pagination,
    categories,
    trelloLists,
    filteredTasks,

    totalPages,
    hasNextPage,
    hasPreviousPage,
    getTrelloListName,

    fetchTasks,
    fetchTaskById,
    getTrelloLists,
    updateTask,
    uploadThumbnail,
    fetchCategories,
    createTask,
    setTaskCompleted,
    deleteTask,
    changePage,
    changeLimit
  };
});
