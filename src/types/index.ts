export type RegisterForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginForm = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  token: string;
};

export interface Category {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  status: "active" | "completed";
  category: Category;
  user: { id: string };
  trelloCardId?: string;
  trelloListId: string;
  createdAt: Date;
  path?: string;
}

export interface Filters {
  startDate: string | null;
  endDate: string | null;
  status: "active" | "completed" | null;
  category: string | null;
  priority: "high" | "medium" | "low" | null;
}

export interface PaginationResponse {
  tasks: Task[];
  count: number;
}

export interface CreateTask {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "active" | "completed";
  category: Category;
  trelloListId: string;
  userId: string;
}

export interface UpdateTask {
  id: string;
  title?: string;
  description?: string;
  priority?: "high" | "medium" | "low";
  status?: "active" | "completed";
  categoryId?: string;
  trelloListId?: string;
}
export interface TrelloList {
  id: string;
  name: string;
  closed: boolean;
  idBoard: string;
}
