import { createStore } from "redux";
import { io } from "socket.io-client";
import { state as store } from "../server/state";
import { RESET_STATE, UPDATE_PLAYER } from "../shared/actions";
import {
  handleUpdatePlayer as updatePlayer,
  handleUpdatePlayerKeyEvent,
} from "../shared/handlers";
import { gameReducer } from "../shared/reducers/gameReducer";

const store = createStore(gameReducer),
  canvas = document.getElementById("game"),
  ctx = canvas.getContext("2d"),
  socket = io("http://localhost:3000");

socket.on("gamestate", (stateUpdate) => {
  // Update local game state to match the server's state ("rollback")
  store.dispatch({ type: RESET_STATE, payload: stateUpdate });
});

document.addEventListener("keydown", ({ key }) => {
  handleUpdatePlayerKeyEvent({
    store,
    key,
    playerId: socket.id,
    cb: () => socket.emit(UPDATE_PLAYER, key),
  });
});

document.addEventListener("keyup", () => {
  if (socket?.id) {
    const currPlayer = store.getState().players[socket.id];
    // Update direction to stop player from moving to other players.
    updatePlayer({ store, playerId: currPlayer.id, direction: "none" });
    // Emit that no key is being pressed, so no direction for player.
    socket.emit(UPDATE_PLAYER);
  }
});

let previousState, dt;

function step(timestamp) {
  if (!dt) {
    dt = timestamp;
  }

  if (!previousState) {
    previousState = { ...store.getState() };
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const players = store.getState().players;

  // Update store for players based on previous state, which is being set per step.
  // This means there is a one step delay in the player updates.
  // Local player state is handled by event listeners above.
  for (const id in players) {
    if (
      id !== socket.id &&
      // Delay local update to 120 times per second.
      timestamp - dt >= 1000 / 120 &&
      previousState.players[id]
    ) {
      updatePlayer({
        store,
        playerId: id,
        direction: previousState.players[id].direction,
      });
    }

    const { x, y } = players[id];
    ctx.fillRect(x, y, 10, 10);

    dt = timestamp;
  }

  previousState = { ...store.getState() };

  window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);
