<script setup>
import { Check, X } from 'lucide-vue-next';
import api from '../services/api';

const props = defineProps({
  leaves: {
    type: Array,
    required: true,
  },
  isEmployer: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['action-taken']);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

const handleAction = async (id, action) => {
  try {
    await api.patch(`/leaves/${id}/${action}`);
    emit('action-taken');
  } catch (error) {
    alert('Action failed. Please try again.');
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Approved': return 'bg-green-100 text-green-800';
    case 'Rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-yellow-100 text-yellow-800';
  }
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm whitespace-nowrap">
        <thead class="bg-gray-50 border-b border-gray-100 text-gray-600">
          <tr>
            <th v-if="isEmployer" class="px-6 py-4 font-semibold">Employee</th>
            <th class="px-6 py-4 font-semibold">Leave Type</th>
            <th class="px-6 py-4 font-semibold">Duration</th>
            <th class="px-6 py-4 font-semibold max-w-xs">Reason</th>
            <th class="px-6 py-4 font-semibold">Status</th>
            <th v-if="isEmployer" class="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="leaves.length === 0">
            <td :colspan="isEmployer ? 6 : 5" class="px-6 py-8 text-center text-gray-500">
              No leave requests found.
            </td>
          </tr>
          <tr v-for="leave in leaves" :key="leave._id" class="hover:bg-gray-50/50 transition-colors">
            <!-- Employee Name (Employer only) -->
            <td v-if="isEmployer" class="px-6 py-4">
              <div class="font-medium text-gray-900">{{ leave.employeeId?.name || 'Unknown User' }}</div>
              <div class="text-xs text-gray-500">{{ leave.employeeId?.email }}</div>
            </td>
            
            <!-- Type -->
            <td class="px-6 py-4 font-medium text-gray-700">
              {{ leave.leaveType }}
            </td>
            
            <!-- Duration -->
            <td class="px-6 py-4 text-gray-600">
              {{ formatDate(leave.startDate) }} &rarr; {{ formatDate(leave.endDate) }}
            </td>
            
            <!-- Reason -->
            <td class="px-6 py-4">
              <div class="truncate max-w-[200px] text-gray-500" :title="leave.reason">
                {{ leave.reason }}
              </div>
            </td>
            
            <!-- Status -->
            <td class="px-6 py-4">
              <span 
                class="px-2.5 py-1 text-xs font-semibold rounded-full"
                :class="getStatusColor(leave.status)"
              >
                {{ leave.status }}
              </span>
            </td>
            
            <!-- Actions (Employer only) -->
            <td v-if="isEmployer" class="px-6 py-4 text-right">
              <div v-if="leave.status === 'Pending'" class="flex justify-end gap-2">
                <button 
                  @click="handleAction(leave._id, 'approve')"
                  class="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 rounded transition-colors"
                  title="Approve"
                >
                  <Check class="w-4 h-4" />
                </button>
                <button 
                  @click="handleAction(leave._id, 'reject')"
                  class="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded transition-colors"
                  title="Reject"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>
              <span v-else class="text-gray-400 text-xs italic">
                Decided
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
