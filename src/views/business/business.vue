<template>
  <MainLayout>
    <div class="-m-5 p-6 bg-[#f4f6fb] min-h-full">
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Business</h1>
      </div>

      <!-- Main card -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
        <!-- Toolbar -->
        <div class="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
          <a-input
            v-model:value="searchQuery"
            placeholder="Search businesses..."
            class="flex-1 min-w-[200px] rounded-lg"
            allow-clear
          >
            <template #prefix>
              <SearchOutlined class="text-gray-400" />
            </template>
          </a-input>

          <a-button
            type="primary"
            class="flex items-center gap-1 bg-[#002f23] h-9 px-4"
            @click="openAddModal"
          >
            <PlusOutlined /> Add Business
          </a-button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="text-gray-500 font-semibold border-b border-gray-100 text-left">
                <th class="py-3 px-5">Business Name</th>
                <th class="py-3 px-5">Code</th>
                <th class="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="text-gray-700">
              <tr v-if="isLoading">
                <td colspan="4" class="py-10 text-center">
                  <a-spin />
                </td>
              </tr>

              <tr v-else-if="filteredData().length === 0">
                <td colspan="4" class="py-10 text-center">
                  <a-empty description="No businesses found" />
                </td>
              </tr>

              <tr
                v-for="(business, index) in paginatedData()"
                :key="business.id ?? index"
                class="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <!-- Business Name -->
                <td class="py-3 px-5">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-9 h-9 rounded-full bg-[#002f23] text-white flex items-center justify-center text-xs font-bold shrink-0"
                    >
                      {{ getInitials(business?.name) }}
                    </div>
                    <p class="font-semibold text-gray-800">
                      {{ business?.name || "-" }}
                    </p>
                  </div>
                </td>
                <!-- Group -->
                <td class="py-3 px-5">
                  <span
                    class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 capitalize"
                  >
                    {{ groupOf(business?.group) }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="py-3 px-5">
                  <div class="flex justify-end gap-2">
                    <a-button
                      size="small"
                      class="flex items-center justify-center bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
                      title="Edit"
                      @click="openEditModal(business)"
                    >
                      <EditOutlined />
                    </a-button>
                    <a-popconfirm
                      title="Delete this business?"
                      ok-text="Yes"
                      cancel-text="No"
                      @confirm="deleteBusiness(business.id)"
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

      <!-- Add / Edit Business Modal -->
      <a-modal
        v-model:open="isModalOpen"
        :title="isEditMode ? 'Edit Business' : 'Add Business'"
        :footer="null"
        :destroy-on-close="true"
        :width="460"
        @cancel="closeModal"
      >
        <a-form
          :model="form"
          layout="vertical"
          autocomplete="off"
          @finish="submitBusiness"
        >
          <a-form-item
            label="Business Name"
            name="name"
            :rules="[{ required: true, message: 'Please enter business name' }]"
          >
            <a-input v-model:value="form.name" placeholder="Enter business name" />
          </a-form-item>

          <a-form-item label="Active" name="is_active">
            <a-select v-model:value="form.is_active">
              <a-select-option :value="true">Active</a-select-option>
              <a-select-option :value="false">Inactive</a-select-option>
            </a-select>
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
import { onMounted, ref, reactive, watch } from "vue";
import MainLayout from "@/components/layout/MainLayout.vue";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import { apiBase } from "@/config";
import { getTokenConfig } from "@/utilities/tokenConfig";
import { showNotification } from "@/utilities/notification";
import axios from "axios";

const isLoading = ref(false);
const isSubmitting = ref(false);
const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = ref(10);

const businessList = ref([]);

const isModalOpen = ref(false);
const isEditMode = ref(false);
const editingId = ref(null);

const form = reactive({ name: "", is_active: true });

// fetching ----
const getBusinesses = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get(`${apiBase}/businesses?per_page=100`, getTokenConfig());
    businessList.value =
      res?.data?.success && Array.isArray(res?.data?.data) ? res.data.data : [];
  } catch (error) {
    businessList.value = [];
    showNotification("error", "Failed to fetch businesses");
  } finally {
    isLoading.value = false;
  }
};

// ---- modal ----
const resetForm = () => {
  form.name = "";
  form.is_active = true;
  editingId.value = null;
};

const openAddModal = () => {
  resetForm();
  isEditMode.value = false;
  isModalOpen.value = true;
};

const openEditModal = (business) => {
  resetForm();
  isEditMode.value = true;
  editingId.value = business?.id ?? null;
  form.name = business?.name ?? "";
  form.is_active = business?.is_active ?? true;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

// ---- create ----
const createBusiness = async () => {
  isSubmitting.value = true;
  try {
    const payload = { name: form.name, is_active: form.is_active };
    const res = await axios.post(`${apiBase}/businesses`, payload, getTokenConfig());
    showNotification("success", res?.data?.message || "Business created");
    closeModal();
    getBusinesses();
  } catch (error) {
    showNotification(
      "error",
      error?.response?.data?.message || "Failed to create business"
    );
  } finally {
    isSubmitting.value = false;
  }
};

// ---- update  ----
const updateBusiness = async () => {
  isSubmitting.value = true;
  try {
    const payload = { name: form.name, is_active: form.is_active };
    const res = await axios.put(
      `${apiBase}/businesses/${editingId.value}`,
      payload,
      getTokenConfig()
    );
    showNotification("success", res?.data?.message || "Business updated");
    closeModal();
    getBusinesses();
  } catch (error) {
    showNotification(
      "error",
      error?.response?.data?.message || "Failed to update business"
    );
  } finally {
    isSubmitting.value = false;
  }
};

const submitBusiness = () => (isEditMode.value ? updateBusiness() : createBusiness());

// ---- delete ----
const deleteBusiness = async (id) => {
  try {
    const res = await axios.delete(`${apiBase}/businesses/${id}`, getTokenConfig());
    if (res?.data?.success || res?.status === 204) {
      showNotification("success", res?.data?.message || "Business deleted");
      await getBusinesses();
    } else {
      showNotification("error", res?.data?.message || "Failed to delete business");
    }
  } catch (error) {
    showNotification(
      "error",
      error?.response?.data?.message || "Failed to delete business"
    );
  }
};

// ---- display helpers ----
const getInitials = (name) =>
  (name || "?")
    .split(/[\s_.-]+/)
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

const groupOf = (name) => String(name ?? "").split(".")[0] || "-";

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

const totalBusinesses = () => businessList.value.length;

const groupCount = () => {
  const set = new Set();
  businessList.value.forEach((b) => set.add(groupOf(b?.name)));
  return set.size;
};

const filteredData = () => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return businessList.value;
  return businessList.value.filter((b) =>
    String(b?.name ?? "")
      .toLowerCase()
      .includes(q)
  );
};

const paginatedData = () => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredData().slice(start, start + pageSize.value);
};

watch(searchQuery, () => {
  currentPage.value = 1;
});

onMounted(() => {
  getBusinesses();
});
</script>
