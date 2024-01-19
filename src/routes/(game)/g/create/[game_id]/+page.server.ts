import { GameNotAvailableError, type Game } from "$lib/type.js";
import { redirect } from "@sveltejs/kit";
import type { RecordModel } from "pocketbase";

export const load = async ({ params, locals }) => {
  const authModel = locals.pocketBase.authStore.model;
  if (!authModel) {
    redirect(303, "/");
  }

  try {
    const gamesCollection = locals.pocketBase.collection("games");
    let game: Game & RecordModel = await gamesCollection.getFirstListItem(
      `game_id="${params.game_id}"`
    );
    const playerIsX = game.player_x === authModel["id"];
    const playerIsO = game.player_o && game.player_o === authModel["id"];
    const playerOEmpty = !game.player_o;
    if (!playerIsX && playerOEmpty) {
      game = await gamesCollection.update(game.id, {
        ...game,
        player_o: authModel["id"],
      });
    }
    if (playerIsO || playerIsX || playerOEmpty) {
      return {
        game,
        playerId: authModel.id,
      };
    }
    throw new GameNotAvailableError();
  } catch (error) {
    if (error instanceof GameNotAvailableError) {
      throw redirect(303, "/?error=Game+not+available");
    }
  }

  return redirect(303, "/");
};
