import { GameNotAvailableError, type Board, type Game } from "$lib/type";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

import type { RecordModel } from "pocketbase";

function hasDraw(board: Board) {
  for (let row of board) {
    let hasEmptySpace = row.some(move => move === "");
    if (hasEmptySpace) {
      return false;
    }
  }
  return true;
}
function getWinner(board: Board, currentPlayer: "x" | "o") {
  // Winner
  const horizontalWin = board.find(
    (moves) =>
      moves[0] === moves[1] &&
      moves[1] === moves[2] &&
      moves[0] === currentPlayer
  );

  let diagonalWin = false;

  if (!horizontalWin) {
    diagonalWin =
      (board[0][0] === currentPlayer &&
        board[1][1] === currentPlayer &&
        board[2][2] === currentPlayer) ||
      (board[0][2] === currentPlayer &&
        board[1][1] === currentPlayer &&
        board[2][0] === currentPlayer);
  }

  let verticalWin = false;

  if (!horizontalWin && !diagonalWin) {
    verticalWin =
      (board[0][0] === currentPlayer &&
        board[1][0] === currentPlayer &&
        board[2][0] === currentPlayer) ||
      (board[0][1] === currentPlayer &&
        board[1][1] === currentPlayer &&
        board[2][1] === currentPlayer) ||
      (board[0][2] === currentPlayer &&
        board[1][2] === currentPlayer &&
        board[2][2] === currentPlayer);
  }

  if (horizontalWin || diagonalWin || verticalWin) {
    return currentPlayer;
  }
}

export const POST = async ({ locals, params }) => {
  const authModel = locals.pocketBase.authStore.model;
  if (!authModel) {
    redirect(303, "/");
  }
  let valid = false;
  try {
    const gamesCollection = locals.pocketBase.collection("games");
    const result: Game & RecordModel = await gamesCollection.getFirstListItem(
      `game_id="${params.game_id}"`
    );

    const playerIsX = result.player_x === authModel["id"];
    const playerIsO = result.player_o && result.player_o === authModel["id"];

    if (!(playerIsX || playerIsO)) {
      throw new GameNotAvailableError();
    }

    valid = true;

    if (!result.player_o) {
      throw new Error();
    }
    if (!result.active) {
      throw new Error();
    }

    const rowIndex = parseInt(params.row_index as string);

    const rowIndexGreaterThan = rowIndex >= 0;
    const rowIndexLessThan = rowIndex <= 2;
    if (!(rowIndexGreaterThan || rowIndexLessThan)) {
      throw new Error();
    }

    const itemIndex = parseInt(params.item_index as string);

    const itemIndexGreaterThan = itemIndex >= 0;
    const itemIndexLessThan = itemIndex <= 2;
    if (!(itemIndexGreaterThan || itemIndexLessThan)) {
      throw new Error();
    }

    if (result.game[rowIndex][itemIndex] !== "") {
      throw new Error();
    }

    if (playerIsX && result.current_player === "x") {
      result.game[rowIndex][itemIndex] = "x";
      const winner = getWinner(result.game, result.current_player);
      if (!winner) {
        result.active = !hasDraw(result.game);
      } else {
        result.active = false;
        result.winner = winner;
      }

      if (result.active) {
        result.current_player = "o";
      }

      await gamesCollection.update<Game & RecordModel>(result.id, result);
    } else if (playerIsO && result.current_player === "o") {
      result.game[rowIndex][itemIndex] = "o";
      const winner = getWinner(result.game, result.current_player);
      if (!winner) {
        result.active = !hasDraw(result.game);
      } else {
        result.active = false;
        result.winner = winner;
      }

      if (result.active) {
        result.current_player = "x";
      }

      await gamesCollection.update<Game & RecordModel>(result.id, result);
    }
  } catch (error) {
    redirect(303, "/?error=game-not-available");
  }
  return new Response();
};
