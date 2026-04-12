<template><div ref="containerRef"></div></template>
<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { RainOverlay } from '../../core/canvas-rain.js';
const containerRef = ref(null); let overlay = null;
const props = defineProps({ engine: Object });
onMounted(() => {
  if (!containerRef.value) return; overlay = new RainOverlay(containerRef.value);
  if (props.engine?.mode === 'rain') overlay.activate();
});
watch(() => props.engine?.mode, (m) => {
  if (!overlay) return; m === 'rain' ? overlay.activate() : overlay.deactivate();
});
onUnmounted(() => { overlay?.deactivate(); });
</script>