<template><div ref="containerRef"></div></template>
<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { MoonOverlay } from '../../core/canvas-moon.js';
const containerRef = ref(null); let overlay = null;
const props = defineProps({ engine: Object });
onMounted(() => {
  if (!containerRef.value) return;
  overlay = new MoonOverlay(containerRef.value);
  if (props.engine?.mode === 'midnight') overlay.activate();
});
watch(() => props.engine?.mode, (m) => {
  if (!overlay) return; m === 'midnight' ? overlay.activate() : overlay.deactivate();
});
onUnmounted(() => { overlay?.deactivate(); });
</script>