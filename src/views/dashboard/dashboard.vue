<template>
  <MainLayout>
    <div class="p-6">
      <h1 class="text-2xl font-semibold text-gray-800 mb-2">Dashboard</h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="tile in tiles()"
          :key="tile.key"
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-3 flex items-center justify-between"
        >
          <div>
            <p class="text-base font-bold" :class="tile.labelColor">
              {{ tile.label }}
            </p>
            <div class="mt-2 h-10 flex items-center">
              <a-spin v-if="tile.loading" size="small" />
              <p v-else class="text-2xl font-bold text-gray-800">
                {{ tile.count }}
              </p>
            </div>
          </div>
          <div
            class="rounded-full w-14 h-14 flex items-center justify-center shrink-0"
            :class="tile.iconBg"
          >
            <component :is="tile.icon" :class="['text-2xl', tile.iconColor]" />
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import axios from "axios";
import MainLayout from "@/components/layout/MainLayout.vue";
import { apiBase } from "@/config";
import { getTokenConfig } from "@/utilities/tokenConfig";
import { CheckCircleOutlined } from "@ant-design/icons-vue";

const state = reactive({
  dealers: { count: 0, loading: false },
});

const tiles = () => [
  {
    key: "dealers",
    label: "Safe / Active",
    count: state.dealers.count,
    loading: state.dealers.loading,
    icon: CheckCircleOutlined,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    labelColor: "text-green-700",
  },
];

</script>
