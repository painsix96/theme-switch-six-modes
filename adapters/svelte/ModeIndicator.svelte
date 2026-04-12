<script>
  import { onMount } from 'svelte';
  import { createModeIndicator } from '../../core/ui-helpers.js';
  export let engine = null; let host;
  onMount(() => { if (!host || !engine) return; const { el } = createModeIndicator(engine); host.appendChild(el); });
</script>
<div bind:this={host}></div>