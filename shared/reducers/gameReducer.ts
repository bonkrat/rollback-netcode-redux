import { PayloadAction } from "@reduxjs/toolkit";
import { Player } from "../class/Player";
import {
  ADD_PLAYER,
  REMOVE_PLAYER,
  UPDATE_PLAYER,
  RESET_STATE,
} from "../actions";

export interface GameState {
  players: {
    [id: string]: Player;
  };
}

const initialState = {
  players: {},
} as GameState;

export function gameReducer(
  state = initialState,
  // TODO Should probably split this into two reducers...
  action: PayloadAction<Player | GameState>
) {
  let player;
  switch (action.type) {
    case ADD_PLAYER:
      player = action.payload as Player;
      return {
        ...state,
        players: {
          ...state.players,
          [player.id]: player,
        },
      };

    case UPDATE_PLAYER:
      player = action.payload as Player;
      return {
        ...state,
        players: {
          ...state.players,
          [player.id]: player,
        },
      };

    case REMOVE_PLAYER:
      const stateCopy = { ...state };
      player = action.payload as Player;
      delete stateCopy.players[player.id];
      return stateCopy;

    case RESET_STATE:
      return { ...(action.payload as GameState) };

    default:
      return state;
  }
}
