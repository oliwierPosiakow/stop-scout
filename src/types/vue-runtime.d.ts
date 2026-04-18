import '@vue/runtime-core';
import type { StopType } from '../stores/stopStore';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $formatDelay: (delayInSeconds?: number | null) => string;
    $formatStopType: (type: StopType) => string;
  }
}
