<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStopsStore } from '../stores/stopStore';

const router = useRouter();
const stopsStore = useStopsStore();
const searchQuery = ref('');

onMounted(async () => {
  await stopsStore.fetchStopsList();
  await stopsStore.loadFavorites();
});

const filteredStops = computed(() => {
  if (searchQuery.value.length < 3) return [];
  const query = searchQuery.value.toLowerCase();
  return stopsStore.allStops
    .filter((stop: any) => stop.stopName && stop.stopName.toLowerCase().includes(query))
    .slice(0, 15);
});

const goToStop = (stopId: number, name: string) => {
  router.push({ name: 'stop', params: { id: stopId }, query: { name } });
};

const removeFavorite = async (stopId: number) => {
  await stopsStore.removeFavorite(stopId);
};
</script>

<template>
  <div class="flex flex-col gap-6 px-4 py-4">
    <section>
      <div class="mb-3">
        <label class="ios-label block mb-2">Szukaj przystanku</label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Min. 3 znaki..."
          class="ios-input w-full text-ios-base"
        />
      </div>

      <div
        v-if="filteredStops.length > 0"
        class="bg-white dark:bg-slate-900 rounded-ios-lg overflow-hidden shadow-ios-sm"
      >
        <button
          v-for="(stop, idx) in filteredStops"
          :key="stop.stopId"
          @click="goToStop(stop.stopId, stop.stopName)"
          class="ios-cell w-full text-left active:bg-gray-100 dark:active:bg-slate-800"
          :class="idx !== filteredStops.length - 1 ? 'border-b' : ''"
        >
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-ios-lg text-black dark:text-white truncate">
              {{ stop.subName ? `${stop.stopName} (${stop.subName})` : stop.stopName }}
            </p>
            <p class="text-ios-xs text-gray-400">{{ $formatStopType(stop.type) }}</p>
          </div>
          <span class="ml-3 text-gray-400 dark:text-gray-600">›</span>
        </button>
      </div>

      <div v-else-if="searchQuery.length >= 3" class="text-center py-6">
        <p class="text-ios-base text-gray-500 dark:text-gray-400">Brak wyników</p>
      </div>

      <div v-else class="text-center py-4">
        <p class="text-ios-sm text-gray-400 dark:text-gray-500">Wpisz co najmniej 3 znaki</p>
      </div>
    </section>

    <section>
      <div class="mb-3">
        <h2 class="ios-label block mb-3">Ulubione przystanki</h2>

        <div
          v-if="stopsStore.favoriteStops.length === 0"
          class="bg-white dark:bg-slate-900 rounded-ios-lg p-6 text-center shadow-ios-light"
        >
          <p class="text-ios-lg font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Brak ulubionych
          </p>
          <p class="text-ios-sm text-gray-400 dark:text-gray-500">Dodaj przystanki do ulubionych</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="fav in stopsStore.favoriteStops"
            :key="fav.stopId"
            class="bg-white dark:bg-slate-900 rounded-ios-lg p-4 shadow-ios-sm border-l-4 border-blue-500 dark:border-blue-400"
          >
            <h3 class="text-ios-lg font-bold text-black dark:text-white mb-2 truncate">
              {{ fav.name || `Przystanek #${fav.stopId}` }}
            </h3>

            <p
              v-if="fav.notes"
              class="text-ios-sm text-gray-600 dark:text-gray-300 mb-3 py-1 dark:bg-yellow-900/20 rounded-ios-lg italic"
            >
              {{ fav.notes }}
            </p>

            <div class="flex gap-2">
              <button
                @click="goToStop(fav.stopId, fav.name)"
                class="flex-1 ios-button-primary text-ios-base"
              >
                Odjazdy
              </button>
              <button
                @click="removeFavorite(fav.stopId)"
                class="px-3 ios-button-primary py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-ios-lg font-semibold text-ios-base active:opacity-60"
                title="Usuń z ulubionych"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
