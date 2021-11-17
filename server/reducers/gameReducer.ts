import { PayloadAction } from "@reduxjs/toolkit";
import { Player } from "../../class/Player";
import { ADD_PLAYER, UPDATE_PLAYER, REMOVE_PLAYER } from "../actions";

interface GameState {
  players: {
    [id: string]: Player;
  };
}

const initialState = {
  players: {},
} as GameState;

export function gameReducer(
  state = initialState,
  action: PayloadAction<Player>
) {
  switch (action.type) {
    case ADD_PLAYER:
      const player = action.payload;
      return {
        ...state,
        players: {
          ...state.players,
          [player.id]: player,
        },
      };

    case UPDATE_PLAYER:
      return {
        ...state,
        players: {
          ...state.players,
          [action.payload.id]: action.payload,
        },
      };

    case REMOVE_PLAYER:
      const stateCopy = { ...state };
      delete stateCopy.players[action.payload.id];
      return stateCopy;

    default:
      return state;
  }
}
