import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "../views/Login.vue";
import EstudiantesList from "../views/EstudiantesList.vue";
import EstudianteDetail from "../views/EstudianteDetail.vue";
import TelefonosList from "../views/TelefonosList.vue";
import TelefonoEdit from "@/views/TelefonoEdit.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/estudiantes",
    name: "EstudiantesList",
    component: EstudiantesList,
    meta: { requiresAuth: true },
  },
  {
    path: "/estudiantes/detail/:estudianteUrl*",
    name: "EstudianteDetail",
    component: EstudianteDetail,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/telefonos",
    name: "TelefonoList",
    component: () => import("@/components/TelefonoList.vue"),
  },
  {
    path: "/telefonos/detalle",
    name: "TelefonoDetail",
    component: () => import("@/components/TelefonoDetail.vue"),
    props: route => ({ telefonoUrl: route.params.telefonoUrl }),
  },
  {
    path: "/telefonos/:telefonoUrl",
    name: "TelefonoDetail",
    component: () => import("@/components/TelefonoDetail.vue"),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem("authToken")) {
    next("/login");
  } else {
    next();
  }
});

export default router;
