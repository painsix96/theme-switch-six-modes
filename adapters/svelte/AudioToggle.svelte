<script>
  import { onMount } from 'svelte';
  import { createAudioToggle } from '../../core/ui-helpers.js';
  import { setAudioEnabled } from '../../core/audio-engine.js';
  export let engine = null; let host;
  onMount(() => { if (!host || !engine) return; const { el } = createAudioToggle(engine, { setAudioEnabled }); host.appendChild(el); });
</script>
<div bind:this={host}></div>