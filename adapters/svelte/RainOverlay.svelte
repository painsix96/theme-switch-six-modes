<script>
  import { onMount, onDestroy } from 'svelte';
  import { RainOverlay } from '../../core/canvas-rain.js';
  export let engine = null; let container, overlay;
  onMount(() => { overlay = new RainOverlay(container); if (engine?.mode === 'rain') overlay.activate(); });
  $: if (overlay) { engine?.mode === 'rain' ? overlay.activate() : overlay.deactivate(); }
  onDestroy(() => overlay?.deactivate());
</script>
<div bind:this={container}></div>