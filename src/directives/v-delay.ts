import type { Directive } from "vue";

const applyColor = (el: HTMLElement, delayInSeconds: number) => {
  if (delayInSeconds > 300) {
    el.style.color = "red";
    el.style.fontWeight = "bold";
  } else if (delayInSeconds > 60) {
    el.style.color = "orange";
    el.style.fontWeight = "normal";
  } else {
    el.style.color = "green";
    el.style.fontWeight = "normal";
  }
};

export const delayDirective: Directive<HTMLElement, number> = {
  mounted(el, binding) {
    applyColor(el, binding.value);
  },
  updated(el, binding) {
    applyColor(el, binding.value);
  },
};
