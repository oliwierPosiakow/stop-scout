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
      return 'text-gray-600 dark:text-gray-400';
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
    class="flex flex-col items-stretch ios-cell cursor-pointer px-0 gap-2 py-3 active:bg-gray-100 dark:active:bg-slate-800"
    :class="isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''"
    @click="isSelected = !isSelected"
  >
    <div class="flex flex-1 items-start justify-between gap-2">
      <div class="flex items-start gap-3 flex-1 min-w-0">
        <div
          class="items-center justify-center bg-slate-800 dark:bg-neutral-600 text-white font-bold rounded-lg h-10 w-10 flex text-ios-lg flex-shrink-0"
        >
          {{ vehicle.routeShortName || vehicle.routeId }}
        </div>

        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-ios-lg text-black dark:text-white truncate">
            {{ vehicle.headsign }}
          </h4>
        </div>
      </div>

      <div class="text-right">
        <div class="text-ios-2xl font-bold text-blue-500 dark:text-blue-400 leading-none">
          {{ formattedTime }}
        </div>
      </div>
    </div>

    <div class="flex flex-1 justify-between gap-2 text-ios-sm">
      <span class="text-gray-500 dark:text-gray-400">
        Planowo: <strong class="text-black dark:text-white">{{ theoreticalTimeFormatted }}</strong>
      </span>

      <span class="font-medium whitespace-nowrap" :class="delayColorClass">
        {{ $formatDelay(vehicle?.delayInSeconds) }}
      </span>
    </div>

    <div v-if="isSelected" class="px-4 mt-1">
      <slot name="actions"></slot>
    </div>
  </div>
</template>
