<template><div ref="hostRef"></div></template>
<script setup>
import { ref, onMounted } from 'vue';
import { createAudioToggle } from '../../core/ui-helpers.js';
import { setAudioEnabled } from '../../core/audio-engine.js';
const hostRef = ref(null);
const props = defineProps({ engine: Object });
onMounted(() => {
  if (!hostRef.value || !props.engine) return;
  const { el } = createAudioToggle(props.engine, { setAudioEnabled }); hostRef.value.appendChild(el);
});
</script>