<template>
  <MainLayout>
    <div class="-m-5 p-6 bg-[#f4f6fb] min-h-full">
      <!-- Top bar: breadcrumb + go back -->
      <div class="flex items-center justify-between mb-4">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link :to="{ name: 'license' }">License</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>
            <router-link
              :to="{ name: 'license-detail', params: { id: route.params.id } }"
            >
              {{ route.params.id }}
            </router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>Renewal History</a-breadcrumb-item>
        </a-breadcrumb>
        <a-button class="flex items-center gap-1" @click="goBack">
          <ArrowLeftOutlined /> Go Back
        </a-button>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="py-20 text-center">
        <a-spin />
      </div>

      <template v-else>
        <!-- License summary -->
        <div
          v-if="license"
          class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-wrap items-center justify-between gap-4"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-full bg-[#002f23] text-white flex items-center justify-center text-sm font-bold shrink-0"
            >
              {{ getInitials(license.LicenseName) }}
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-800">
                {{ license.LicenseName || "-" }}
              </h1>
              <p class="text-gray-500 text-sm">{{ license.LicenseNumber || "-" }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100"
            >
              <ReloadOutlined class="text-indigo-500" />
              <span class="text-lg font-bold text-indigo-700 leading-none">
                {{ events.length }}
              </span>
              <span class="text-xs text-indigo-500 leading-none">
                Event{{ events.length === 1 ? "" : "s" }}
              </span>
            </span>
            <span
              class="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
            >
              {{ license.CurrentRenewalStatus || "-" }}
            </span>
          </div>
        </div>

        <!-- Events -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-4 border-b border-gray-100">
            <h2 class="text-base font-bold text-gray-800">Renewal History</h2>
          </div>

          <div v-if="events.length === 0" class="p-10">
            <a-empty description="No renewal history" />
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr
                  class="text-gray-500 font-semibold border-b border-gray-100 text-left"
                >
                  <th class="py-3 px-5">Previous Expiry</th>
                  <th class="py-3 px-5">New Expiry</th>
                  <th class="py-3 px-5">Next Renew</th>
                  <th class="py-3 px-5">Application Date</th>
                  <th class="py-3 px-5">Received Date</th>
                  <th class="py-3 px-5">Total Fees</th>
                  <th class="py-3 px-5">Type</th>
                  <th class="py-3 px-5">Status</th>
                  <th class="py-3 px-5">Created</th>
                  <th v-if="canApprove" class="py-3 px-5">Approval</th>
                  <th class="py-3 px-5">Details</th>
                </tr>
              </thead>
              <tbody class="text-gray-700">
                <tr
                  v-for="ev in paginatedEvents()"
                  :key="ev.RenewalID"
                  class="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td class="py-3 px-5">{{ formatDate(ev.PreviousExpiryDate) }}</td>
                  <td class="py-3 px-5">{{ formatDate(ev.NewExpiryDate) }}</td>
                  <td class="py-3 px-5">{{ formatDate(ev.NextRenewDate) }}</td>
                  <td class="py-3 px-5">{{ formatDate(ev.RenewalApplicationDate) }}</td>
                  <td class="py-3 px-5">
                    {{ formatDate(ev.RenewalLicenseReceivedDate) }}
                  </td>
                  <td class="py-3 px-5 font-medium text-gray-800 text-right">
                    {{ ev.TotalFees ?? "-" }}
                  </td>
                  <td class="py-3 px-5">
                    <span
                      class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="
                        ev.RenewalType === 'Initial'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-indigo-50 text-indigo-700'
                      "
                    >
                      {{ ev.RenewalType || "-" }}
                    </span>
                  </td>

                  <td class="py-3 px-5">
                    <span
                      class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="
                        ev.RenewalStatus === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-yellow-50 text-yellow-700'
                      "
                    >
                      {{ ev.RenewalStatus || "-" }}
                    </span>
                  </td>
                  <td class="py-3 px-5">{{ formatDate(ev.CreatedAt) }}</td>
                  <td v-if="canApprove" class="py-3 px-5">
                    <a-button
                      :disabled="ev.RenewalStatus === 'Completed'"
                      :class="
                        ev.RenewalStatus === 'Completed'
                          ? ''
                          : '!text-white bg-[#002f23] hover:!text-white'
                      "
                      @click="approveRenewal(ev)"
                    >
                      Approve
                    </a-button>
                  </td>
                  <td class="py-3 px-5">
                    <a-button
                      size="small"
                      class="inline-flex items-center gap-1 bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      title="View details"
                      @click="viewRenewal(ev)"
                    >
                      <EyeOutlined /> View
                    </a-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div
            v-if="events.length > 0"
            class="flex justify-end p-4 border-t border-gray-100"
          >
            <a-pagination
              v-model:current="currentPage"
              :total="events.length"
              :page-size="pageSize"
              :show-size-changer="false"
            />
          </div>
        </div>
      </template>
    </div>
  </MainLayout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ReloadOutlined, EyeOutlined, ArrowLeftOutlined } from "@ant-design/icons-vue";
import MainLayout from "@/components/layout/MainLayout.vue";
import { apiBase } from "@/config";
import { getTokenConfig } from "@/utilities/tokenConfig";
import { showNotification } from "@/utilities/notification";
import { can } from "@/utilities/common";
import axios from "axios";

// Whether the current user may approve renewals — gates the whole Approval column.
const canApprove = can("license_master.approve");

const route = useRoute();
const router = useRouter();

const goBack = () => router.back();

const viewRenewal = (ev) => {
  router.push({ name: "renewal-detail", params: { id: ev.RenewalID } });
};

// Approve a renewal -> mark its status Completed.
const approveRenewal = async (ev) => {
  try {
    const res = await axios.patch(
      `${apiBase}/renewals/${ev.RenewalID}/status`,
      { RenewalStatus: "Completed" },
      getTokenConfig()
    );
    if (res?.data?.success) {
      showNotification("success", res?.data?.message || "Renewal approved");
      getHistory();
    } else {
      showNotification("error", res?.data?.message || "Failed to approve renewal");
    }
  } catch (error) {
    showNotification(
      "error",
      error?.response?.data?.message || "Failed to approve renewal"
    );
  }
};

const isLoading = ref(false);
const license = ref(null);
const events = ref([]);

const currentPage = ref(1);
const pageSize = ref(10);

const paginatedEvents = () => {
  const start = (currentPage.value - 1) * pageSize.value;
  return events.value.slice(start, start + pageSize.value);
};

const getHistory = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/licenses/${route.params.id}/history`,
      getTokenConfig()
    );
    const data = res?.data?.success ? res.data.data : null;
    license.value = data?.license ?? null;
    events.value = Array.isArray(data?.events) ? data.events : [];
  } catch (error) {
    license.value = null;
    events.value = [];
    showNotification("error", "Failed to fetch renewal history");
  } finally {
    isLoading.value = false;
  }
};

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

onMounted(() => {
  getHistory();
});
</script>
