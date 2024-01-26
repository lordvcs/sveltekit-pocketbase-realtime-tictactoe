<script lang="ts">
  import { page } from "$app/stores";
  import { pb } from "$lib/pocketbase.js";
  import type { Game } from "$lib/type.js";
  import type { RecordModel, UnsubscribeFunc } from "pocketbase";
  import { onDestroy, onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { v4 as uuid } from "uuid";

  export let data;
  let { game } = data;

  let toastMessage: string | undefined;
  let toastID: string | undefined;
  let loaded = false;

  let unsubscribe: UnsubscribeFunc | undefined;

  $: if (toastMessage) {
    toastID = uuid();
    let localToastID = toastID;
    setTimeout(() => {
      if (toastID == localToastID) {
        toastMessage = undefined;
      }
    }, 3000);
  } else {
    toastID = undefined;
  }

  onMount(async () => {
    setTimeout(() => {
      loaded = true;
    }, 200);
    if (!$pb) return;

    unsubscribe = await $pb
      .collection("games")
      .subscribe<Game & RecordModel>(game.id, (result) => {
        if (result.action === "delte") return;
        if (result.record.id !== game.id) return;

        game = result.record;
      });
  });

  onDestroy(async () => {
    if (unsubscribe) await unsubscribe();
  });

  async function handleCellSubmit(rowIndex: number, itemIndex: number) {
    try {
      let localGame = game.game;
      await fetch(`/g/${$page.params.game_id}/${rowIndex}/${itemIndex}`, {
        method: "POST",
      });
      if (game.game == localGame && game.active) {
        toastMessage = "Not your turn";
      }
    } catch (error) {}
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText($page.url.href);
    toastMessage = "Link copied to clipboard";
  }
</script>

{#if game.player_o}
  {#each game.game as row, rowIndex}
  <div class="flex items-start justify-center">

    {#each row as item, itemIndex}
      <form
        action="/g/{$page.params.game_id}/{rowIndex}/{itemIndex}"
        method="post"
        class="h-12"
        on:submit|preventDefault={() => handleCellSubmit(rowIndex, itemIndex)}
      >
        <button
          type="submit"
          disabled={item !== ""}
          class="w-12 h-12 bg-blue-900 text-gray-100 font-bold text-2xl border"
        >
          {item}
        </button>
      </form>
    {/each}
  </div>

  {/each}
{:else}
  <h1>Waiting for player O</h1>
  <button on:click={handleCopyLink}>Copy Link for game</button>
{/if}

{#if !game.active && loaded}
  <div transition:fade={{ duration: 100 }}>
    <div transition:fly={{ y: 100, duration: 300 }}>
      {#if game.winner}
        <h1>Plater {game.winner.toUpperCase()} wins!</h1>
      {:else}
        <h1>It's a tie</h1>
      {/if}
      <a href="/g/create">Create a new game</a>
    </div>
  </div>
{/if}

{#if toastMessage}
  <div>
    <button
      class="bg-yellow-300"
      transition:fly={{ y: 100 }}
      on:click={() => (toastMessage = undefined)}>{toastMessage}</button
    >
  </div>
{/if}
