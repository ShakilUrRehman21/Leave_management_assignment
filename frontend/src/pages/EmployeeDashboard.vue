<script setup>
import { ref, onMounted } from 'vue';
import LeaveForm from '../components/LeaveForm.vue';
import LeaveTable from '../components/LeaveTable.vue';
import api from '../services/api';

const leaves = ref([]);
const isLoading = ref(true);

const fetchLeaves = async () => {
  isLoading.value = true;
  try {
    const { data } = await api.get('/leaves/my-leaves');
    leaves.value = data;
  } catch (error) {
    console.error('Failed to fetch leaves', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchLeaves();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
      <p class="text-gray-600 mt-1">Manage your leave applications and check statuses.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left side: Form -->
      <div class="lg:col-span-1">
        <LeaveForm @leave-applied="fetchLeaves" />
      </div>
      
      <!-- Right side: Table -->
      <div class="lg:col-span-2">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-800">My Leave History</h2>
          <button @click="fetchLeaves" class="text-sm text-indigo-600 hover:text-indigo-800 hover:underline">
            Refresh
          </button>
        </div>
        
        <div v-if="isLoading" class="flex justify-center p-12">
          <span class="animate-spin inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></span>
        </div>
        <LeaveTable v-else :leaves="leaves" :isEmployer="false" />
      </div>
    </div>
  </div>
</template>
