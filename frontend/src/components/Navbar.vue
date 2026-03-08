<script setup>
import { useRouter } from 'vue-router';
import { LogOut, User } from 'lucide-vue-next';

const router = useRouter();

// Basic reactivity for user info from localStorage
const userStr = localStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};
</script>

<template>
  <nav class="bg-indigo-600 text-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Logo/Title -->
        <div class="flex-shrink-0 flex items-center font-bold text-xl tracking-wide gap-2">
          <span>Leave Manager</span>
        </div>
        
        <!-- User Actions -->
        <div class="flex items-center gap-4">
          <div class="hidden sm:flex items-center gap-2 text-indigo-100" v-if="user">
            <User class="w-5 h-5" />
            <span class="font-medium">{{ user.name }} <span class="text-indigo-300 text-sm">({{ user.role }})</span></span>
          </div>
          
          <button 
            @click="logout" 
            class="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
          >
            <LogOut class="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
