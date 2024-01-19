<script lang="ts">
  export let data;
</script>

<h1 class="text-3xl font-bold">Tic Tac toe using sveltekit and pocketbase</h1>

{#if data.authenticated}
  <a href="/g/create">Create a new game</a>
{:else}
  <div class="flex space-x-2 items-center">
    <a href="/login">Log in</a>
    <p>or</p>
    <a href="/signup">Sign up</a>
  </div>
{/if}
