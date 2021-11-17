import fastify from "fastify";
import fastifyCors from "fastify-cors";
import fastifyIO from "fastify-socket.io";
import { Player } from "../class/Player";
import { state } from "./state";
import {
  addPlayer,
  removePlayer,
  updatePlayer,
  UPDATE_PLAYER,
} from "./actions";

const server = fastify();
server.register(fastifyCors, {});

server.register(fastifyIO, {
  cors: {
    origin: "http://localhost:1234",
  },
});

// server.get("/", (req, reply) => {
//   server.io.emit("hello");
// });

server.ready().then(() => {
  server.io.on("connection", (socket) => {
    const gameState = state.getState(),
      x = (Object.keys(gameState.players).length + 1) * 20,
      y = 10,
      player = new Player(socket.id, x, y);

    state.dispatch(addPlayer(player));

    server.io.emit("gamestate", state.getState());

    socket.conn.on("close", () => {
      state.dispatch(removePlayer(player));
      server.io.emit("gamestate", state.getState());
    });

    socket.on(UPDATE_PLAYER, (code) => {
      const currState = state.getState();

      const currPlayer = currState.players[player.id];

      if (code === "s") {
        state.dispatch(updatePlayer({ ...currPlayer, y: currPlayer.y + 1 }));
      }
      if (code === "w") {
        state.dispatch(updatePlayer({ ...currPlayer, y: currPlayer.y - 1 }));
      }
      if (code === "a") {
        state.dispatch(updatePlayer({ ...currPlayer, x: currPlayer.x - 1 }));
      }
      if (code === "d") {
        state.dispatch(updatePlayer({ ...currPlayer, x: currPlayer.x + 1 }));
      }

      server.io.emit("gamestate", state.getState());
    });
  });
});

server.listen(3000);
