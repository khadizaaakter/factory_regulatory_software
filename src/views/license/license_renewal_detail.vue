<template>
  <MainLayout>
    <div class="-m-5 p-6 bg-[#f4f6fb] min-h-full">
      <!-- Top bar: breadcrumb + go back -->
      <div class="flex items-center justify-between mb-4">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link :to="{ name: 'license' }">License</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item v-if="renewal">
            <router-link
              :to="{ name: 'license-history', params: { id: renewal.LicenseID } }"
            >
              Renewal History
            </router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>Renewal {{ route.params.id }}</a-breadcrumb-item>
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
        v-else-if="!renewal"
        class="bg-white rounded-xl border border-gray-100 shadow-sm p-10"
      >
        <a-empty description="Renewal not found" />
      </div>

      <!-- Single card -->
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
              {{ getInitials(renewal.LicenseName) }}
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-800">
                {{ renewal.LicenseName || "-" }}
              </h1>
              <p class="text-gray-500 text-sm">{{ renewal.LicenseNumber || "-" }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="inline-block px-3 py-1 rounded-full text-xs font-medium"
              :class="
                renewal.RenewalType === 'Initial'
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-indigo-50 text-indigo-700'
              "
            >
              {{ renewal.RenewalType || "-" }}
            </span>
            <span
              class="inline-block px-3 py-1 rounded-full text-xs font-medium"
              :class="
                renewal.RenewalStatus === 'Completed'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-yellow-50 text-yellow-700'
              "
            >
              {{ renewal.RenewalStatus || "-" }}
            </span>
          </div>
        </div>

        <!-- General / Dates / Financials -->
        <dl class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          <div v-for="row in infoRows()" :key="row.label">
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
            <dd class="text-sm text-gray-800">{{ renewal.TermsAndConditions || "-" }}</dd>
          </div>
          <div>
            <dt class="text-xs font-bold text-gray-800 uppercase">Contact Details</dt>
            <dd class="text-sm text-gray-800">
              <template v-if="renewal.ContactDetails">
                <div>Name: {{ renewal.ContactDetails.name || "-" }}</div>
                <div>Designation: {{ renewal.ContactDetails.designation || "-" }}</div>
                <div>Email: {{ renewal.ContactDetails.email || "-" }}</div>
                <div>Phone: {{ renewal.ContactDetails.phone || "-" }}</div>
                <div>Address: {{ renewal.ContactDetails.address || "-" }}</div>
              </template>
              <template v-else>-</template>
            </dd>
          </div>
          <div>
            <dt class="text-xs font-bold text-gray-800 uppercase">Remarks</dt>
            <dd class="text-sm text-gray-800">{{ renewal.Remarks || "-" }}</dd>
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
import { DownloadOutlined, ArrowLeftOutlined } from "@ant-design/icons-vue";
import MainLayout from "@/components/layout/MainLayout.vue";
import { apiBase } from "@/config";
import { getTokenConfig } from "@/utilities/tokenConfig";
import { showNotification } from "@/utilities/notification";
import axios from "axios";

const route = useRoute();
const router = useRouter();

const goBack = () => router.back();

const isLoading = ref(false);
const renewal = ref(null);

const documents = () =>
  Array.isArray(renewal.value?.documents) ? renewal.value.documents : [];

const getRenewal = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/renewals/${route.params.id}`,
      getTokenConfig()
    );
    renewal.value = res?.data?.success ? res.data.data : null;
  } catch (error) {
    renewal.value = null;
    showNotification("error", "Failed to fetch renewal");
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

const infoRows = () => {
  const r = renewal.value || {};
  return [
    { label: "Renewal Type", value: r.RenewalType },
    { label: "Renewal Status", value: r.RenewalStatus },
    { label: "Current Status", value: r.CurrentStatus },
    { label: "Issuing Authority", value: r.IssuingAuthority },
    { label: "Scope of License", value: r.ScopeOfLicense },
    {
      label: "Reminder Days",
      value: Array.isArray(r.ReminderDays) ? r.ReminderDays.join(", ") : "-",
    },
    { label: "Previous Expiry Date", value: formatDate(r.PreviousExpiryDate) },
    { label: "New Expiry Date", value: formatDate(r.NewExpiryDate) },
    { label: "Next Renew Date", value: formatDate(r.NextRenewDate) },
    { label: "Application Date", value: formatDate(r.RenewalApplicationDate) },
    { label: "License Received Date", value: formatDate(r.RenewalLicenseReceivedDate) },
    { label: "License Fee", value: r.LicenseFee },
    { label: "Renew Fee", value: r.RenewFee },
    { label: "Renew VAT / AIT", value: r.RenewVatAIT },
    { label: "LR Fund", value: r.LRFund },
    { label: "Office Expenses", value: r.OfficeExpenses },
  ];
};

onMounted(() => {
  getRenewal();
});
</script>
