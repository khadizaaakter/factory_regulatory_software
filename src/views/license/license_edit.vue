<template>
  <MainLayout>
    <div class="-m-5 p-6 bg-[#f4f6fb] min-h-full">
      <!-- Top bar: breadcrumb + go back -->
      <div class="flex items-center justify-between mb-4">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link :to="{ name: 'license' }">License</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>Edit</a-breadcrumb-item>
        </a-breadcrumb>
        <a-button class="flex items-center gap-1" @click="goBack">
          <ArrowLeftOutlined /> Go Back
        </a-button>
      </div>

      <h1 class="text-2xl font-bold text-gray-800 mb-6">Edit License</h1>

      <a-form :model="form" layout="vertical" @finish="submit">
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
          <!-- General -->
          <div class="p-6">
            <h2 class="text-base font-bold text-gray-800 mb-4">General</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <a-form-item
                label="License Name"
                name="LicenseName"
                :rules="[{ required: true, message: 'Please enter license name' }]"
              >
                <a-input
                  v-model:value="form.LicenseName"
                  placeholder="e.g. Trade License"
                />
              </a-form-item>

              <a-form-item label="License Number" name="LicenseNumber">
                <a-input
                  v-model:value="form.LicenseNumber"
                  placeholder="e.g. TL-2024-0043"
                />
              </a-form-item>

              <a-form-item label="Issuing Authority" name="IssuingAuthority">
                <a-input
                  v-model:value="form.IssuingAuthority"
                  placeholder="e.g. City Council"
                />
              </a-form-item>

              <a-form-item
                label="Business"
                name="BusinessId"
                :rules="[{ required: true, message: 'Please select a business' }]"
              >
                <a-select
                  v-model:value="form.BusinessId"
                  placeholder="Select business"
                  :options="businessOptions"
                  :loading="loadingOptions"
                  show-search
                  option-filter-prop="label"
                />
              </a-form-item>

              <a-form-item
                label="License Category"
                name="LicenseCategoryId"
                :rules="[{ required: true, message: 'Please select a category' }]"
              >
                <a-select
                  v-model:value="form.LicenseCategoryId"
                  placeholder="Select category"
                  :options="categoryOptions"
                  :loading="loadingOptions"
                  show-search
                  option-filter-prop="label"
                />
              </a-form-item>

              <a-form-item label="Scope of License" name="ScopeOfLicense">
                <a-input
                  v-model:value="form.ScopeOfLicense"
                  placeholder="e.g. Retail trade activities"
                />
              </a-form-item>
            </div>
          </div>

          <!-- Dates & Reminders -->
          <div class="p-6 border-t border-gray-100">
            <h2 class="text-base font-bold text-gray-800 mb-4">Dates & Reminders</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <a-form-item label="First Issued Date" name="FirstIssuedDate">
                <a-date-picker
                  v-model:value="form.FirstIssuedDate"
                  value-format="YYYY-MM-DD"
                  class="w-full"
                />
              </a-form-item>

              <a-form-item label="Renew Date" name="RenewDate">
                <a-date-picker
                  v-model:value="form.RenewDate"
                  value-format="YYYY-MM-DD"
                  class="w-full"
                />
              </a-form-item>

              <a-form-item label="Expiry Date" name="ExpiryDate">
                <a-date-picker
                  v-model:value="form.ExpiryDate"
                  value-format="YYYY-MM-DD"
                  class="w-full"
                />
              </a-form-item>

              <a-form-item label="Reminder Days" name="ReminderDays">
                <div class="flex items-center gap-3 flex-wrap">
                  <a-date-picker
                    v-model:value="reminders.red"
                    value-format="YYYY-MM-DD"
                    placeholder="Expired"
                    class="rem-pick rem-red"
                  />
                  <a-date-picker
                    v-model:value="reminders.yellow"
                    value-format="YYYY-MM-DD"
                    placeholder="Expiring Soon"
                    class="rem-pick rem-yellow"
                  />
                  <a-date-picker
                    v-model:value="reminders.green"
                    value-format="YYYY-MM-DD"
                    placeholder="Safe"
                    class="rem-pick rem-green"
                  />
                </div>
              </a-form-item>
            </div>
          </div>

          <!-- Financials -->
          <div class="p-6 border-t border-gray-100">
            <h2 class="text-base font-bold text-gray-800 mb-4">Financials</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-x-6">
              <a-form-item label="License Fee" name="LicenseFee ">
                <a-input-number v-model:value="form.LicenseFee" class="w-full" :min="0" />
              </a-form-item>
              <a-form-item label="Renew Fee" name="RenewFee">
                <a-input-number v-model:value="form.RenewFee" class="w-full" :min="0" />
              </a-form-item>
              <a-form-item label="Renew VAT / AIT" name="RenewVatAIT">
                <a-input-number
                  v-model:value="form.RenewVatAIT"
                  class="w-full"
                  :min="0"
                />
              </a-form-item>
              <a-form-item label="Office Expenses" name="OfficeExpenses">
                <a-input-number
                  v-model:value="form.OfficeExpenses"
                  class="w-full"
                  :min="0"
                />
              </a-form-item>
            </div>
          </div>

          <!-- Contact Details -->
          <div class="p-6 border-t border-gray-100">
            <h2 class="text-base font-bold text-gray-800 mb-4">Contact Details</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <a-form-item label="Name">
                <a-input
                  v-model:value="form.contact.name"
                  placeholder="e.g. Mr. Rahim Uddin"
                />
              </a-form-item>
              <a-form-item label="Designation">
                <a-input
                  v-model:value="form.contact.designation"
                  placeholder="e.g. Compliance Officer"
                />
              </a-form-item>
              <a-form-item label="Email">
                <a-input
                  v-model:value="form.contact.email"
                  placeholder="e.g. name@email.com"
                />
              </a-form-item>
              <a-form-item label="Phone">
                <a-input v-model:value="form.contact.phone" placeholder="e.g. +8801..." />
              </a-form-item>
              <a-form-item label="Address" class="md:col-span-2">
                <a-input v-model:value="form.contact.address" placeholder="Address" />
              </a-form-item>
            </div>
          </div>

          <!-- Notes -->
          <div class="p-6 border-t border-gray-100">
            <h2 class="text-base font-bold text-gray-800 mb-4">Additional Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <a-form-item label="Terms & Conditions" name="TermsAndConditions">
                <a-textarea v-model:value="form.TermsAndConditions" :rows="3" />
              </a-form-item>
              <a-form-item label="Remarks" name="Remarks">
                <a-textarea v-model:value="form.Remarks" :rows="3" />
              </a-form-item>
            </div>
          </div>

          <!-- Documents -->
          <div class="p-6 border-t border-gray-100">
            <h2 class="text-base font-bold text-gray-800 mb-4">Documents</h2>

            <!-- Existing documents -->
            <div v-if="existingDocs.length" class="mb-4 space-y-2">
              <p class="text-xs font-semibold text-gray-400 uppercase">
                Existing documents
              </p>
              <div
                v-for="doc in existingDocs"
                :key="doc.DocumentID"
                class="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50"
              >
                <span
                  class="inline-flex items-center gap-2 text-blue-600 hover:underline cursor-pointer text-sm"
                  @click="downloadDocument(doc)"
                >
                  <DownloadOutlined />
                  {{ doc.FileName || "-" }}
                </span>
                <a-popconfirm
                  title="Remove this document?"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="removeExistingDoc(doc)"
                >
                  <a-button size="small" danger type="text" title="Remove">
                    <DeleteOutlined />
                  </a-button>
                </a-popconfirm>
              </div>
            </div>

            <!-- New uploads -->
            <a-upload
              v-model:file-list="fileList"
              :before-upload="beforeUpload"
              :multiple="true"
              accept=".pdf,.xls,.xlsx,.csv,.svg,.png,.jpg,.jpeg,.doc,.docx"
            >
              <a-button> <UploadOutlined /> Select Files </a-button>
            </a-upload>
            <p class="text-xs text-gray-400 mt-2">
              Attach new files to add to this license (PDF, Excel, SVG, images, Word).
            </p>
          </div>
        </div>

        <!-- Footer actions -->
        <div class="flex justify-end gap-2">
          <a-button @click="goBack" :disabled="isSubmitting">Cancel</a-button>
          <a-button
            type="primary"
            html-type="submit"
            :loading="isSubmitting"
            class="bg-[#002f23]"
          >
            Update License
          </a-button>
        </div>
      </a-form>
    </div>
  </MainLayout>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  UploadOutlined,
  ArrowLeftOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import MainLayout from "@/components/layout/MainLayout.vue";
