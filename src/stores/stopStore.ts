import { dbPromise } from '../utils/db';
import { defineStore } from 'pinia';
import type { FavoriteStop } from '../types/ztm';

export type StopType = 'BUS' | 'TRAM' | 'BUS_TRAM' | 'UNKNOWN';

export interface ZtmStop {
  stopId: number;
  stopName: string;
  subName: string;
  stopLat: number;
  stopLon: number;
  type: StopType;
}

export const useStopsStore = defineStore('stops', {
  state: () => ({
    allStops: [] as ZtmStop[],
    favoriteStops: [] as FavoriteStop[],
  }),
  actions: {
    async loadFavorites() {
      const db = await dbPromise;
      this.favoriteStops = await db.getAll('favorites');
    },

    async addFavorite(stop: FavoriteStop) {
      this.favoriteStops.push(stop);

      try {
        const db = await dbPromise;
        await db.put('favorites', stop);
      } catch (error) {
        this.favoriteStops = this.favoriteStops.filter((s) => s.stopId !== stop.stopId);
      }
    },

    async removeFavorite(stopId: number) {
      const index = this.favoriteStops.findIndex((s) => s.stopId === stopId);
      if (index === -1) return;

      const removedStop = this.favoriteStops[index];
      this.favoriteStops.splice(index, 1);

      try {
        const db = await dbPromise;
        await db.delete('favorites', stopId);
      } catch (error) {
        this.favoriteStops.splice(index, 0, removedStop);
      }
    },

    async fetchStopsList() {
      if (this.allStops.length > 0) return;

      const CACHE_KEY = 'ztm_stops_list_cache';

      try {
        const response = await fetch(
          'https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json'
        );
        if (!response.ok) throw new Error('Nie udało się pobrać listy przystanków');

        const data = await response.json();

        const stopsDateKey = Object.keys(data)[0];
        const stopsArray = data[stopsDateKey]?.stops || [];

        this.allStops = stopsArray.map((s: any) => ({
          stopId: s.stopId,
          stopName: s.stopName,
          subName: s.subName || s.stopDesc || '',
          stopLat: s.stopLat,
          stopLon: s.stopLon,
          type: s.type,
        }));

        localStorage.setItem(CACHE_KEY, JSON.stringify(this.allStops));
      } catch (error) {
        const cachedStops = localStorage.getItem(CACHE_KEY);
        if (cachedStops && !navigator.onLine) {
          try {
            this.allStops = JSON.parse(cachedStops);
          } catch {}
        }
      }
    },
  },
});
