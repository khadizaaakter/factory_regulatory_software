<template>
  <a-layout-sider
    v-model:collapsed="collapsed"
    :trigger="null"
    :width="260"
    :collapsed-width="80"
    class="sidebar"
  >
    <div class="sidebar-inner">
      <!-- ============ Header / Brand ============ -->
      <div class="sidebar-header" :class="{ 'is-collapsed': collapsed }">
        <div class="brand">
          <div
            class="brand-icon"
            title="Toggle sidebar"
            @click="collapsed = !collapsed"
          >
            <SafetyCertificateOutlined />
          </div>
          <span class="brand-name">Factory Regulatory Software</span>
        </div>
        <button class="collapse-btn" @click="collapsed = !collapsed">
          <LeftOutlined
            class="chevron"
            :class="{ 'chevron--flipped': collapsed }"
          />
        </button>
      </div>

      <!-- ============ Menu ============ -->
      <div class="sidebar-menu">
        <MenuList />
      </div>

      <!-- ============ Footer / User ============ -->
      <div class="sidebar-footer" :class="{ 'is-collapsed': collapsed }">
        <div class="user-info">
          <div class="user-avatar">{{ initials }}</div>
          <div class="user-meta">
            <span class="user-name">{{ userName }}</span>
            <span class="user-role">{{ userRole }}</span>
          </div>
        </div>
        <button
          class="logout-btn"
          title="Logout"
          @click="handleLogout($router)"
        >
          <LogoutOutlined />
        </button>
      </div>
    </div>
  </a-layout-sider>
</template>

<script setup>
import { useRoute } from "vue-router";
import Cookies from "js-cookie";
import MenuList from "./MenuList.vue";
import {
  SafetyCertificateOutlined,
  LeftOutlined,
  LogoutOutlined,
} from "@ant-design/icons-vue";
import { ref, watch } from "vue";

const route = useRoute();

const collapsed = ref(false);
const openKeys = ref([]);

const userName = ref(localStorage.getItem("name") || "User");
const userRole = ref(localStorage.getItem("role") || "Member");

const initials = ref(
  (userName.value || "U")
    .split(" ")
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase()
);

const handleLogout = (router) => {
  Cookies.remove("token");
  localStorage.removeItem("staff_id");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
  localStorage.removeItem("user_permissions");
  router.push({ name: "login" });
};

watch(
  () => route?.path,
  () => {
    openKeys.value = [route?.path?.split("/")?.at(1)];
  },
  { immediate: true }
);
</script>

<style>
/* ===================== Layout shell ===================== */
.sidebar.ant-layout-sider {
  background: #002f23 !important;
}

/* keep collapsed width consistent (overrides global style.css rule) */
.sidebar.ant-layout-sider-collapsed {
  flex: 0 0 80px !important;
  max-width: 80px !important;
  min-width: 80px !important;
  width: 80px !important;
}

.sidebar .ant-layout-sider-children {
  height: 100vh;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* ===================== Header / Brand ===================== */
/* NOTE: structure stays identical between states — only opacity / width /
   padding animate, so there is no flex-direction or display "pop". */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 16px;
  gap: 10px;
  min-height: 74px;
  overflow: hidden;
  transition: padding 0.25s ease;
}

.sidebar-header.is-collapsed {
  justify-content: center;
  gap: 0;
  padding: 18px 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1 1 auto;
}

.is-collapsed .brand {
  flex: 0 0 auto;
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  color: #4ade80;
  font-size: 20px;
  flex-shrink: 0;
  cursor: pointer;
  transition: background 0.2s ease;
}

.brand-icon:hover {
  background: rgba(255, 255, 255, 0.14);
}

.brand-name {
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.2px;
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  opacity: 1;
  transition: opacity 0.2s ease;
}

.is-collapsed .brand-name {
  opacity: 0;
  width: 0;
  margin: 0;
  pointer-events: none;
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: rgba(255, 255, 255, 0.65);
  cursor: pointer;
  flex-shrink: 0;
  overflow: hidden;
  transition: background 0.2s ease, color 0.2s ease, width 0.25s ease,
    opacity 0.2s ease;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.is-collapsed .collapse-btn {
  width: 0;
  opacity: 0;
  pointer-events: none;
}

.chevron {
  transition: transform 0.3s ease;
}

.chevron--flipped {
  transform: rotate(180deg);
}

/* ===================== Menu area ===================== */
.sidebar-menu {
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 4px 0;
}

/* ===================== Footer / User ===================== */
.sidebar-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 14px 16px;
  margin-top: auto;
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  transition: padding 0.25s ease;
}

.sidebar-footer.is-collapsed {
  justify-content: center;
  padding: 14px 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #1f9d63;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.user-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.2;
  opacity: 1;
  transition: opacity 0.2s ease;
}

.is-collapsed .user-meta {
  opacity: 0;
  width: 0;
  margin: 0;
  pointer-events: none;
}

.user-name {
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  color: rgba(255, 255, 255, 0.55);
  font-size: 12px;
  white-space: nowrap;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: rgba(255, 255, 255, 0.65);
  cursor: pointer;
  font-size: 16px;
  flex-shrink: 0;
  overflow: hidden;
  transition: background 0.2s ease, color 0.2s ease, width 0.25s ease,
    opacity 0.2s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.is-collapsed .logout-btn {
  width: 0;
  opacity: 0;
  pointer-events: none;
}

/* Thin scrollbar inside the menu area */
.sidebar-menu::-webkit-scrollbar {
  width: 6px;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.15) !important;
  border: none;
  border-radius: 4px;
}

.sidebar-menu::-webkit-scrollbar-track {
  background-color: transparent !important;
  border: none;
}
</style>
