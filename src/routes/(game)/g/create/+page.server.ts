import { fail, redirect } from "@sveltejs/kit";
import { v4 as uuid } from "uuid";

export const load = () => {
  return {
    gameID: uuid(),
  };
};

/**
 * Generates a new game in the "games" collection.
 *
 * @param {Object} locals - The locals object.
 * @param {Object} request - The request object.
 * @return {Promise<void>} - Returns a promise that resolves when the game is created.
 */
export const actions = {
  default: async ({ locals, request }) => {
    const { gameID } = Object.fromEntries((await request.formData()) as any);
    if (!gameID) {
      return fail(422, {
        gameID,
        error: "Invalid game id",
      });
    }

    try {
      const authModel = locals.pocketBase.authStore.model;
      if (!authModel) return;

      await locals.pocketBase.collection("games").create({
        game_id: gameID,
        active: true,
        current_player: "x",
        game: new Array(3).fill(new Array(3).fill("")),
        player_x: authModel["id"],
      });
    } catch (error: any) {
      console.error(error);
      return {
        gameID,
        error: error?.message ?? "Unknown error occurred when creating game",
      };
    }
    redirect(303, `/g/${gameID}`);
  },
};
