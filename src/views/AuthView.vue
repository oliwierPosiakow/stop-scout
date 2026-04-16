<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

const router = useRouter();
const userStore = useUserStore();

const isLoginMode = ref(true);
const username = ref('');
const password = ref('');
const isLoading = ref(false);

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  userStore.loginError = null;
  userStore.registerError = null;
  username.value = '';
  password.value = '';
};

const handleSubmit = async () => {
  if (!username.value || !password.value) return;

  isLoading.value = true;

  if (isLoginMode.value) {
    const success = await userStore.login(username.value, password.value);
    if (success) {
      router.push({ name: 'home' });
    }
  } else {
    const success = await userStore.register(username.value, password.value);
    if (success) {
      await userStore.login(username.value, password.value);
      router.push({ name: 'home' });
    }
  }

  isLoading.value = false;
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 py-8">
    <div
      class="bg-white dark:bg-slate-900 p-6 rounded-ios-2xl shadow-ios-md w-full max-w-sm border border-gray-200 dark:border-slate-800"
    >
      <div class="text-center mb-6">
        <div class="text-5xl mb-3">🚌</div>
        <h2 class="text-ios-xl font-bold text-black dark:text-white mb-1">
          {{ isLoginMode ? 'Witaj ponowie' : 'Utwórz konto' }}
        </h2>
        <p class="text-ios-sm text-gray-500 dark:text-gray-400">
          {{ isLoginMode ? 'Zaloguj się do Stop Scout' : 'Zacznij śledzić odjazdy' }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="ios-label mb-2 block" for="username">
            Nazwa użytkownika
          </label>
          <input
            v-model="username"
            id="username"
            type="text"
            placeholder="np. jan_kowalski"
            required
            class="ios-input w-full"
          />
        </div>

        <div>
          <label class="ios-label mb-2 block" for="password">
            Hasło
          </label>
          <input
            v-model="password"
            id="password"
            type="password"
            placeholder="••••••••"
            required
            class="ios-input w-full"
          />
        </div>

        <transition name="fade">
          <div
            v-if="userStore.loginError && isLoginMode"
            class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-ios-lg text-ios-sm border border-red-200 dark:border-red-900/40"
          >
            ⚠️ {{ userStore.loginError }}
          </div>
          <div
            v-else-if="userStore.registerError && !isLoginMode"
            class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-ios-lg text-ios-sm border border-red-200 dark:border-red-900/40"
          >
            ⚠️ {{ userStore.registerError }}
          </div>
        </transition>

        <button
          type="submit"
          :disabled="isLoading"
          class="ios-button-primary w-full mt-6"
        >
          <span v-if="!isLoading">
            {{ isLoginMode ? 'Zaloguj się' : 'Zarejestruj się' }}
          </span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Przetwarzanie...
          </span>
        </button>
      </form>

      <div class="mt-6 text-center border-t border-gray-200 dark:border-slate-800 pt-4">
        <p class="text-ios-sm text-gray-500 dark:text-gray-400">
          {{ isLoginMode ? 'Nie masz jeszcze konta?' : 'Masz już konto?' }}
          <button
            @click="toggleMode"
            class="text-blue-500 dark:text-blue-400 font-semibold ml-1 active:opacity-60"
          >
            {{ isLoginMode ? 'Zarejestruj się' : 'Zaloguj się' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
