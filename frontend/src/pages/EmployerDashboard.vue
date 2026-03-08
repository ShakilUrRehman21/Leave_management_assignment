<script setup>
import { ref, onMounted, computed } from 'vue';
import LeaveTable from '../components/LeaveTable.vue';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-vue-next';
import api from '../services/api';

const leaves = ref([]);
const isLoading = ref(true);

const fetchAllLeaves = async () => {
  isLoading.value = true;
  try {
    const { data } = await api.get('/leaves/all');
    leaves.value = data;
  } catch (error) {
    console.error('Failed to fetch leaves', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchAllLeaves();
});

// Analytics
const totalLeaves = computed(() => leaves.value.length);
const pendingLeaves = computed(() => leaves.value.filter(l => l.status === 'Pending').length);
const approvedLeaves = computed(() => leaves.value.filter(l => l.status === 'Approved').length);
const rejectedLeaves = computed(() => leaves.value.filter(l => l.status === 'Rejected').length);
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
        <p class="text-gray-600 mt-1">Review and manage employee leave requests.</p>
      </div>
      <button 
        @click="fetchAllLeaves" 
        class="bg-white border shadow-sm text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium self-start sm:self-auto"
      >
        Refresh Data
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div class="p-3 bg-gray-100 text-gray-600 rounded-lg">
          <Users class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Total Requests</p>
          <p class="text-2xl font-bold text-gray-900">{{ totalLeaves }}</p>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div class="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
          <Clock class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm font-medium text-yellow-600">Pending</p>
          <p class="text-2xl font-bold text-gray-900">{{ pendingLeaves }}</p>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div class="p-3 bg-green-100 text-green-600 rounded-lg">
          <CheckCircle class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm font-medium text-green-600">Approved</p>
          <p class="text-2xl font-bold text-gray-900">{{ approvedLeaves }}</p>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div class="p-3 bg-red-100 text-red-600 rounded-lg">
          <XCircle class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm font-medium text-red-600">Rejected</p>
          <p class="text-2xl font-bold text-gray-900">{{ rejectedLeaves }}</p>
        </div>
      </div>
    </div>

    <!-- Main Table -->
    <div>
      <h2 class="text-xl font-bold text-gray-800 mb-4">All Leave Requests</h2>
      <div v-if="isLoading" class="flex justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <span class="animate-spin inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></span>
      </div>
      <LeaveTable v-else :leaves="leaves" :isEmployer="true" @action-taken="fetchAllLeaves" />
    </div>
  </div>
</template>
