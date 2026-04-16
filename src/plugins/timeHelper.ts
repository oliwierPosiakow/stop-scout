import type { App, Plugin } from 'vue';

export const timeHelperPlugin: Plugin = {
  install(app: App) {
    app.config.globalProperties.$formatDelay = (delayInSeconds: number): string => {
      if (delayInSeconds <= 60) return 'O czasie';
      const minutes = Math.floor(delayInSeconds / 60);
      return `+${minutes} min`;
    };

    app.provide('timeHelper', {
      formatDelay: app.config.globalProperties.$formatDelay,
    });
  },
};
