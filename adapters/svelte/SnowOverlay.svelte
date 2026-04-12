<script>
  import { onMount, onDestroy } from 'svelte';
  import { SnowOverlay } from '../../core/canvas-snow.js';
  export let engine = null; let container, overlay;
  onMount(() => { overlay = new SnowOverlay(container); if (engine?.mode === 'snow') overlay.activate(); });
  $: if (overlay) { engine?.mode === 'snow' ? overlay.activate() : overlay.deactivate(); }
  onDestroy(() => overlay?.deactivate());
</script>
<div bind:this={container}></div>