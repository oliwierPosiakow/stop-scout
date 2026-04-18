import type { App, Plugin } from 'vue';

export const timeHelperPlugin: Plugin = {
  install(app: App) {
    app.config.globalProperties.$formatDelay = (delayInSeconds?: number | null): string => {
      if (!delayInSeconds || delayInSeconds <= 60) return 'Na czas';
      const minutes = Math.floor(delayInSeconds / 60);
      return `+${minutes} min`;
    };

    app.provide('timeHelper', {
      formatDelay: app.config.globalProperties.$formatDelay,
    });
  },
};
