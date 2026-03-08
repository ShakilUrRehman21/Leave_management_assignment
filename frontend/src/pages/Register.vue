<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const role = ref('employee');
const errorMsg = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
  errorMsg.value = '';
  isLoading.value = true;
  try {
    const { data } = await api.post('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value,
    });
    
    // Save to localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Redirect based on role
    if (data.user.role === 'employer') {
      router.push('/employer');
    } else {
      router.push('/employee');
    }
  } catch (error) {
    errorMsg.value = error.response?.data?.message || 'Registration failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
    <div class="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-gray-900">Create Account</h1>
        <p class="text-gray-500 mt-2">Join to manage leaves effortlessly</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input 
            v-model="name" 
            type="text" 
            required
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            v-model="email" 
            type="email" 
            required
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder="you@example.com"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            v-model="password" 
            type="password" 
            required
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">I am an</label>
          <div class="grid grid-cols-2 gap-4">
            <label 
              class="border rounded-lg p-3 flex  items-center gap-2 cursor-pointer transition-colors"
              :class="role === 'employee' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'"
            >
              <input type="radio" v-model="role" value="employee" class="hidden" />
              <div class="w-4 h-4 rounded-full border border-current flex justify-center items-center">
                <div v-if="role === 'employee'" class="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>
              </div>
              <span class="font-medium">Employee</span>
            </label>
            <label 
              class="border rounded-lg p-3 flex items-center gap-2 cursor-pointer transition-colors"
              :class="role === 'employer' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'"
            >
              <input type="radio" v-model="role" value="employer" class="hidden" />
              <div class="w-4 h-4 rounded-full border border-current flex justify-center items-center">
                <div v-if="role === 'employer'" class="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>
              </div>
              <span class="font-medium">Employer</span>
            </label>
          </div>
        </div>

        <div v-if="errorMsg" class="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
          {{ errorMsg }}
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
        >
          <span v-if="isLoading" class="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
          {{ isLoading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>

      <div class="mt-8 text-center text-sm text-gray-600">
        Already have an account? 
        <router-link to="/login" class="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline">
          Sign In
        </router-link>
      </div>
    </div>
  </div>
</template>
