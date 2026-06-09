<template>
  <MainLayout>
    <div class="-m-5 p-6 bg-[#f4f6fb] min-h-full">
      <!-- Top bar: breadcrumb + go back -->
      <div class="flex items-center justify-between mb-4">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <router-link :to="{ name: 'license' }">License</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>Add</a-breadcrumb-item>
        </a-breadcrumb>
        <a-button class="flex items-center gap-1" @click="goBack">
          <ArrowLeftOutlined /> Go Back
        </a-button>
      </div>

      <h1 class="text-2xl font-bold text-gray-800 mb-6">Add License</h1>

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
              <a-input v-model:value="form.LicenseName" placeholder="e.g. Trade License" />
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
              <a-select
                v-model:value="form.ReminderDays"
                mode="tags"
                placeholder="e.g. 30, 15, 7"
                :options="reminderPresetOptions"
              />
            </a-form-item>
          </div>
        </div>

        <!-- Financials -->
        <div class="p-6 border-t border-gray-100">
          <h2 class="text-base font-bold text-gray-800 mb-4">Financials</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-x-6">
            <a-form-item label="License Fee" name="LicenseFee">
              <a-input-number v-model:value="form.LicenseFee" class="w-full" :min="0" />
            </a-form-item>
            <a-form-item label="Renew Fee" name="RenewFee">
              <a-input-number v-model:value="form.RenewFee" class="w-full" :min="0" />
            </a-form-item>
            <a-form-item label="Renew VAT / AIT" name="RenewVatAIT">
              <a-input-number v-model:value="form.RenewVatAIT" class="w-full" :min="0" />
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
              <a-input v-model:value="form.contact.name" placeholder="e.g. Mr. Rahim Uddin" />
            </a-form-item>
            <a-form-item label="Designation">
              <a-input
                v-model:value="form.contact.designation"
                placeholder="e.g. Compliance Officer"
              />
            </a-form-item>
            <a-form-item label="Email">
              <a-input v-model:value="form.contact.email" placeholder="e.g. name@email.com" />
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
          <a-upload
            v-model:file-list="fileList"
            :before-upload="beforeUpload"
            :multiple="true"
            accept=".pdf,.xls,.xlsx,.csv,.svg,.png,.jpg,.jpeg,.doc,.docx"
          >
            <a-button>
              <UploadOutlined /> Select Files
            </a-button>
          </a-upload>
          <p class="text-xs text-gray-400 mt-2">
            You can attach multiple files (PDF, Excel, SVG, images, Word).
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
            Save License
          </a-button>
        </div>
      </a-form>
    </div>
  </MainLayout>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons-vue";
import MainLayout from "@/components/layout/MainLayout.vue";
import { apiBase } from "@/config";
import { getTokenConfig } from "@/utilities/tokenConfig";
import { showNotification } from "@/utilities/notification";
import axios from "axios";

const router = useRouter();

const isSubmitting = ref(false);
const loadingOptions = ref(false);
const fileList = ref([]);

const businessOptions = ref([]);
const categoryOptions = ref([]);

const reminderPresetOptions = [
  { value: "30", label: "30" },
  { value: "15", label: "15" },
  { value: "7", label: "7" },
];

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
  ReminderDays: ["30", "15", "7"],
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

// Prevent ant-design from auto-uploading; we submit the files ourselves.
const beforeUpload = () => false;

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

    (form.ReminderDays || []).forEach((d, i) => {
      fd.append(`ReminderDays[${i}]`, d);
    });

    Object.entries(form.contact).forEach(([key, val]) => {
      if (val) fd.append(`ContactDetails[${key}]`, val);
    });

    fileList.value.forEach((f, i) => {
      const raw = f.originFileObj || f;
      fd.append(`Documents[${i}]`, raw);
    });

    const res = await axios.post(`${apiBase}/licenses`, fd, getTokenConfig());

    if (res?.data?.success) {
      showNotification("success", res?.data?.message || "License created");
      router.push({ name: "license" });
    } else {
      showNotification("error", res?.data?.message || "Failed to create license");
    }
  } catch (error) {
    const data = error?.response?.data;
    const firstError = data?.errors ? Object.values(data.errors)?.[0]?.[0] : null;
    showNotification(
      "error",
      firstError || data?.message || "Failed to create license"
    );
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  loadOptions();
});
</script>
