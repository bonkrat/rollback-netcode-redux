import { io } from "socket.io-client";
import { UPDATE_PLAYER } from "../server/actions";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log(socket.id);
});

let gamestate = {
  players: {},
};

socket.on("gamestate", (stateUpdate) => {
  console.log("stateupdate", stateUpdate);
  gamestate = stateUpdate;
});

document.addEventListener("keydown", (e) => {
  if (["a", "w", "d", "s"].includes(e.key)) {
    socket.emit(UPDATE_PLAYER, e.key);
  }
});

function step(timestamp) {
  const ids = Object.keys(gamestate.players);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ids.forEach((id) => {
    const { x, y } = gamestate.players[id];
    ctx.fillRect(x, y, 10, 10);
  });

  window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);
