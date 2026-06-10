import { defineStore } from "pinia";
import axios from "axios";
import Cookies from "js-cookie";
import { apiBase } from "@/config";
import { showNotification } from "@/utilities/notification";

export const useLoginStore = defineStore("loginStore", {
  state: () => ({
    isLoading: false,
    userInfo: null,
  }),
  actions: {
    async handleLogin(data, router) {
      this.isLoading = true;
      try {
        const res = await axios.post(
          `${apiBase}/auth/login`,
          { email: data.email, password: data.password },
          { headers: { Accept: "application/json" } }
        );

        const payload = res?.data;
        const token = payload?.data?.token;
        const user = payload?.data?.user;

        if (payload?.success && token && user) {
          const roles = Array.isArray(user.roles) ? user.roles : [];
          const primaryRole = roles[0] ?? "";

          const blockedRoles = ["customer", "dealer"];
          if (
            roles.some((r) => blockedRoles.includes(String(r).toLowerCase()))
          ) {
            showNotification(
              "error",
              `${primaryRole || "User"} is not allowed to login.`
            );
            return;
          }

          Cookies.set("token", token, { expires: null });
          this.userInfo = user;
          localStorage.setItem("name", user?.name ?? "");
          localStorage.setItem("email", user?.email ?? "");
          localStorage.setItem("role", primaryRole);
          localStorage.setItem("staff_id", String(user?.id ?? ""));
          localStorage.setItem(
            "user_permissions",
            JSON.stringify(this.mapPermissions(user?.permissions))
          );
          // Raw dotted permissions (e.g. "license_master.edit") for button-level
          // checks via can() in @/utilities/common.
          localStorage.setItem(
            "raw_permissions",
            JSON.stringify(Array.isArray(user?.permissions) ? user.permissions : [])
          );

          showNotification(
            "success",
            payload?.message || "Login successful! Welcome back."
          );
          router.push({ name: "dashboard" });
        } else {
          showNotification(
            "error",
            payload?.message || "Login failed. Please try again."
          );
        }
      } catch (error) {
        this.userInfo = null;
        Cookies.remove("token");
        const errorMessage =
          error?.response?.data?.message || "An unexpected error occurred.";
        console.error("Login error:", errorMessage);
        showNotification("error", errorMessage);
      } finally {
        this.isLoading = false;
      }
    },

    // Map the backend's dotted permission strings (e.g. "users.view")
    // to the labels the sidebar/menus check against.
    mapPermissions(perms = []) {
      const list = Array.isArray(perms) ? perms : [];
      const has = (prefix) => list.some((p) => String(p).startsWith(prefix));
      const hasExact = (name) => list.some((p) => String(p) === name);

      const labels = new Set();

      // Top-level menus are gated by their own dedicated menu permissions,
      // separate from the module CRUD permissions (e.g. "license_master.view").
      if (hasExact("menu.dashboard")) labels.add("Dashboard");
      if (hasExact("menu.license")) labels.add("License");
      if (hasExact("menu.settings")) labels.add("Settings");

      // Settings children keep their own module permissions.
      if (has("businesses.")) labels.add("Business");
      if (has("license_categories.")) labels.add("License Category");

      // User Management menu (unchanged).
      if (has("users.")) labels.add("User Manager");
      if (has("roles.")) labels.add("Role");
      if (has("permissions.")) labels.add("Permissions");
      if (has("posts.")) labels.add("Report");

      return [...labels];
    },

    // logout(router) {},
  },
});