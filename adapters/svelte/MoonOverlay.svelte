<script>
  import { onMount, onDestroy } from 'svelte';
  import { MoonOverlay } from '../../core/canvas-moon.js';
  export let engine = null; let container, overlay;
  onMount(() => {
    overlay = new MoonOverlay(container);
    if (engine?.mode === 'midnight') overlay.activate();
  });
  $: if (overlay) { engine?.mode === 'midnight' ? overlay.activate() : overlay.deactivate(); }
  onDestroy(() => overlay?.deactivate());
</script>
<div bind:this={container}></div>