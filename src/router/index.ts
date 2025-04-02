import {
  createWebHistory,
  createRouter,
  type RouteRecordRaw
} from "vue-router";
import Home from "../views/Home.vue";
import Register from "../views/Auth/Register.vue";
import Login from "../views/Auth/Login.vue";
import NotFound from "../views/NotFound.vue";

const homePage: RouteRecordRaw = {
  path: "/",
  name: "Homepage",
  component: Home
};

const authPages: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/register",
    name: "Register",
    component: Register
  }
];

const notFoundPage: RouteRecordRaw = {
  path: "/:pathMatch(.*)*",
  name: "not-found",
  component: NotFound
};

const dashboardPage: RouteRecordRaw = {
  path: "/dashboard",
  name: "Dashboard",
  component: () => import("../views/Dashboard/Main.vue"),
  meta: {
    requiresAuth: true
  }
};

const routes: RouteRecordRaw[] = [
  homePage,
  ...authPages,
  notFoundPage,
  dashboardPage
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  return !!token;
};

router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = isAuthenticated();

  if (authRequired && !loggedIn) {
    next("/login");
  } else {
    next();
  }
});

export default router;
