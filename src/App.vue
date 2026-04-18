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
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  isDarkMode.value = localStorage.getItem('theme') === 'dark' || prefersDark;
  applyTheme();

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
  <div
    class="flex flex-col h-screen bg-white dark:bg-slate-950 text-black dark:text-white ios-safe-top"
  >
    <div
      v-if="!isOnline"
      class="bg-orange-500 text-white px-4 py-2 text-center font-semibold flex items-center justify-center gap-2 text-ios-sm"
    >
      <span>Offline - dane mogą być starsze</span>
    </div>

    <header
      v-if="userStore.isAuthenticated"
      class="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 py-3"
    >
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <div>
            <h1 class="text-ios-lg font-bold">Stop Scout</h1>
            <p class="text-ios-xs text-gray-500 dark:text-gray-400">ZTM Gdańsk</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button @click="toggleTheme" class="p-2 text-xl active:opacity-60">
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

    <header
      v-else
      class="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 py-3"
    >
      <div class="flex justify-between items-center">
        <h1 class="text-ios-lg font-bold">Stop Scout</h1>
        <button @click="toggleTheme" class="p-2 text-xl active:opacity-60">
          {{ isDarkMode ? '☀️' : '🌙' }}
        </button>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto pb-20 ios-safe-bottom">
      <router-view></router-view>
    </main>
  </div>
</template>
