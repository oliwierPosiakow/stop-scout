<script setup lang="ts">
import { computed } from 'vue';
import type { ZtmVehicle } from '../types/ztm';

const props = defineProps<{
  vehicle: ZtmVehicle;
}>();

const isSelected = defineModel<boolean>();

const formattedTime = computed(() => {
  if (!props.vehicle.estimatedTime) return 'N/A';
  const date = new Date(props.vehicle.estimatedTime);
  return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
});

const delayStatus = computed(() => {
  const delay = props.vehicle.delayInSeconds;
  if (delay === null || delay === undefined) return 'no-data';
  if (delay === 0) return 'on-time';
  if (delay < 0) return 'early';
  return 'late';
});

const delayColorClass = computed(() => {
  switch (delayStatus.value) {
    case 'on-time':
      return 'text-green-600 dark:text-green-400';
    case 'early':
      return 'text-blue-600 dark:text-blue-400';
    case 'late':
      return 'text-orange-600 dark:text-orange-400';
    case 'no-data':
      return 'text-gray-600 dark:text-gray-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
});

const theoreticalTimeFormatted = computed(() => {
  if (!props.vehicle.theoreticalTime) return 'N/A';
  const date = new Date(props.vehicle.theoreticalTime);
  return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
});
</script>

<template>
  <div
    class="ios-cell cursor-pointer px-0 flex flex-col gap-2 py-3 active:bg-gray-100 dark:active:bg-slate-800"
    :class="isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''"
    @click="isSelected = !isSelected"
  >
    <!-- Header row: Route + Time -->
    <div class="flex items-start justify-between px-4 gap-2">
      <div class="flex items-start gap-3 flex-1 min-w-0">
        <!-- Route number badge -->
        <div
          class="bg-slate-800 dark:bg-slate-900 text-white font-bold rounded-lg h-10 w-10 flex items-center justify-center text-ios-lg flex-shrink-0"
        >
          {{ vehicle.routeShortName || vehicle.routeId }}
        </div>

        <!-- Headsign -->
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-ios-lg text-black dark:text-white truncate">
            {{ vehicle.headsign }}
          </h4>
          <p class="text-ios-xs text-gray-500 dark:text-gray-400 truncate">
            {{ vehicle.vehicleService || 'Brak info' }}
          </p>
        </div>
      </div>

      <!-- Estimated time (big) -->
      <div class="text-right">
        <div class="text-ios-2xl font-bold text-blue-500 dark:text-blue-400 leading-none">
          {{ formattedTime }}
        </div>
      </div>
    </div>

    <!-- Detail row: Scheduled time + Status -->
    <div class="px-4 flex items-center justify-between gap-2 text-ios-sm">
      <span class="text-gray-500 dark:text-gray-400">
        Rozkład: <strong class="text-black dark:text-white">{{ theoreticalTimeFormatted }}</strong>
      </span>

      <span
        class="font-medium whitespace-nowrap"
        :class="delayColorClass"
      >
        <span
          v-if="vehicle.delayInSeconds !== null && vehicle.delayInSeconds !== undefined"
        >
          {{ $formatDelay(vehicle.delayInSeconds) }}
        </span>
        <span v-else>✓ Na czas</span>
      </span>
    </div>

    <!-- Actions row (if selected) -->
    <div v-if="isSelected" class="px-4 mt-1">
      <slot name="actions"></slot>
    </div>
  </div>
</template>
