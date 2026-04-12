<template><div ref="hostRef"></div></template>
<script setup>
import { ref, onMounted } from 'vue';
import { createModeIndicator } from '../../core/ui-helpers.js';
const hostRef = ref(null);
const props = defineProps({ engine: Object });
onMounted(() => {
  if (!hostRef.value || !props.engine) return;
  const { el } = createModeIndicator(props.engine); hostRef.value.appendChild(el);
});
</script>