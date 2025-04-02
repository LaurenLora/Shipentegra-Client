<template>
  <div class="container mx-auto px-4 py-8">
    <div
      class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <h1 class="text-3xl font-bold text-gray-800">{{ $t("title") }}</h1>
      <button
        @click="showAddTaskModal = true"
        class="bg-orange-550 hover:bg-orange-600 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 flex items-center gap-2">
        {{ $t("addTask") }}
      </button>
    </div>
    <TaskFilter @update:filters="updateFilters" />
    <div>
      <div
        v-if="taskStore.tasks.length === 0"
        class="bg-white rounded-xl shadow-sm p-8 text-center">
        <div class="mx-auto max-w-md">
          <h3 class="mt-4 text-2xl font-medium text-gray-900">
            {{ $t("task.noTasks") }}
          </h3>
          <p class="mt-2 text-gray-500">
            {{ $t("task.noTasksDescription") }}
          </p>
          <button
            @click="showAddTaskModal = true"
            class="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
            {{ $t("addTask") }}
          </button>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div
          v-for="(task, index) in filteredTasks"
          :key="'TASKITEM_' + index"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border-l-4"
          :class="{
            'border-red-500': task.priority === 'high',
            'border-orange-550': task.priority === 'medium',
            'border-green-500': task.priority === 'low',
            'opacity-75': task.status === 'completed'
          }">
          <div class="p-6">
            <div class="flex justify-between items-start">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">
                {{ task.title }}
              </h3>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="{
                  'bg-green-100 text-green-800': task.status === 'completed',
                  'bg-blue-100 text-blue-800': task.status === 'active'
                }">
                {{ $t(task.status) }}
              </span>
            </div>

            <p
              v-if="task.description"
              class="text-gray-600 mt-2 mb-4 line-clamp-2">
              {{ task.description }}
            </p>

            <div class="mt-4 space-y-2">
              <div class="flex items-center text-sm gap-2 text-gray-500">
                <span>{{ $t("category") }}:</span>
                <span>{{ task.category.name }}</span>
              </div>

              <div class="flex items-center text-sm gap-2 text-gray-500">
                <span>{{ $t("startDate") }}:</span
                ><span> {{ formatDate(task.createdAt) }}</span>
              </div>

              <div class="flex items-center text-sm gap-2 text-gray-500">
                <span>{{ $t("priority") }}:</span
                ><span>{{ $t(task.priority) }}</span>
              </div>
              <div class="flex items-center text-sm gap-2 text-gray-500">
                <span>Trello List:</span
                ><span>{{
                  $t(
                    `trelloLists.${taskStore.getTrelloListName(
                      task.trelloListId
                    )}`
                  )
                }}</span>
              </div>
            </div>
            <a
              target="_blank"
              v-if="task.path"
              :href="'http://localhost:3000/' + task.path"
              class="cursor-pointer">
              <img
                :src="'http://localhost:3000/' + task.path"
                alt="Task Image"
                class="mt-4 rounded-lg w-[200px] h-[100px]" />
            </a>

            <div class="mt-6 flex justify-end space-x-2">
              <button
                @click="markAsCompleted(task.id)"
                v-if="task.status !== 'completed'"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                {{ $t("task.complete") }}
              </button>
              <button
                @click="deleteTask(task.id)"
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                {{ $t("task.delete") }}
              </button>
              <button
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded bg-orange-550 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                @click="openEditModal(task)">
                Edit Modal
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="taskStore.totalPages > 1"
        class="mt-8 flex items-center justify-center">
        <div class="flex-1 flex justify-center items-center sm:hidden">
          <button
            :disabled="!taskStore.hasPreviousPage || taskStore.loading"
            @click="changePage(taskStore.pagination.page - 1)"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            {{ $t("previous") }}
          </button>
          <button
            :disabled="!taskStore.hasNextPage || taskStore.loading"
            @click="changePage(taskStore.pagination.page + 1)"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            {{ $t("next") }}
          </button>
        </div>
        <div
          class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <nav
              class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination">
              <button
                :disabled="!taskStore.hasPreviousPage || taskStore.loading"
                @click="changePage(taskStore.pagination.page - 1)"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <span>{{ $t("previous") }}</span>
              </button>
              <button
                :disabled="!taskStore.hasNextPage || taskStore.loading"
                @click="changePage(taskStore.pagination.page + 1)"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <span>{{ $t("next") }}</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <AddTaskModal
      :is-open="showAddTaskModal"
      @close="showAddTaskModal = false"
      @task-added="handleTaskAdded" />

    <EditTaskModal
      :is-open="showEditTaskModal"
      :task="selectedTask"
      @close="showEditTaskModal = false"
      @submit="handleTaskUpdated" />
  </div>
</template>

<script lang="ts" setup>
import { useTaskStore } from "../../store/useTasksStore";
import { useAuthStore } from "../../store/useAuthStore";
import { computed, onMounted, ref } from "vue";
import AddTaskModal from "./AddTaskModal.vue";
import EditTaskModal from "./EditTaskModal.vue";
import type { Task } from "../../types";
import TaskFilter from "./TaskFilter.vue";

const taskStore = useTaskStore();
const authStore = useAuthStore();
const showAddTaskModal = ref(false);
const showEditTaskModal = ref(false);

const selectedTask = ref<Task | null>(null);
const filters = ref({
  status: "",
  priority: "",
  category: ""
});

const updateFilters = (newFilters: {
  status: string;
  priority: string;
  category: string;
}) => {
  filters.value = { ...newFilters };
};
const filteredTasks = computed(() => {
  let result = [...taskStore.tasks];

  if (filters.value.status) {
    result = result.filter((task) => task.status === filters.value.status);
  }

  if (filters.value.priority) {
    result = result.filter((task) => task.priority === filters.value.priority);
  }

  if (filters.value.category) {
    result = result.filter(
      (task) => task.category.id === filters.value.category
    );
  }

  return result;
});

const handleTaskUpdated = (updatedTask: Task) => {
  const index = taskStore.tasks.findIndex((t: any) => t.id === updatedTask.id);
  if (index !== -1) {
    taskStore.tasks[index] = updatedTask;
  }
};

const openEditModal = (task: Task) => {
  console.log(task);
  selectedTask.value = task;
  showEditTaskModal.value = true;
};

const formatDate = (dateString: Date) => {
  return new Date(dateString).toLocaleDateString();
};

const changePage = (newPage: number) => {
  if (authStore.user?.id) {
    taskStore.changePage(authStore.user.id, newPage);
  }
};

const markAsCompleted = async (taskId: string) => {
  if (authStore.user?.id) {
    await taskStore.setTaskCompleted(taskId);
    taskStore.fetchTasks(authStore.user.id);
  }
};

const deleteTask = async (taskId: string) => {
  if (authStore.user?.id) {
    await taskStore.deleteTask(taskId);
    taskStore.fetchTasks(authStore.user.id);
  }
};

const handleTaskAdded = () => {
  if (authStore.user?.id) {
    taskStore.fetchTasks(authStore.user.id);
  }
};

onMounted(() => {
  if (authStore.user?.id) {
    taskStore.fetchTasks(authStore.user.id);
  }
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
