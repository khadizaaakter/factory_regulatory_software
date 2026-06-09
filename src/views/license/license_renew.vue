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
          <a-breadcrumb-item>Renew</a-breadcrumb-item>
        </a-breadcrumb>
        <a-button class="flex items-center gap-1" @click="goBack">
          <ArrowLeftOutlined /> Go Back
        </a-button>
      </div>

      <h1 class="text-2xl font-bold text-gray-800 mb-6">Renew License</h1>

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
                <a-input v-model:value="form.LicenseName" placeholder="License name" />
              </a-form-item>

              <a-form-item label="Issuing Authority" name="IssuingAuthority">
                <a-input
                  v-model:value="form.IssuingAuthority"
                  placeholder="Issuing authority"
                />
              </a-form-item>

              <a-form-item label="Current Status" name="CurrentStatus">
                <a-select v-model:value="form.CurrentStatus" placeholder="Select status">
                  <a-select-option value="Active" default>Active</a-select-option>
                  <a-select-option value="Inactive">Inactive</a-select-option>
                </a-select>
              </a-form-item>
            </div>
          </div>

          <!-- Dates -->
          <div class="p-6 border-t border-gray-100">
            <h2 class="text-base font-bold text-gray-800 mb-4">Dates</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <a-form-item label="New Expiry Date" name="NewExpiryDate">
                <a-date-picker
                  v-model:value="form.NewExpiryDate"
                  value-format="YYYY-MM-DD"
                  class="w-full"
                />
              </a-form-item>
              <a-form-item label="Next Renew Date" name="NextRenewDate">
                <a-date-picker
                  v-model:value="form.NextRenewDate"
                  value-format="YYYY-MM-DD"
                  class="w-full"
                />
              </a-form-item>
              <a-form-item label="Renewal Application Date" name="RenewalApplicationDate">
                <a-date-picker
                  v-model:value="form.RenewalApplicationDate"
                  value-format="YYYY-MM-DD"
                  class="w-full"
                />
              </a-form-item>
              <a-form-item
                label="License Received Date"
                name="RenewalLicenseReceivedDate"
              >
                <a-date-picker
                  v-model:value="form.RenewalLicenseReceivedDate"
                  value-format="YYYY-MM-DD"
                  class="w-full"
                />
              </a-form-item>
            </div>
          </div>

          <!-- Financials -->
          <div class="p-6 border-t border-gray-100">
            <h2 class="text-base font-bold text-gray-800 mb-4">Financials</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-x-6">
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
              <a-form-item label="LR Fund" name="LRFund">
                <a-input-number v-model:value="form.LRFund" class="w-full" :min="0" />
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
                <a-input v-model:value="form.contact.name" placeholder="Name" />
              </a-form-item>
              <a-form-item label="Designation">
                <a-input
                  v-model:value="form.contact.designation"
                  placeholder="Designation"
                />
              </a-form-item>
              <a-form-item label="Email">
                <a-input v-model:value="form.contact.email" placeholder="Email" />
              </a-form-item>
              <a-form-item label="Phone">
                <a-input v-model:value="form.contact.phone" placeholder="Phone" />
              </a-form-item>
              <a-form-item label="Address" class="md:col-span-2">
                <a-input v-model:value="form.contact.address" placeholder="Address" />
              </a-form-item>
            </div>
          </div>

          <!-- Notes -->
          <div class="p-6 border-t border-gray-100">
            <h2 class="text-base font-bold text-gray-800 mb-4">Additional Information</h2>
            <a-form-item label="Remarks" name="Remarks">
              <a-textarea v-model:value="form.Remarks" :rows="3" />
            </a-form-item>
          </div>

          <!-- Documents -->
          <div class="p-6 border-t border-gray-100">
            <h2 class="text-base font-bold text-gray-800 mb-4">Documents</h2>
            <a-upload
              v-model:file-list="fileList"
              :before-upload="beforeUpload"
              :multiple="true"
              accept=".pdf,.xls,.xlsx,.csv,.svg,.png,.jpg,.jpeg,.doc,.docx,"
            >
              <a-button> <UploadOutlined /> Select Files </a-button>
            </a-upload>
            <p class="text-xs text-gray-400 mt-2">
              Attach renewal documents (PDF, Excel, SVG, images, Word).
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
            Submit Renewal
          </a-button>
        </div>
      </a-form>
    </div>
  </MainLayout>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons-vue";
