<script>
  import { onMount } from 'svelte';
  import { createModeToast } from '../../core/ui-helpers.js';
  export let engine = null; let host;
  onMount(() => { if (!host || !engine) return; const { el } = createModeToast(engine); host.appendChild(el); });
</script>
<div bind:this={host}></div>