<script setup>
import { ref } from 'vue';
import api from '../services/api';

const emit = defineEmits(['leave-applied']);

const leaveType = ref('Sick Leave');
const startDate = ref('');
const endDate = ref('');
const reason = ref('');
const isLoading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

const applyLeave = async () => {
  errorMsg.value = '';
  successMsg.value = '';
  isLoading.value = true;
  
  if (new Date(startDate.value) > new Date(endDate.value)) {
    errorMsg.value = 'End date cannot be before start date.';
    isLoading.value = false;
    return;
  }

  try {
    await api.post('/leaves/apply', {
      leaveType: leaveType.value,
      startDate: startDate.value,
      endDate: endDate.value,
      reason: reason.value,
    });
    
    successMsg.value = 'Leave applied successfully!';
    // reset form
    leaveType.value = 'Sick Leave';
    startDate.value = '';
    endDate.value = '';
    reason.value = '';
    
    emit('leave-applied');
    
    setTimeout(() => { successMsg.value = ''; }, 3000);
  } catch (error) {
    errorMsg.value = error.response?.data?.message || 'Failed to apply leave.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h2 class="text-xl font-bold text-gray-800 mb-6">Apply for Leave</h2>
    
    <form @submit.prevent="applyLeave" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
        <select 
          v-model="leaveType" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        >
          <option value="Sick Leave">Sick Leave</option>
          <option value="Casual Leave">Casual Leave</option>
          <option value="Paid Leave">Paid Leave</option>
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input 
            v-model="startDate" 
            type="date" 
            required
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input 
            v-model="endDate" 
            type="date" 
            required
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Reason</label>
        <textarea 
          v-model="reason" 
          rows="3" 
          required
          class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
          placeholder="Briefly describe your reason..."
        ></textarea>
      </div>

      <div v-if="errorMsg" class="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{{ errorMsg }}</div>
      <div v-if="successMsg" class="p-3 bg-green-50 text-green-600 rounded-lg text-sm">{{ successMsg }}</div>

      <button 
        type="submit" 
        :disabled="isLoading"
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
      >
        <span v-if="isLoading" class="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
        {{ isLoading ? 'Submitting...' : 'Submit Request' }}
      </button>
    </form>
  </div>
</template>
