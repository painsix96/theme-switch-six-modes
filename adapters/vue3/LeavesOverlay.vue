<template><div ref="containerRef"></div></template>
<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { LeavesOverlay } from '../../core/leaves-overlay.js';
const containerRef = ref(null); let overlay = null;
const props = defineProps({ engine: Object });
onMounted(() => {
  if (!containerRef.value) return; overlay = new LeavesOverlay(containerRef.value);
  if (props.engine?.mode === 'sunny') overlay.activate();
});
watch(() => props.engine?.mode, (m) => {
  if (!overlay) return; m === 'sunny' ? overlay.activate() : overlay.deactivate();
});
onUnmounted(() => { overlay?.deactivate(); });
</script>