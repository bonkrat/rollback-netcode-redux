import { Player } from "../../class/Player";
import { gameReducer } from "./gameReducer";
import { ADD_PLAYER, REMOVE_PLAYER, UPDATE_PLAYER } from "../actions";

test("adds new player", () => {
  const newPlayer = new Player("foo", 2, 3);
  const finalState = gameReducer(
    { players: {} },
    { type: ADD_PLAYER, payload: newPlayer }
  );

  expect(finalState.players).toEqual({
    foo: newPlayer,
  });
});

test("updates player", () => {
  const player = new Player("foo", 2, 3);
  const player2 = new Player("bar", 5, 6);
  const playerUpdates = { ...player, x: 5, y: 6 };
  const finalState = gameReducer(
    { players: { foo: player, bar: player2 } },
    { type: UPDATE_PLAYER, payload: playerUpdates as Player }
  );
  expect(finalState.players).toEqual({
    foo: playerUpdates,
    bar: player2,
  });
});

test("removes player", () => {
  const player = new Player("foo", 2, 3);
  const finalState = gameReducer(
    {
      players: {
        [player.id]: player,
      },
    },
    { type: REMOVE_PLAYER, payload: player }
  );

  expect(finalState.players).toEqual({});
});
