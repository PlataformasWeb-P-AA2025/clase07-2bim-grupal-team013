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
    name: "TelefonosList",
    component: TelefonosList,
    meta: { requiresAuth: true }, // Marca esta ruta como protegida
  },
  {
    path: "/telefonos/editar/:id",
    name: "EditarTelefono",
    component: TelefonoEdit,
    meta: { requiresAuth: true },
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