import { apiBase } from "@/config";
import { getTokenConfig } from "@/utilities/tokenConfig";
import { showNotification } from "@/utilities/notification";
import axios from "axios";

const router = useRouter();
const route = useRoute();

const licenseId = () => route.params.id;

const isSubmitting = ref(false);
const loadingOptions = ref(false);
const fileList = ref([]);

// Existing documents loaded from the license, and IDs the user marked to delete.
const existingDocs = ref([]);
const deletedDocIds = ref([]);

const businessOptions = ref([]);
const categoryOptions = ref([]);

// One reminder date per tier: red (<=7), yellow (8-15), green (16+).
const reminders = reactive({ red: null, yellow: null, green: null });

// day-count (e.g. 30) -> date string (ExpiryDate - 30 days).
const dayCountToDate = (n, expiry) => {
  if (n === undefined || n === null || Number.isNaN(Number(n))) return null;
  if (!expiry) return null;
  const exp = new Date(expiry);
  if (Number.isNaN(exp.getTime())) return null;
  exp.setDate(exp.getDate() - Number(n));
  const y = exp.getFullYear();
  const m = String(exp.getMonth() + 1).padStart(2, "0");
  const day = String(exp.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// date string -> day-count integer (ExpiryDate - date, in days).
const dateToDayCount = (dateStr) => {
  if (!dateStr || !form.ExpiryDate) return null;
  const exp = new Date(form.ExpiryDate);
  const d = new Date(dateStr);
  if (Number.isNaN(exp.getTime()) || Number.isNaN(d.getTime())) return null;
  const days = Math.round((exp - d) / 86400000);
  return days >= 0 ? days : null;
};

// Reminder dates converted back to integer day-counts for the API.
const reminderDays = () =>
  [reminders.red, reminders.yellow, reminders.green]
    .filter(Boolean)
    .map(dateToDayCount)
    .filter((v) => v !== null);

const form = reactive({
  LicenseName: "",
  LicenseNumber: "",
  IssuingAuthority: "",
  BusinessId: undefined,
  LicenseCategoryId: undefined,
  ScopeOfLicense: "",
  FirstIssuedDate: null,
  RenewDate: null,
  ExpiryDate: null,
  ReminderDays: [],
  LicenseFee: null,
  RenewFee: null,
  RenewVatAIT: null,
  OfficeExpenses: null,
  TermsAndConditions: "",
  Remarks: "",
  contact: {
    name: "",
    designation: "",
    email: "",
    phone: "",
    address: "",
  },
});

// ---- load dropdown options ----
const loadOptions = async () => {
  loadingOptions.value = true;
  try {
    const [bizRes, catRes] = await Promise.all([
      axios.get(`${apiBase}/businesses?per_page=100`, getTokenConfig()),
      axios.get(`${apiBase}/license-categories?per_page=100`, getTokenConfig()),
    ]);
    const bizList = Array.isArray(bizRes?.data?.data) ? bizRes.data.data : [];
    const catList = Array.isArray(catRes?.data?.data) ? catRes.data.data : [];
    businessOptions.value = bizList.map((b) => ({ value: b.id, label: b.name }));
    categoryOptions.value = catList.map((c) => ({ value: c.id, label: c.name }));
  } catch (error) {
    showNotification("error", "Failed to load businesses / categories");
  } finally {
    loadingOptions.value = false;
  }
};

// ---- prefill the form from the existing license ----
const loadLicense = async () => {
  try {
    const res = await axios.get(`${apiBase}/licenses/${licenseId()}`, getTokenConfig());
    const d = res?.data?.success ? res.data.data : null;
    if (!d) return;

    const toDate = (v) => (v ? String(v).slice(0, 10) : null);
    const toNum = (v) => (v === null || v === undefined || v === "" ? null : Number(v));

    form.LicenseName = d.LicenseName ?? "";
    form.LicenseNumber = d.LicenseNumber ?? "";
    form.IssuingAuthority = d.IssuingAuthority ?? "";
    form.BusinessId = d.BusinessId != null ? Number(d.BusinessId) : undefined;
    form.LicenseCategoryId =
      d.LicenseCategoryId != null ? Number(d.LicenseCategoryId) : undefined;
    form.ScopeOfLicense = d.ScopeOfLicense ?? "";
    form.FirstIssuedDate = toDate(d.FirstIssuedDate);
    form.RenewDate = toDate(d.RenewDate);
    form.ExpiryDate = toDate(d.ExpiryDate);
    // ReminderDays are day-counts (integers). Convert each to a date
    // (ExpiryDate - days) and fill the slots in order so every value shows.
    const rd = (Array.isArray(d.ReminderDays) ? d.ReminderDays : [])
      .map(Number)
      .filter((n) => !Number.isNaN(n));
    reminders.red = dayCountToDate(rd[0], d.ExpiryDate);
    reminders.yellow = dayCountToDate(rd[1], d.ExpiryDate);
    reminders.green = dayCountToDate(rd[2], d.ExpiryDate);
    form.LicenseFee = toNum(d.LicenseFee);
    form.RenewFee = toNum(d.RenewFee);
    form.RenewVatAIT = toNum(d.RenewVatAIT);
    form.OfficeExpenses = toNum(d.OfficeExpenses);
    form.TermsAndConditions = d.TermsAndConditions ?? "";
    form.Remarks = d.Remarks ?? "";

    const c = d.ContactDetails || {};
    form.contact.name = c.name ?? "";
    form.contact.designation = c.designation ?? "";
    form.contact.email = c.email ?? "";
    form.contact.phone = c.phone ?? "";
    form.contact.address = c.address ?? "";

    existingDocs.value = Array.isArray(d.documents) ? d.documents : [];
    deletedDocIds.value = [];
  } catch (error) {
    showNotification("error", "Failed to load license");
  }
};

const beforeUpload = () => false;

// Download an existing document (auth-protected, so fetch as a blob).
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

// Mark an existing document for deletion (removed from the view, sent on submit).
const removeExistingDoc = (doc) => {
  deletedDocIds.value.push(doc.DocumentID);
  existingDocs.value = existingDocs.value.filter((d) => d.DocumentID !== doc.DocumentID);
};

const goBack = () => router.push({ name: "license" });

const submit = async () => {
  isSubmitting.value = true;
  try {
    const fd = new FormData();
    const appendIf = (key, val) => {
      if (val !== null && val !== undefined && val !== "") fd.append(key, val);
    };

    appendIf("LicenseName", form.LicenseName);
    appendIf("IssuingAuthority", form.IssuingAuthority);
    appendIf("BusinessId", form.BusinessId);
    appendIf("LicenseNumber", form.LicenseNumber);
    appendIf("LicenseCategoryId", form.LicenseCategoryId);
    appendIf("ScopeOfLicense", form.ScopeOfLicense);
    appendIf("FirstIssuedDate", form.FirstIssuedDate);
    appendIf("RenewDate", form.RenewDate);
    appendIf("ExpiryDate", form.ExpiryDate);
    appendIf("LicenseFee", form.LicenseFee);
    appendIf("RenewFee", form.RenewFee);
    appendIf("RenewVatAIT", form.RenewVatAIT);
    appendIf("OfficeExpenses", form.OfficeExpenses);
    appendIf("TermsAndConditions", form.TermsAndConditions);
    appendIf("Remarks", form.Remarks);

    reminderDays().forEach((d, i) => {
      fd.append(`ReminderDays[${i}]`, d);
    });

    Object.entries(form.contact).forEach(([key, val]) => {
      if (val) fd.append(`ContactDetails[${key}]`, val);
    });

    fileList.value.forEach((f, i) => {
      const raw = f.originFileObj || f;
      fd.append(`Documents[${i}]`, raw);
    });

    // IDs of existing documents the user removed (field name pending backend confirmation).
    deletedDocIds.value.forEach((id, i) => {
      fd.append(`DeleteDocuments[${i}]`, id);
    });

    fd.append("_method", "PUT");

    const res = await axios.post(
      `${apiBase}/licenses/${licenseId()}`,
      fd,
      getTokenConfig()
    );

    if (res?.data?.success) {
      showNotification("success", res?.data?.message || "License updated");
      router.push({ name: "license" });
    } else {
      showNotification("error", res?.data?.message || "Failed to update license");
    }
  } catch (error) {
    const data = error?.response?.data;
    const firstError = data?.errors ? Object.values(data.errors)?.[0]?.[0] : null;
    showNotification("error", firstError || data?.message || "Failed to update license");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  loadOptions();
  loadLicense();
});
</script>

<style scoped>
/* Right-align the value inside all number inputs */
:deep(.ant-input-number-input) {
  text-align: right;
  padding-right: 25px;
}

/* Tier-coloured reminder date pickers */
:deep(.rem-red) {
  border-color: #fecaca;
  background: #fef2f2;
}
:deep(.rem-red .ant-picker-input > input),
:deep(.rem-red .ant-picker-suffix) {
  color: #b91c1c;
}
:deep(.rem-yellow) {
  border-color: #fde68a;
  background: #fffbeb;
}
:deep(.rem-yellow .ant-picker-input > input),
:deep(.rem-yellow .ant-picker-suffix) {
  color: #b45309;
}
:deep(.rem-green) {
  border-color: #bbf7d0;
  background: #f0fdf4;
}
:deep(.rem-green .ant-picker-input > input),
:deep(.rem-green .ant-picker-suffix) {
  color: #15803d;
}
:deep(.rem-red .ant-picker-input > input::placeholder) {
  color: #ef4444;
}
:deep(.rem-yellow .ant-picker-input > input::placeholder) {
  color: #d97706;
}
:deep(.rem-green .ant-picker-input > input::placeholder) {
  color: #16a34a;
}
</style>
