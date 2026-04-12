<script>
  import { onMount, onDestroy } from 'svelte';
  import { LeavesOverlay } from '../../core/leaves-overlay.js';
  export let engine = null; let container, overlay;
  onMount(() => { overlay = new LeavesOverlay(container); if (engine?.mode === 'sunny') overlay.activate(); });
  $: if (overlay) { engine?.mode === 'sunny' ? overlay.activate() : overlay.deactivate(); }
  onDestroy(() => overlay?.deactivate());
</script>
<div bind:this={container}></div>