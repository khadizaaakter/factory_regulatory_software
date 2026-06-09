<template>
  <MainLayout>
    <div class="-m-5 p-6 bg-[#f4f6fb] min-h-full">
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 class="text-2xl font-bold text-gray-800">License</h1>
      </div>

      <!-- Main card -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
        <!-- Toolbar -->
        <div class="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
          <a-input
            v-model:value="searchQuery"
            placeholder="Search licenses..."
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
            <PlusOutlined /> Add License
          </a-button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="text-gray-500 font-semibold border-b border-gray-100 text-left">
                <th class="py-3 px-5">License Name</th>
                <th class="py-3 px-5">License Number</th>
                <th class="py-3 px-5">Business</th>
                <th class="py-3 px-5">Category</th>
                <th class="py-3 px-5">Issuing Authority</th>
                <th class="py-3 px-5">Scope of License</th>
                <th class="py-3 px-5">Renew Date</th>
                <th class="py-3 px-5">Expiry Date</th>
                <th class="py-3 px-5">Reminder</th>
                <th class="py-3 px-5">Renewal</th>
                <th class="py-3 px-5">Actions</th>
                <!-- <th class="py-3 px-5">Status</th> -->
              </tr>
            </thead>
            <tbody class="text-gray-700">
              <tr v-if="isLoading">
                <td colspan="11" class="py-10 text-center">
                  <a-spin />
                </td>
              </tr>

              <tr v-else-if="filteredData().length === 0">
                <td colspan="11" class="py-10 text-center">
                  <a-empty description="No licenses found" />
                </td>
              </tr>

              <tr
                v-for="(license, index) in paginatedData()"
                :key="license.LicenseID ?? index"
                class="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <!-- License Name -->
                <td class="py-3 px-5">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-9 h-9 rounded-full bg-[#002f23] text-white flex items-center justify-center text-xs font-bold shrink-0"
                    >
                      {{ getInitials(license?.LicenseName) }}
                    </div>
                    <p class="font-semibold text-gray-800">
                      {{ license?.LicenseName || "-" }}
                    </p>
                  </div>
                </td>
                <!-- License Number -->
                <td class="py-3 px-5">{{ license?.LicenseNumber || "-" }}</td>
                <!-- Business -->
                <td class="py-3 px-5">{{ license?.business?.name || "-" }}</td>
                <!-- Category -->
                <td class="py-3 px-5">{{ license?.category?.name || "-" }}</td>
                <!-- Issuing Authority -->
                <td class="py-3 px-5">{{ license?.IssuingAuthority || "-" }}</td>
                <!-- Scope of License -->
                <td class="py-3 px-5">{{ license?.ScopeOfLicense || "-" }}</td>
                <!-- RenewDate -->
                <td class="py-3 px-5">{{ formatDate(license?.RenewDate) }}</td>
                <!-- Expiry Date -->
                <td class="py-3 px-5">{{ formatDate(license?.ExpiryDate) }}</td>
                <!-- Reminder -->
                <td class="py-3 px-5">
                  <span
                    v-if="reminderBadge(license)"
                    class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="reminderBadge(license).cls"
                  >
                    {{ reminderBadge(license).text }}
                  </span>
                  <span v-else>-</span>
                </td>
                <!-- Renewal -->
                <td class="py-3 px-5">
                  <a-button
                    size="small"
                    class="flex items-center gap-1 bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100"
                    :disabled="!canRenew(license)"
                    :title="
                      canRenew(license) ? 'Renew' : 'Available from the expiry date'
                    "
                    @click="renewLicense(license)"
                  >
                    <ReloadOutlined /> Renew
                  </a-button>
                </td>
                <!-- Actions -->
                <td class="py-3 px-5">
                  <div class="flex justify-end gap-2">
                    <a-button
                      size="small"
                      class="flex items-center justify-center bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      title="View"
                      @click="viewLicense(license)"
                    >
                      <EyeOutlined />
                    </a-button>
                    <a-button
                      size="small"
                      class="flex items-center justify-center bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
                      title="Edit"
                      @click="editLicense(license)"
                    >
                      <EditOutlined />
                    </a-button>
                    <a-popconfirm
                      title="Delete this license?"
                      ok-text="Yes"
                      cancel-text="No"
                      @confirm="deleteLicense(license.LicenseID)"
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
                <!-- Status -->
                <!-- <td class="py-3 px-5">
                  <span
                    class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="
                      license?.IsActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-gray-100 text-gray-500'
                    "
                  >
                    {{ license?.IsActive ? "Active" : "Inactive" }}
                  </span>
                </td> -->
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
    </div>
  </MainLayout>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import MainLayout from "@/components/layout/MainLayout.vue";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons-vue";
import { apiBase } from "@/config";
import { getTokenConfig } from "@/utilities/tokenConfig";
import { showNotification } from "@/utilities/notification";
import axios from "axios";

const router = useRouter();

const isLoading = ref(false);
const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = ref(10);

const licenseList = ref([]);

// fetching ----
const getLicenses = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get(`${apiBase}/licenses?per_page=100`, getTokenConfig());
    const payload = res?.data?.data;
    licenseList.value = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
      ? payload
      : [];
  } catch (error) {
    licenseList.value = [];
    showNotification("error", "Failed to fetch licenses");
  } finally {
    isLoading.value = false;
  }
};

