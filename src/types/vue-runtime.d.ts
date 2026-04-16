import "@vue/runtime-core";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $formatDelay: (delayInSeconds: number) => string;
  }
}