import MainLayout from "@/components/layout/MainLayout.vue";
import { apiBase } from "@/config";
import { getTokenConfig } from "@/utilities/tokenConfig";
import { showNotification } from "@/utilities/notification";
import axios from "axios";

const route = useRoute();
const router = useRouter();

const licenseId = () => route.params.id;
const goBack = () => router.back();

const isSubmitting = ref(false);
const fileList = ref([]);

// LicenseName & IssuingAuthority are prefilled from the license; everything else blank.
const form = reactive({
  LicenseName: "",
  IssuingAuthority: "",
  CurrentStatus: "Active",
  NewExpiryDate: null,
  NextRenewDate: null,
  RenewalApplicationDate: null,
  RenewalLicenseReceivedDate: null,
  RenewFee: null,
  RenewVatAIT: null,
  LRFund: null,
  OfficeExpenses: null,
  Remarks: "",
  contact: {
    name: "",
    designation: "",
    email: "",
    phone: "",
    address: "",
  },
});

// Prefill only LicenseName and IssuingAuthority from the existing license.
const loadLicense = async () => {
  try {
    const res = await axios.get(`${apiBase}/licenses/${licenseId()}`, getTokenConfig());
    const d = res?.data?.success ? res.data.data : null;
    if (!d) return;
    form.LicenseName = d.LicenseName ?? "";
    form.IssuingAuthority = d.IssuingAuthority ?? "";
  } catch (error) {
    showNotification("error", "Failed to load license");
  }
};

const beforeUpload = () => false;

const submit = async () => {
  isSubmitting.value = true;
  try {
    const fd = new FormData();
    const appendIf = (key, val) => {
      if (val !== null && val !== undefined && val !== "") fd.append(key, val);
    };

    appendIf("LicenseName", form.LicenseName);
    appendIf("IssuingAuthority", form.IssuingAuthority);
    appendIf("CurrentStatus", form.CurrentStatus);
    appendIf("NewExpiryDate", form.NewExpiryDate);
    appendIf("NextRenewDate", form.NextRenewDate);
    appendIf("RenewalApplicationDate", form.RenewalApplicationDate);
    appendIf("RenewalLicenseReceivedDate", form.RenewalLicenseReceivedDate);
    appendIf("RenewFee", form.RenewFee);
    appendIf("RenewVatAIT", form.RenewVatAIT);
    appendIf("LRFund", form.LRFund);
    appendIf("OfficeExpenses", form.OfficeExpenses);
    appendIf("Remarks", form.Remarks);

    Object.entries(form.contact).forEach(([key, val]) => {
      if (val) fd.append(`ContactDetails[${key}]`, val);
    });

    fileList.value.forEach((f, i) => {
      const raw = f.originFileObj || f;
      fd.append(`Documents[${i}]`, raw);
    });

    const res = await axios.post(
      `${apiBase}/licenses/${licenseId()}/renew`,
      fd,
      getTokenConfig()
    );

    if (res?.data?.success) {
      showNotification("success", res?.data?.message || "License renewed");
      router.push({ name: "license" });
    } else {
      showNotification("error", res?.data?.message || "Failed to renew license");
    }
  } catch (error) {
    const data = error?.response?.data;
    const firstError = data?.errors ? Object.values(data.errors)?.[0]?.[0] : null;
    showNotification("error", firstError || data?.message || "Failed to renew license");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  loadLicense();
});
</script>