// ---- actions ----
const openAddModal = () => {
  router.push({ name: "license-create" });
};

const viewLicense = (license) => {
  router.push({ name: "license-detail", params: { id: license?.LicenseID } });
};

// Renew is allowed only from the expiry date onward (today >= ExpiryDate).
const canRenew = (license) => {
  const expiry = license?.ExpiryDate;
  if (!expiry) return false;
  const exp = new Date(expiry);
  if (Number.isNaN(exp.getTime())) return false;
  const today = new Date();
  exp.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return today >= exp;
};

const renewLicense = (license) => {
  if (!canRenew(license)) return;
  router.push({ name: "license-renew", params: { id: license?.LicenseID } });
};

const editLicense = (license) => {
  router.push({ name: "license-edit", params: { id: license?.LicenseID } });
};

const deleteLicense = async (id) => {
  try {
    await axios.delete(`${apiBase}/licenses/${id}`, getTokenConfig());
    // Soft delete keeps the row in the API list, so remove it locally.
    licenseList.value = licenseList.value.filter((l) => l.LicenseID !== id);
    showNotification("success", "License deleted");
  } catch (error) {
    showNotification(
      "error",
      error?.response?.data?.message || "Failed to delete license"
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

// Reminder based on days left until expiry (ExpiryDate - today), using the
// record's ReminderDays tiers (default [30, 15, 7], sorted -> [7, 15, 30]):
//   <= 7 (or already past) -> red    "Expired"
//   8-15                   -> yellow "Expiring Soon"
//   16+                    -> green  "Safe"
const reminderBadge = (license) => {
  const expiry = license?.ExpiryDate;
  if (!expiry) return null;
  const exp = new Date(expiry);
  if (Number.isNaN(exp.getTime())) return null;

  const today = new Date();
  exp.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const days = Math.round((exp - today) / 86400000);

  // thresholds from the record (fallback 30/15/7), sorted ascending -> [7, 15, 30]
  const tiers = (Array.isArray(license?.ReminderDays)
    ? license.ReminderDays
    : [30, 15, 7]
  )
    .map(Number)
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => a - b);
  const expiredMax = tiers[0] ?? 7;
  const soonMax = tiers[1] ?? 15;

  if (days <= expiredMax) {
    return { text: "Expired", cls: "bg-red-50 text-red-700" };
  }
  if (days <= soonMax) {
    return { text: "Expiring Soon", cls: "bg-yellow-50 text-yellow-700" };
  }
  return { text: "Safe", cls: "bg-green-50 text-green-700" };
};

const filteredData = () => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return licenseList.value;
  return licenseList.value.filter((l) =>
    [l?.LicenseName, l?.LicenseNumber, l?.business?.name, l?.category?.name]
      .map((v) => String(v ?? "").toLowerCase())
      .some((v) => v.includes(q))
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
  getLicenses();
});
</script>
