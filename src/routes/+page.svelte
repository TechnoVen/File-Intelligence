<script lang="ts">
  import { onMount } from "svelte";
  import { getFoundationStatus, type FoundationResult } from "$lib/ipc/client";

  let result = $state<FoundationResult | null>(null);
  onMount(() => {
    void getFoundationStatus().then((value) => { result = value; });
  });
</script>

<main>
  <h1>File Intelligence</h1>
  <p class="principle">Understand first. Organize second.</p>
  <section aria-labelledby="foundation-title" aria-live="polite">
    <h2 id="foundation-title">Foundation</h2>
    {#if result === null}
      <p>Checking desktop availability…</p>
    {:else if result.ok}
      <p>The desktop foundation is ready.</p>
      <p>Root selection, scanning, organization, and local AI are not available yet.</p>
    {:else}
      <p role="status">{result.kind === "application" ? result.error.message : result.message}</p>
    {/if}
  </section>
</main>

<style>
  :global(body) { margin: 0; background: #11151b; color: #e8edf3; font-family: system-ui, sans-serif; }
  main { max-width: 42rem; margin: 10vh auto; padding: 2rem; }
  h1 { font-size: 2rem; }
  .principle { color: #a9bbce; }
  section { margin-top: 2rem; padding: 1.5rem; border: 1px solid #425368; border-radius: 0.5rem; }
  h2 { margin-top: 0; }
  p { line-height: 1.6; }
</style>
