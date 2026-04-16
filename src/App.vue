<script setup lang="ts">
// @ts-nocheck
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from './stores/userStore';

const router = useRouter();
const userStore = useUserStore();
const isDarkMode = ref(false);
const isOnline = ref(true);

const currentRoute = computed(() => router.currentRoute.value.name);

const tabs = [
  { name: 'auth', icon: '🔐', label: 'Login', show: !userStore.isAuthenticated },
  { name: 'home', icon: '🏠', label: 'Home', show: userStore.isAuthenticated },
  { name: 'favorites', icon: '⭐', label: 'Ulubone', show: userStore.isAuthenticated },
];

onMounted(() => {
  userStore.checkLocalSession();
  // Sprawdź preferencję systemu
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  isDarkMode.value = localStorage.getItem('theme') === 'dark' || prefersDark;
  applyTheme();

  // Monitor online/offline status
  isOnline.value = navigator.onLine;
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
});

onUnmounted(() => {
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
});

const handleOnline = () => {
  isOnline.value = true;
};

const handleOffline = () => {
  isOnline.value = false;
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
  applyTheme();
};

const applyTheme = () => {
  const html = document.documentElement;
  if (isDarkMode.value) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
};

const navigateTo = (name: string) => {
  router.push({ name });
};
</script>

<template>
  <div class="flex flex-col h-screen bg-white dark:bg-slate-950 text-black dark:text-white ios-safe-top">
    <!-- Offline indicator -->
    <div
      v-if="!isOnline"
      class="bg-orange-500 text-white px-4 py-2 text-center font-semibold flex items-center justify-center gap-2 text-ios-sm"
    >
      <span>📡</span>
      <span>Offline - dane mogą być starsze</span>
    </div>

    <!-- iOS-style header -->
    <header
      v-if="userStore.isAuthenticated"
      class="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 py-3"
    >
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span class="text-2xl">🚌</span>
          <div>
            <h1 class="text-ios-lg font-bold">Stop Scout</h1>
            <p class="text-ios-xs text-gray-500 dark:text-gray-400">ZTM Gdańsk</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="toggleTheme"
            class="p-2 text-xl active:opacity-60"
          >
            {{ isDarkMode ? '☀️' : '🌙' }}
          </button>
          <button
            @click="userStore.logout()"
            class="text-ios-sm font-semibold text-ios-blue active:opacity-60"
          >
            Wyloguj
          </button>
        </div>
      </div>
    </header>

    <!-- Auth header -->
    <header v-else class="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 py-3">
      <div class="flex justify-between items-center">
        <h1 class="text-ios-lg font-bold">Stop Scout</h1>
        <button
          @click="toggleTheme"
          class="p-2 text-xl active:opacity-60"
        >
          {{ isDarkMode ? '☀️' : '🌙' }}
        </button>
      </div>
    </header>

    <!-- Main content area with safe bottom padding for bottom nav -->
    <main class="flex-1 overflow-y-auto pb-20 ios-safe-bottom">
      <router-view></router-view>
    </main>

    <!-- iOS-style bottom tab bar (only when authenticated) -->
    <nav
      v-if="userStore.isAuthenticated"
      class="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 flex justify-around items-center h-20 ios-safe-bottom"
    >
      <button
        @click="navigateTo('home')"
        class="flex flex-col items-center justify-center w-full h-16 text-center active:opacity-60"
        :class="currentRoute === 'home' ? 'text-ios-blue' : 'text-gray-500 dark:text-gray-400'"
      >
        <span class="text-2xl mb-1">🏠</span>
        <span class="text-ios-xs font-medium">Home</span>
      </button>

      <button
        @click="navigateTo('favorites')"
        class="flex flex-col items-center justify-center w-full h-16 text-center active:opacity-60"
        :class="currentRoute === 'favorites' ? 'text-ios-blue' : 'text-gray-500 dark:text-gray-400'"
      >
        <span class="text-2xl mb-1">⭐</span>
        <span class="text-ios-xs font-medium">Ulubone</span>
      </button>

      <button
        @click="navigateTo('profile')"
        class="flex flex-col items-center justify-center w-full h-16 text-center active:opacity-60"
        :class="currentRoute === 'profile' ? 'text-ios-blue' : 'text-gray-500 dark:text-gray-400'"
      >
        <span class="text-2xl mb-1">👤</span>
        <span class="text-ios-xs font-medium">Profil</span>
      </button>
    </nav>
  </div>
</template>

