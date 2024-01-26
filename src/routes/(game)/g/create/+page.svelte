<script lang="ts">
  export let data;
  export let form;
</script>

<h1 class="text-3xl font-bold">Create Game</h1>

<form method="post">
  <input
    type="text"
    placeholder="Game ID"
    name="gameID"
    value={form?.gameID ?? ""}
  />
  <button type="submit">Create</button>
</form>

{#if form?.error}
  <p>{form.error}</p>
{/if}