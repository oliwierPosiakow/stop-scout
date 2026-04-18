import { ref } from 'vue';
import type { ZtmVehicle } from '../types/ztm';

export interface DeparturesResponse {
  lastUpdate: string;
  departures: ZtmVehicle[];
}

const CACHE_KEY_DEPARTURES = 'ztm_departures_cache';
const CACHE_KEY_TIMESTAMP = 'ztm_departures_timestamp';

export function useZtmData() {
  const departures = ref<ZtmVehicle[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const lastUpdate = ref<string | null>(null);

  const fetchDepartures = async (stopId: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(`https://ckan2.multimediagdansk.pl/departures?stopId=${stopId}`);

      if (!response.ok) throw new Error('Błąd pobierania danych z ZTM');

      const data: DeparturesResponse = await response.json();
      departures.value = data.departures || [];
      lastUpdate.value = data.lastUpdate || null;

      sessionStorage.setItem(CACHE_KEY_DEPARTURES, JSON.stringify(data.departures));
      sessionStorage.setItem(CACHE_KEY_TIMESTAMP, new Date().toISOString());
    } catch (err: any) {
      if (!navigator.onLine) {
        const cachedData = sessionStorage.getItem(CACHE_KEY_DEPARTURES);
        if (cachedData) {
          try {
            departures.value = JSON.parse(cachedData);
            lastUpdate.value = sessionStorage.getItem(CACHE_KEY_TIMESTAMP);
          } catch {
            departures.value = [];
          }
        } else {
          departures.value = [];
        }
      } else {
        error.value = err.message || 'Wystąpił nieznany błąd';
        departures.value = [];
      }
    } finally {
      isLoading.value = false;
    }
  };

  return { departures, isLoading, error, lastUpdate, fetchDepartures };
}
