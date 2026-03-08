<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';

const route = useRoute();
// Hide navbar on auth pages
const showNavbar = computed(() => {
  return route.path !== '/login' && route.path !== '/register' && route.path !== '/';
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    <Navbar v-if="showNavbar" />
    <main class="flex-grow">
      <!-- Transition for page routing can be added here if desired -->
      <router-view></router-view>
    </main>
  </div>
</template>
