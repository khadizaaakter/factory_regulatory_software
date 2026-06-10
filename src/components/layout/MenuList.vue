<template>
  <a-menu
    v-model:selectedKeys="selectedKeys"
    v-model:openKeys="openKeys"
    theme="dark"
    mode="inline"
    class="sidebar-nav"
  >
    <!-- dashboard -->
    <a-menu-item v-if="hasPermission('Dashboard')" key="dashboard">
      <template #icon><StockOutlined /></template>
      <router-link :to="{ name: 'dashboard' }">Dashboard</router-link>
    </a-menu-item>

    <!-- license -->
    <a-menu-item v-if="hasPermission('License')" key="license">
      <template #icon><FileProtectOutlined /></template>
      <router-link :to="{ name: 'license' }">License</router-link>
    </a-menu-item>

    <!-- report -->
    <!-- <a-menu-item v-if="hasPermission('Report')" key="report">
      <template #icon><BarChartOutlined /></template>
      <router-link :to="{ name: 'report' }">Report</router-link>
    </a-menu-item> -->

    <!-- settings submenu -->
    <a-sub-menu v-if="hasPermission('Settings')" key="settings-group">
      <template #icon>
        <SettingOutlined />
      </template>
      <template #title>Settings</template>

      <a-menu-item v-if="hasPermission('License Category')" key="license-category">
        <router-link :to="{ name: 'license-category' }">
          <span>License Category</span>
        </router-link>
      </a-menu-item>
      <a-menu-item v-if="hasPermission('Business')" key="business">
        <router-link :to="{ name: 'business' }">
          <span>Business</span>
        </router-link>
      </a-menu-item>
    </a-sub-menu>

    <!-- user management submenu -->
    <a-sub-menu v-if="showUserMenu()" key="user-management-group">
      <template #icon>
        <TeamOutlined />
      </template>
      <template #title>User Management</template>

      <a-menu-item v-if="hasPermission('User Manager')" key="user-management">
        <router-link :to="{ name: 'user-management' }">
          <span>User Manager</span>
        </router-link>
      </a-menu-item>
      <a-menu-item v-if="hasPermission('Role')" key="role">
        <router-link :to="{ name: 'role' }">
          <span>Role</span>
        </router-link>
      </a-menu-item>
      <a-menu-item v-if="hasPermission('Permissions')" key="user-permission">
        <router-link :to="{ name: 'user-permission' }">
          <span>Permissions</span>
        </router-link>
      </a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>

<script setup>
import { useRoute } from "vue-router";
import {
  BarChartOutlined,
  TeamOutlined,
  StockOutlined,
  SettingOutlined,
  FileProtectOutlined,
} from "@ant-design/icons-vue";
import { ref, watch } from "vue";

const route = useRoute();

// Map each child route name to its parent submenu key
const routeToSubmenu = {
  "license-category": "settings-group",
  business: "settings-group",
  "user-management": "user-management-group",
  role: "user-management-group",
  "user-permission": "user-management-group",
};

const selectedKeys = ref([route?.name]);

// Each page mounts its own layout, so MenuList remounts on every navigation.
// Initialize openKeys from the current route's parent so the submenu stays open
// after navigating to one of its children (instead of collapsing on each click).
const initialParent = routeToSubmenu[route?.name];
const openKeys = ref(initialParent ? [initialParent] : []);

const user_permissions = ref(
  JSON.parse(localStorage.getItem("user_permissions") || "[]")
);

const hasPermission = (permission) => {
  return user_permissions.value.includes(permission);
};

const hasAnyPermission = (permissions) => {
  return permissions.some((p) => hasPermission(p));
};

const showUserMenu = () => hasAnyPermission(["User Manager", "Role", "Permissions"]);

watch(
  () => route?.name,
  (name) => {
    selectedKeys.value = [name];

    // Keep the child's parent submenu open after navigating to it.
    const parent = routeToSubmenu[name];
    if (parent && !openKeys.value.includes(parent)) {
      openKeys.value = [...openKeys.value, parent];
    }
  },
  { immediate: true }
);
</script>

<style>
/* ===================== Nav base ===================== */
.sidebar-nav.ant-menu {
  background: transparent !important;
  border-inline-end: none !important;
  padding: 0 10px !important;
}

/* ---- top-level items & submenu titles ---- */
.sidebar-nav .ant-menu-item,
.sidebar-nav .ant-menu-submenu-title {
  height: 44px !important;
  line-height: 44px !important;
  margin: 4px 0 !important;
  border-radius: 10px !important;
  color: rgba(255, 255, 255, 0.75) !important;
  font-weight: 500;
  transition: background 0.2s ease, color 0.2s ease;
}

.sidebar-nav .ant-menu-item a {
  color: inherit !important;
  display: flex;
  align-items: center;
}

/* icon + label spacing */
.sidebar-nav .ant-menu-title-content {
  display: inline-flex;
  align-items: center;
}

.sidebar-nav .anticon {
  font-size: 18px;
}

/* ---- hover ---- */
.sidebar-nav .ant-menu-item:hover,
.sidebar-nav .ant-menu-submenu-title:hover {
  background: rgba(255, 255, 255, 0.06) !important;
  color: #ffffff !important;
}

/* ---- selected (pill highlight) ---- */
.sidebar-nav .ant-menu-item-selected {
  background: rgba(255, 255, 255, 0.12) !important;
  color: #ffffff !important;
}

.sidebar-nav .ant-menu-item-selected a {
  color: #ffffff !important;
}

/* keep an open submenu parent neutral, not blue */
.sidebar-nav .ant-menu-submenu-selected > .ant-menu-submenu-title {
  color: #ffffff !important;
}

/* ===================== Submenu (children) ===================== */
.sidebar-nav .ant-menu-sub.ant-menu-inline {
  background: transparent !important;
}

.sidebar-nav .ant-menu-sub .ant-menu-item {
  height: 38px !important;
  line-height: 38px !important;
  padding-left: 44px !important;
}

/* bullet for submenu items */
.sidebar-nav .ant-menu-sub .ant-menu-item .ant-menu-title-content::before {
  content: "•";
  color: rgba(255, 255, 255, 0.5);
  margin-right: 10px;
  font-size: 16px;
  line-height: 1;
}
</style>
