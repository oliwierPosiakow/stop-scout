<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useZtmData } from '../composables/useZtmData';
import { useStopsStore } from '../stores/stopStore';
import DepartureCard from '../components/DepartureCard.vue';

const route = useRoute();
const router = useRouter();
const stopsStore = useStopsStore();

const stopId = Number(route.params.id);

const { departures, isLoading, error, fetchDepartures } = useZtmData();

const stopAlias = ref('');
const stopNotes = ref('');
const isEditing = ref(false);

const selectedTrips = ref<Record<string, boolean>>({});

onMounted(async () => {
  if (!stopId || isNaN(stopId)) {
    router.push('/');
    return;
  }

  await fetchDepartures(stopId);
  checkFavoriteStatus();
});

let interval: any;
onMounted(() => {
  interval = setInterval(() => fetchDepartures(stopId), 30000);
});

onUnmounted(() => clearInterval(interval));

const isFavorite = computed(() => {
  return stopsStore.favoriteStops.some((s) => s.stopId === stopId);
});

const checkFavoriteStatus = () => {
  const existing = stopsStore.favoriteStops.find((s) => s.stopId === stopId);
  if (existing) {
    stopAlias.value = existing.name || '';
    stopNotes.value = existing.notes || '';
  }
};

const handleFavoriteToggle = async () => {
  if (isFavorite.value) {
    await stopsStore.removeFavorite(stopId);
    stopAlias.value = '';
    stopNotes.value = '';
    isEditing.value = false;
  } else {
    await stopsStore.addFavorite({
      stopId: stopId,
      name: stopAlias.value,
      notes: stopNotes.value,
    });
    isEditing.value = false;
  }
};

const saveEdits = async () => {
  await stopsStore.addFavorite({
    stopId: stopId,
    name: stopAlias.value,
    notes: stopNotes.value,
  });
  isEditing.value = false;
};
</script>

<template>
  <div class="flex flex-col gap-4 px-4 py-4">
    <!-- Header with back button -->
    <div class="flex items-center justify-between mb-2">
      <button
        @click="router.back()"
        class="text-ios-lg text-blue-500 dark:text-blue-400 font-semibold active:opacity-60"
      >
        ‹ Powrót
      </button>
      <button
        v-if="!isEditing"
        @click="isFavorite ? handleFavoriteToggle() : (isEditing = true)"
        class="text-2xl active:opacity-60"
      >
        {{ isFavorite ? '★' : '☆' }}
      </button>
    </div>

    <!-- Stop info -->
    <section class="ios-card">
      <h2 class="text-ios-2xl font-bold text-black dark:text-white mb-1">Przystanek #{{ stopId }}</h2>
      <p class="text-ios-sm text-gray-500 dark:text-gray-400">Czasy odjazdów na żywo</p>
    </section>

    <!-- Edit form (Favorite editing) -->
    <div v-if="isEditing" class="ios-card border-2 border-blue-500 dark:border-blue-400">
      <h3 class="font-bold text-ios-lg text-black dark:text-white mb-3">Szczegóły:</h3>
      <div class="space-y-3">
        <div>
          <label class="ios-label block mb-2">Nazwa</label>
          <input
            v-model="stopAlias"
            placeholder="np. Pod pracą"
            class="ios-input w-full"
          />
        </div>
        <div>
          <label class="ios-label block mb-2">Notatki</label>
          <textarea
            v-model="stopNotes"
            placeholder="Twoje notatki..."
            class="ios-input w-full resize-none"
            rows="3"
          ></textarea>
        </div>

        <div class="flex gap-2 pt-2">
          <button
            @click="isFavorite ? saveEdits() : handleFavoriteToggle()"
            class="flex-1 ios-button-primary text-ios-base"
          >
            Zapisz
          </button>
          <button
            @click="isEditing = false"
            class="flex-1 ios-button-secondary text-ios-base"
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 dark:border-slate-700 border-t-blue-500"></div>
      <p class="mt-4 text-ios-base text-gray-600 dark:text-gray-400 font-semibold">
        Pobieranie odjazdów...
      </p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="ios-card border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20"
    >
      <p class="font-bold text-ios-lg text-red-700 dark:text-red-400 mb-2">⚠️ Błąd</p>
      <p class="text-ios-sm text-red-600 dark:text-red-400 mb-3">{{ error }}</p>
      <button
        @click="fetchDepartures(stopId)"
        class="ios-button-primary w-full text-ios-base"
      >
        🔄 Spróbuj ponownie
      </button>
    </div>

    <!-- Departures list -->
    <section v-else>
      <div
        v-if="departures.length === 0"
        class="text-center py-8 text-gray-500 dark:text-gray-400 ios-card"
      >
        <p class="text-ios-lg">⏳ Brak odjazdów w najbliższym czasie</p>
      </div>

      <div v-else class="space-y-3">
        <DepartureCard
          v-for="vehicle in departures"
          :key="vehicle.id"
          :vehicle="vehicle"
          v-model="selectedTrips[vehicle.id]"
        >
          <template #actions>
            <span
              v-if="selectedTrips[vehicle.id]"
              class="text-ios-xs text-blue-500 dark:text-blue-400 font-bold px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-ios-lg"
            >
              ✓ Obserwowany
            </span>
          </template>
        </DepartureCard>
      </div>
    </section>
  </div>
</template>
