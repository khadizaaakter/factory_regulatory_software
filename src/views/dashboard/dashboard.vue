<template>
  <MainLayout>
    <div class="p-6">
      <h1 class="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

      <!-- Status cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div
          v-for="card in getStatusCards()"
          :key="card.key"
          class="bg-white rounded-xl border-2 shadow-sm p-5 flex items-center justify-between cursor-pointer transition-all"
          :class="[
            card.borderColor,
            activeFilter === card.key ? card.activeBg : 'hover:shadow-md',
          ]"
          @click="toggleFilter(card.key)"
        >
          <div>
            <p class="text-sm font-semibold" :class="card.labelColor">{{ card.label }}</p>
            <div class="mt-2 h-10 flex items-center">
              <a-spin v-if="isLoading" size="small" />
              <p v-else class="text-3xl font-bold text-gray-800">{{ card.count }}</p>
            </div>
          </div>
          <div
            class="rounded-full w-14 h-14 flex items-center justify-center shrink-0"
            :class="card.iconBg"
          >
            <component :is="card.icon" :class="['text-2xl', card.iconColor]" />
          </div>
        </div>
      </div>

      <!-- License table (shown when a card is clicked) -->
      <div v-if="activeFilter" class="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 class="font-semibold text-gray-700">
            <span
              class="inline-block w-2.5 h-2.5 rounded-full mr-2"
              :class="getActiveCard()?.dotColor"
            ></span>
            {{ getActiveCard()?.label }} Licenses
            <span class="ml-2 text-gray-400 font-normal text-sm">({{ getFilteredLicenses().length }})</span>
          </h2>
          <a-button size="small" @click="activeFilter = null">✕ Close</a-button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="text-gray-500 font-semibold border-b border-gray-100 text-left">
                <th class="py-3 px-5">License Name</th>
                <th class="py-3 px-5">License Number</th>
                <th class="py-3 px-5">Business</th>
                <th class="py-3 px-5">Category</th>
                <th class="py-3 px-5">Expiry Date</th>
                <th class="py-3 px-5">Reminder</th>
              </tr>
            </thead>
            <tbody class="text-gray-700">
              <tr v-if="getFilteredLicenses().length === 0">
                <td colspan="6" class="py-10 text-center">
                  <a-empty description="No licenses found" />
                </td>
              </tr>
              <tr
                v-for="(license, index) in getFilteredLicenses()"
                :key="license.LicenseID ?? index"
                class="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <td class="py-3 px-5">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-8 h-8 rounded-full bg-[#002f23] text-white flex items-center justify-center text-xs font-bold shrink-0"
                    >
                      {{ getInitials(license?.LicenseName) }}
                    </div>
                    <p class="font-semibold text-gray-800">{{ license?.LicenseName || "-" }}</p>
                  </div>
                </td>
                <td class="py-3 px-5">{{ license?.LicenseNumber || "-" }}</td>
                <td class="py-3 px-5">{{ license?.business?.name || "-" }}</td>
                <td class="py-3 px-5">{{ license?.category?.name || "-" }}</td>
                <td class="py-3 px-5">{{ formatDate(license?.ExpiryDate) }}</td>
                <td class="py-3 px-5">
                  <span
                    class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="badgeClass(license)"
                  >
                    {{ getActiveCard()?.label }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import MainLayout from "@/components/layout/MainLayout.vue";
import { apiBase } from "@/config";
import { getTokenConfig } from "@/utilities/tokenConfig";
import {
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons-vue";

const isLoading = ref(false);
const licenseList = ref([]);
const activeFilter = ref(null);

// ── License classification ────────────────────────────────────────────────────
// Mirrors the same logic used in license.vue:
//   ReminderDays = [red_days, yellow_days, green_days] from the form
//   Each value = ExpiryDate − reminderDate in days
//   → Convert back: reminderDate = ExpiryDate − days
const reminderDayToDate = (expDate, days) => {
  const d = new Date(expDate);
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
};

const classifyLicense = (license) => {
  const expiry = license?.ExpiryDate;
  if (!expiry) return null;
  const exp = new Date(expiry);
  if (Number.isNaN(exp.getTime())) return null;

  const rd = (Array.isArray(license?.ReminderDays) ? license.ReminderDays : [])
    .map(Number)
    .filter((n) => !Number.isNaN(n));
  if (!rd.length) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const redDate    = rd[0] != null ? reminderDayToDate(exp, rd[0]) : null;
  const yellowDate = rd[1] != null ? reminderDayToDate(exp, rd[1]) : null;

  if (redDate    && today >= redDate)    return "expired";
  if (yellowDate && today >= yellowDate) return "expiring_soon";
  return "safe";
};

// ── Counts ────────────────────────────────────────────────────────────────────
const getExpiredLicenses      = () => licenseList.value.filter((l) => classifyLicense(l) === "expired");
const getExpiringSoonLicenses = () => licenseList.value.filter((l) => classifyLicense(l) === "expiring_soon");
const getSafeLicenses         = () => licenseList.value.filter((l) => classifyLicense(l) === "safe");

const getStatusCards = () => [
  {
    key: "expired",
    label: "Expired",
    count: getExpiredLicenses().length,
    icon: CloseCircleOutlined,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    labelColor: "text-red-700",
    borderColor: "border-red-100",
    activeBg: "bg-red-50",
    dotColor: "bg-red-500",
    badgeCls: "bg-red-50 text-red-700",
  },
  {
    key: "expiring_soon",
    label: "Expiring Soon",
    count: getExpiringSoonLicenses().length,
    icon: WarningOutlined,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    labelColor: "text-yellow-700",
    borderColor: "border-yellow-100",
    activeBg: "bg-yellow-50",
    dotColor: "bg-yellow-500",
    badgeCls: "bg-yellow-50 text-yellow-700",
  },
  {
    key: "safe",
    label: "Safe",
    count: getSafeLicenses().length,
    icon: CheckCircleOutlined,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    labelColor: "text-green-700",
    borderColor: "border-green-100",
    activeBg: "bg-green-50",
    dotColor: "bg-green-500",
    badgeCls: "bg-green-50 text-green-700",
  },
];

const getActiveCard = () => getStatusCards().find((c) => c.key === activeFilter.value);

const getFilteredLicenses = () => {
  if (!activeFilter.value) return [];
  if (activeFilter.value === "expired")       return getExpiredLicenses();
  if (activeFilter.value === "expiring_soon") return getExpiringSoonLicenses();
  if (activeFilter.value === "safe")          return getSafeLicenses();
  return [];
};

const toggleFilter = (key) => {
  activeFilter.value = activeFilter.value === key ? null : key;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
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
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const badgeClass = (license) => getActiveCard()?.badgeCls ?? "";

// ── API ───────────────────────────────────────────────────────────────────────
const getLicenses = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get(`${apiBase}/licenses?per_page=1000`, getTokenConfig());
    const payload = res?.data?.data;
    const list = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
      ? payload
      : [];
    licenseList.value = list;
  } catch {
    licenseList.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getLicenses();
});
</script>
