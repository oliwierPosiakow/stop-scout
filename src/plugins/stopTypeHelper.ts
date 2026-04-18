import type { App, Plugin } from 'vue';
import type { StopType } from '../stores/stopStore';

export const stopTypeHelperPlugin: Plugin = {
  install(app: App) {
    app.config.globalProperties.$formatStopType = (type: StopType): string => {
      switch (type) {
        case 'BUS':
          return 'Autobusowy';
        case 'TRAM':
          return 'Tramwajowy';
        case 'BUS_TRAM':
          return 'Autobusowy i Tramwajowy';
        default:
          return '';
      }
    };

    app.provide('formatStopType', {
      formatDelay: app.config.globalProperties.$formatStopType,
    });
  },
};
