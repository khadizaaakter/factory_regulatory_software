<template>
  <MainLayout>
    <div class="-m-5 p-6 bg-[#f4f6fb] min-h-full">
      <!-- Top bar: breadcrumb + go back -->
      <div class="flex items-center justify-between mb-4">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link :to="{ name: 'license' }">License</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ route.params.id }}</a-breadcrumb-item>
        </a-breadcrumb>
        <a-button class="flex items-center gap-1" @click="goBack">
          <ArrowLeftOutlined /> Go Back
        </a-button>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="py-20 text-center">
        <a-spin />
      </div>

      <!-- Not found -->
      <div
        v-else-if="!license"
        class="bg-white rounded-xl border border-gray-100 shadow-sm p-10"
      >
        <a-empty description="License not found" />
      </div>

      <!-- Everything in a single card -->
      <div
        v-else
        class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <!-- Header -->
        <div
          class="p-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100"
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
            <!-- Renewal history count (clickable when there are renewals) -->
            <div
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100"
              :class="
                (license.renewal_history_count ?? 0) > 0
                  ? 'cursor-pointer hover:bg-indigo-100 transition-colors'
                  : ''
              "
              :title="
                (license.renewal_history_count ?? 0) > 0
                  ? 'View renewal history'
                  : 'No renewals yet'
              "
              @click="goToHistory"
            >
              <ReloadOutlined class="text-indigo-500" />
              <span class="text-lg font-bold text-indigo-700 leading-none">
                {{ license.renewal_history_count ?? 0 }}
              </span>
              <span class="text-sm text-indigo-500 leading-none">
                Renewal{{ (license.renewal_history_count ?? 0) === 1 ? "" : "s" }}
              </span>
            </div>
            <span
              v-if="reminderBadge(license)"
              class="inline-block px-3 py-1 rounded-full text-sm font-medium"
              :class="reminderBadge(license).cls"
            >
              {{ reminderBadge(license).text }}
            </span>
            <span
              class="inline-block px-3 py-1 rounded-full text-sm font-medium"
              :class="
                license.IsActive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-gray-100 text-gray-500'
              "
            >
              {{ license.IsActive ? "Active" : "Inactive" }}
            </span>
          </div>
        </div>

        <!-- General / Dates / Financials -->
        <dl class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          <div
            v-for="row in generalRows().concat(dateRows(), financialRows())"
            :key="row.label"
          >
            <dt class="text-xs font-bold text-gray-800 uppercase">
              {{ row.label }}
            </dt>
            <dd class="text-sm text-gray-800">{{ row.value || "-" }}</dd>
          </div>
        </dl>

        <!-- Additional information -->
        <dl
          class="p-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4"
        >
          <div>
            <dt class="text-xs font-bold text-gray-800 uppercase">Terms & Conditions</dt>
            <dd class="text-sm text-gray-800">
              {{ license.TermsAndConditions || "-" }}
            </dd>
          </div>
          <div>
            <dt class="text-xs font-bold text-gray-800 uppercase">Contact Details</dt>
            <dd class="text-sm text-gray-800">
              <template v-if="license.ContactDetails">
                <div>Name: {{ license.ContactDetails.name || "-" }}</div>
                <div>Designation: {{ license.ContactDetails.designation || "-" }}</div>
                <div>Email: {{ license.ContactDetails.email || "-" }}</div>
              </template>
              <template v-else>-</template>
            </dd>
          </div>
          <div>
            <dt class="text-xs font-bold text-gray-800 uppercase">Remarks</dt>
            <dd class="text-sm text-gray-800">{{ license.Remarks || "-" }}</dd>
          </div>
        </dl>

        <!-- Documents -->
        <div class="p-6 border-t border-gray-100">
          <h2 class="text-base font-bold text-gray-800 mb-4">
            Documents
            <span class="text-gray-400 font-normal">({{ documents().length }})</span>
          </h2>

          <div v-if="documents().length === 0">
            <a-empty description="No documents" />
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr
                  class="text-gray-500 font-semibold border-b border-gray-100 text-left"
                >
                  <th class="py-2 px-4">File Name</th>
                  <th class="py-2 px-4">Type</th>
                  <th class="py-2 px-4">Size</th>
                  <th class="py-2 px-4">Uploaded</th>
                </tr>
              </thead>
              <tbody class="text-gray-700">
                <tr
                  v-for="doc in documents()"
                  :key="doc.DocumentID"
                  class="border-b border-gray-50 hover:bg-gray-50"
                >
                  <td class="py-2 px-4">
                    <span
                      class="inline-flex items-center gap-2 text-blue-600 hover:underline cursor-pointer"
                      @click="downloadDocument(doc)"
                    >
                      <DownloadOutlined />
                      {{ doc.FileName || "-" }}
                    </span>
                  </td>
                  <td class="py-2 px-4 uppercase">{{ doc.FileType || "-" }}</td>
                  <td class="py-2 px-4">{{ formatSize(doc.FileSize) }}</td>
                  <td class="py-2 px-4">{{ formatDate(doc.CreatedAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  DownloadOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons-vue";
import MainLayout from "@/components/layout/MainLayout.vue";
import { apiBase } from "@/config";
import { getTokenConfig } from "@/utilities/tokenConfig";
import { showNotification } from "@/utilities/notification";
import axios from "axios";

const route = useRoute();
const router = useRouter();

const goBack = () => router.back();

// Open the renewal history page only when there are renewals.
const goToHistory = () => {
  if ((license.value?.renewal_history_count ?? 0) > 0) {
    router.push({ name: "license-history", params: { id: route.params.id } });
  }
};

const isLoading = ref(false);
const license = ref(null);

const documents = () =>
  Array.isArray(license.value?.documents) ? license.value.documents : [];

const getLicense = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/licenses/${route.params.id}`,
      getTokenConfig()
    );
    license.value = res?.data?.success ? res.data.data : null;
  } catch (error) {
    license.value = null;
    showNotification("error", "Failed to fetch license");
  } finally {
    isLoading.value = false;
  }
};

// ---- actions ----
const downloadDocument = async (doc) => {
  try {
    const res = await axios.get(`${apiBase}/documents/${doc.DocumentID}/download`, {
      ...getTokenConfig(),
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = doc.FileName || `document-${doc.DocumentID}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    showNotification("error", "Failed to download document");
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

const formatSize = (bytes) => {
  const n = Number(bytes);
  if (!n || Number.isNaN(n)) return "-";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};

// Same reminder logic as the list page.
const reminderBadge = (lic) => {
  const expiry = lic?.ExpiryDate;
  if (!expiry) return null;
  const exp = new Date(expiry);
  if (Number.isNaN(exp.getTime())) return null;

  const today = new Date();
  exp.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const days = Math.round((exp - today) / 86400000);

  const tiers = (Array.isArray(lic?.ReminderDays) ? lic.ReminderDays : [30, 15, 7])
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

// ---- row definitions ----
const generalRows = () => [
  { label: "License Name", value: license.value?.LicenseName },
  { label: "License Number", value: license.value?.LicenseNumber },
  { label: "Issuing Authority", value: license.value?.IssuingAuthority },
  { label: "Business", value: license.value?.business?.name },
  { label: "Category", value: license.value?.category?.name },
  { label: "Scope of License", value: license.value?.ScopeOfLicense },
  { label: "Current Renewal Status", value: license.value?.CurrentRenewalStatus },
];

const dateRows = () => [
  { label: "First Issued Date", value: formatDate(license.value?.FirstIssuedDate) },
  { label: "Renew Date", value: formatDate(license.value?.RenewDate) },
  { label: "Expiry Date", value: formatDate(license.value?.ExpiryDate) },
  {
    label: "Reminder Days",
    value: Array.isArray(license.value?.ReminderDays)
      ? license.value.ReminderDays.join(", ")
      : "-",
  },
];

const financialRows = () => [
  { label: "License Fee", value: license.value?.LicenseFee },
  { label: "Renew Fee", value: license.value?.RenewFee },
  { label: "Renew VAT / AIT", value: license.value?.RenewVatAIT },
  { label: "Office Expenses", value: license.value?.OfficeExpenses },
];

onMounted(() => {
  getLicense();
});
</script>
