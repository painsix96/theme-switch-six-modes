<template><div ref="containerRef"></div></template>
<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { SnowOverlay } from '../../core/canvas-snow.js';
const containerRef = ref(null); let overlay = null;
const props = defineProps({ engine: Object });
onMounted(() => {
  if (!containerRef.value) return; overlay = new SnowOverlay(containerRef.value);
  if (props.engine?.mode === 'snow') overlay.activate();
});
watch(() => props.engine?.mode, (m) => {
  if (!overlay) return; m === 'snow' ? overlay.activate() : overlay.deactivate();
});
onUnmounted(() => { overlay?.deactivate(); });
</script>