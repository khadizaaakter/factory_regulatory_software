<template>
  <MainLayout>
    <div class="-m-5 p-6 bg-[#f4f6fb] min-h-full">
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 class="text-2xl font-bold text-gray-800">User Management</h1>
      </div>

      <!-- Stat cards -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-2">
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">Total</p>
          <p class="text-3xl font-bold text-[#0b1b33] mt-2 mb-2">
            {{ totalUsers() }}
          </p>
        </div>
        <div
          v-for="stat in roleStats()"
          :key="stat.name"
          class="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
        >
          <p class="text-xs font-semibold uppercase tracking-wide text-gray-400 truncate">
            {{ stat.name }}
          </p>
          <p class="text-3xl font-bold text-[#0b1b33] mt-2 mb-2">
            {{ stat.count }}
          </p>
        </div>
      </div>

      <!-- Main card -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
        <!-- Toolbar -->
        <div class="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
          <a-input
            v-model:value="searchQuery"
            placeholder="Search users..."
            class="flex-1 min-w-[200px] rounded-lg"
            allow-clear
          >
            <template #prefix>
              <SearchOutlined class="text-gray-400" />
            </template>
          </a-input>

          <a-select v-model:value="selectedRole" class="w-44" placeholder="All Roles">
            <a-select-option value="">All Roles</a-select-option>
            <a-select-option v-for="r in roleOptions()" :key="r" :value="r">
              {{ r }}
            </a-select-option>
          </a-select>

          <a-button
            type="primary"
            class="flex items-center gap-1 bg-[#002f23] h-9 px-4"
            @click="openAddModal"
          >
            <PlusOutlined /> Add User
          </a-button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="text-gray-500 font-semibold border-b border-gray-100 text-left">
                <th class="py-3 px-5">User</th>
                <th class="py-3 px-5">Email</th>
                <th class="py-3 px-5">Role</th>
                <th class="py-3 px-5">Permissions</th>
                <th class="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-gray-700">
              <tr v-if="isLoading">
                <td colspan="6" class="py-10 text-center">
                  <a-spin />
                </td>
              </tr>

              <tr v-else-if="filteredData().length === 0">
                <td colspan="6" class="py-10 text-center">
                  <a-empty description="No users found" />
                </td>
              </tr>

              <tr
                v-for="(user, index) in paginatedData()"
                :key="user.id ?? index"
                class="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <!-- User -->
                <td class="py-3 px-5">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-9 h-9 rounded-full bg-[#002f23] text-white flex items-center justify-center text-xs font-bold shrink-0"
                    >
                      {{ getInitials(user?.name) }}
                    </div>
                    <div class="leading-tight">
                      <p class="font-semibold text-gray-800">
                        {{ user?.name || "-" }}
                      </p>
                      <!-- <p class="text-xs text-gray-400">ID: {{ user?.id }}</p> -->
                    </div>
                  </div>
                </td>
                <!-- Email -->
                <td class="py-3 px-5 text-gray-500">{{ user?.email || "-" }}</td>
                <!-- Role -->
                <td class="py-3 px-5">
                  <span
                    v-for="r in user?.roles || []"
                    :key="r"
                    class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mr-1 capitalize"
                    :class="roleBadgeClass(r)"
                  >
                    {{ r }}
                  </span>
                  <span v-if="!(user?.roles || []).length" class="text-gray-300">
                    -
                  </span>
                </td>
                <!-- Permissions -->
                <td class="py-3 px-5">
                  <span
                    class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                  >
                    {{ (user?.permissions || []).length }} permission{{
                      (user?.permissions || []).length === 1 ? "" : "s"
                    }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="py-3 px-5">
                  <div class="flex justify-end gap-2">
                    <a-button
                      size="small"
                      class="flex items-center justify-center bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
                      title="Edit"
                      @click="handleEdit(user.id)"
                    >
                      <EditOutlined />
                    </a-button>
                    <a-popconfirm
                      title="Delete this User?"
                      ok-text="Yes"
                      cancel-text="No"
                      @confirm="handleDelete(user.id)"
                    >
                      <a-button
                        size="small"
                        class="flex items-center justify-center bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
                        title="Delete"
                      >
                        <DeleteOutlined />
                      </a-button>
                    </a-popconfirm>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="filteredData().length > 0"
          class="flex justify-end p-4 border-t border-gray-100"
        >
          <a-pagination
            v-model:current="currentPage"
            :total="filteredData().length"
            :page-size="pageSize"
            :show-size-changer="false"
          />
        </div>
      </div>

      <!-- Add / Edit user Modal -->
      <a-modal
        v-model:open="isModalOpen"
        :title="isEditMode ? 'Edit User' : 'Add User'"
        :footer="null"
        :destroy-on-close="true"
        :width="520"
        @cancel="closeModal"
      >
        <a-form :model="form" layout="vertical" autocomplete="off" @finish="submitUser">
          <a-form-item
            label="Name"
            name="name"
            :rules="[{ required: true, message: 'Please enter name' }]"
          >
            <a-input v-model:value="form.name" placeholder="Enter name" />
          </a-form-item>

          <a-form-item
            label="Email"
            name="email"
            :rules="[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]"
          >
            <a-input
              v-model:value="form.email"
              placeholder="Enter email"
              autocomplete="off"
            />
          </a-form-item>

          <a-form-item label="Role" name="role">
            <a-select
              v-model:value="form.role"
              :loading="rolesLoading"
              placeholder="Select role"
              allow-clear
            >
              <a-select-option
                v-for="r in rolesList"
                :key="r.id"
                :value="r.name"
                class="capitalize"
              >
                {{ r.name }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            :label="isEditMode ? 'Password (leave blank to keep current)' : 'Password'"
            name="password"
            :rules="passwordRules()"
          >
            <a-input-password
              v-model:value="form.password"
              placeholder="Enter password"
              autocomplete="new-password"
            />
          </a-form-item>

          <a-form-item
            label="Confirm Password"
            name="password_confirmation"
            :rules="confirmPasswordRules()"
          >
            <a-input-password
              v-model:value="form.password_confirmation"
              placeholder="Re-enter password"
              autocomplete="new-password"
            />
          </a-form-item>

          <div class="flex justify-end gap-2 mt-4">
            <a-button @click="closeModal" :disabled="isSubmitting"> Cancel </a-button>
            <a-button
              type="primary"
              html-type="submit"
              :loading="isSubmitting"
              class="bg-[#002f23]"
            >
              {{ isEditMode ? "Update" : "Save" }}
            </a-button>
          </div>
        </a-form>
      </a-modal>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/components/layout/MainLayout.vue";
import axios from "axios";
import { ref, reactive, onMounted, watch } from "vue";
import { apiBase } from "@/config";
import { getTokenConfig } from "@/utilities/tokenConfig";
import { showNotification } from "@/utilities/notification";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";

const searchQuery = ref("");
const selectedRole = ref("");
const userList = ref([]);
const isLoading = ref(false);
const currentPage = ref(1);
const pageSize = ref(14);

const isModalOpen = ref(false);
const isEditMode = ref(false);
const editingId = ref(null);
const isSubmitting = ref(false);

const rolesList = ref([]);
const rolesLoading = ref(false);

const fetchRoles = async () => {
  rolesLoading.value = true;
  try {
    const res = await axios.get(`${apiBase}/roles`, getTokenConfig());
    rolesList.value = Array.isArray(res?.data?.data) ? res.data.data : [];
  } catch (error) {
    console.error("Failed to fetch roles", error?.response?.data || error);
    rolesList.value = [];
  } finally {
    rolesLoading.value = false;
  }
};

const defaultForm = () => ({
  name: "",
  email: "",
  role: undefined,
  password: "",
  password_confirmation: "",
});

const form = reactive(defaultForm());

const resetForm = () => {
  Object.assign(form, defaultForm());
  editingId.value = null;
};

const openAddModal = () => {
  resetForm();
  isEditMode.value = false;
  isModalOpen.value = true;
  if (!rolesList.value.length) fetchRoles();
};

const openEditModal = (user) => {
  resetForm();
  isEditMode.value = true;
  editingId.value = user?.id ?? null;
  form.name = user?.name ?? "";
  form.email = user?.email ?? "";
  form.role = (user?.roles || [])[0];
  isModalOpen.value = true;
  if (!rolesList.value.length) fetchRoles();
};

const closeModal = () => {
  isModalOpen.value = false;
};

const passwordRules = () => {
  if (isEditMode.value) {
    return [{ min: 8, message: "Password must be at least 8 characters" }];
  }
  return [
    { required: true, message: "Please enter password" },
    { min: 8, message: "Password must be at least 8 characters" },
  ];
};

const confirmPasswordRules = () => {
  const rules = [
    {
      validator: (_rule, value) => {
        if (!form.password && !value) return Promise.resolve();
        if (value !== form.password) {
          return Promise.reject(new Error("Passwords do not match"));
        }
        return Promise.resolve();
      },
    },
  ];
  if (!isEditMode.value) {
    rules.unshift({ required: true, message: "Please confirm password" });
  }
  return rules;
};

const submitUser = async () => {
  isSubmitting.value = true;
  try {
    const payload = {
      name: form.name,
      email: form.email,
      roles: form.role ? [form.role] : [],
    };
    if (form.password) {
      payload.password = form.password;
      payload.password_confirmation = form.password_confirmation;
    }

    const res = isEditMode.value
      ? await axios.put(`${apiBase}/users/${editingId.value}`, payload, getTokenConfig())
      : await axios.post(`${apiBase}/users`, payload, getTokenConfig());

    if (res?.data?.success) {
      showNotification(
        "success",
        res?.data?.message || (isEditMode.value ? "User updated" : "User created")
      );
      closeModal();
      fetchUserList();
    } else {
      showNotification("error", res?.data?.message || "Operation failed");
    }
  } catch (error) {
    const data = error?.response?.data;
    const firstError = data?.errors ? Object.values(data.errors)?.[0]?.[0] : null;
    showNotification(
      "error",
      firstError || data?.message || error?.message || "Something went wrong"
    );
  } finally {
    isSubmitting.value = false;
  }
};

const handleEdit = (id) => {
  const user = userList.value.find((u) => u.id === id);
  if (user) openEditModal(user);
};

const handleDelete = async (id) => {
  try {
    const res = await axios.delete(`${apiBase}/users/${id}`, getTokenConfig());
    if (res?.data?.success || res?.status === 204) {
      showNotification("success", res?.data?.message || "User deleted");
      await fetchUserList();
    } else {
      showNotification("error", res?.data?.message || "Failed to delete user");
    }
  } catch (error) {
    showNotification("error", error?.response?.data?.message || "Failed to delete user");
  }
};

const fetchUserList = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get(`${apiBase}/users?per_page=100`, getTokenConfig());
    if (res?.data?.success) {
      userList.value = Array.isArray(res?.data?.data) ? res.data.data : [];
    } else {
      userList.value = [];
      showNotification("error", res?.data?.message || "Failed to fetch user list");
    }
  } catch (error) {
    userList.value = [];
    showNotification("error", "Failed to fetch user list");
  } finally {
    isLoading.value = false;
  }
};

// ---- display helpers ----
const getInitials = (name) =>
  (name || "?")
    .split(" ")
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

const roleBadgeClass = (role) => {
  const map = {
    admin: "bg-red-50 text-red-600",
    manager: "bg-blue-50 text-blue-600",
    inspector: "bg-amber-50 text-amber-700",
    user: "bg-gray-100 text-gray-600",
  };
  return map[String(role).toLowerCase()] || "bg-emerald-50 text-emerald-700";
};

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const totalUsers = () => userList.value.length;

const roleStats = () => {
  const counts = {};
  userList.value.forEach((u) => {
    (u?.roles || []).forEach((r) => {
      counts[r] = (counts[r] || 0) + 1;
    });
  });
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
};

const roleOptions = () => {
  const set = new Set();
  userList.value.forEach((u) => (u?.roles || []).forEach((r) => set.add(r)));
  return [...set];
};

const filteredData = () => {
  const q = searchQuery.value.trim().toLowerCase();
  const role = selectedRole.value;
  return userList.value.filter((u) => {
    const matchesRole = !role || (u?.roles || []).includes(role);
    if (!matchesRole) return false;
    if (!q) return true;
    const fields = [u?.name, u?.email, ...(u?.roles || [])];
    return fields.some((f) =>
      String(f ?? "")
        .toLowerCase()
        .includes(q)
    );
  });
};

const paginatedData = () => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredData().slice(start, start + pageSize.value);
};

watch([searchQuery, selectedRole], () => {
  currentPage.value = 1;
});

onMounted(() => {
  fetchUserList();
});
</script>
