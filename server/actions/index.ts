import { Player } from "../../class/Player";

export const ADD_PLAYER = "player/add",
  UPDATE_PLAYER = "player/update",
  REMOVE_PLAYER = "player/remove";

export const addPlayer = (payload: Player) => ({ type: ADD_PLAYER, payload });
export const updatePlayer = (payload: Player) => ({
  type: UPDATE_PLAYER,
  payload,
});
export const removePlayer = (payload: Player) => ({
  type: REMOVE_PLAYER,
  payload,
});
