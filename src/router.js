import { createWebHistory, createRouter } from "vue-router";
import Cookies from "js-cookie";

import Login from "./views/Login.vue";
// import UpdatePassword from "./vews/UpdatePassword.vue";

import UserManagement from "./views/user/UserManagement.vue";
import Permission from "./views/user/Permission.vue";
import Role from "./views/user/Role.vue";

import Dashboard from "./views/dashboard/dashboard.vue";
import Report from "./views/report/report.vue";
import Business from "./views/business/business.vue";
import LicenseCategory from "./views/licenseCategory/license_category.vue";
import License from "./views/license/license.vue";
import LicenseCreate from "./views/license/license_create.vue";
import LicenseEdit from "./views/license/license_edit.vue";
import LicenseHistory from "./views/license/license_history.vue";
import LicenseRenewalDetail from "./views/license/license_renewal_detail.vue";
import LicenseDetail from "./views/license/license_detail.vue";

const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
  },
  {
    path: "/user-management",
    name: "user-management",
    component: UserManagement,
  },
  {
    path: "/role",
    name: "role",
    component: Role,
  },
  {
    path: "/user-permission",
    name: "user-permission",
    component: Permission,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
  },
  {
    path: "/report",
    name: "report",
    component: Report,
  },
  {
    path: "/user-role",
    name: "user-role",
    component: Role,
  },
  // business
  {
    path: "/business",
    name: "business",
    component: Business,
  },
  // license_category
  {
    path: "/license-category",
    name: "license-category",
    component: LicenseCategory,
  },
  // license
  {
    path: "/license",
    name: "license",
    component: License,
  },
  // license create (must come before /license/:id)
  {
    path: "/license/create",
    name: "license-create",
    component: LicenseCreate,
  },
  // license edit
  {
    path: "/license/:id/edit",
    name: "license-edit",
    component: LicenseEdit,
  },
  // license renewal history
  {
    path: "/license/:id/history",
    name: "license-history",
    component: LicenseHistory,
  },
  // renewal detail
  {
    path: "/renewal/:id",
    name: "renewal-detail",
    component: LicenseRenewalDetail,
  },
  // license detail
  {
    path: "/license/:id",
    name: "license-detail",
    component: LicenseDetail,
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});
router.beforeEach((to, from, next) => {
  const token = Cookies.get("token");
  if (to.path === "/" && !token) {
    next();
  } else if (to.path === "/" && token) {
    next("/dashboard");
  } else if (token) {
    next();
  } else {
    next("/");
  }
});

export default router;
