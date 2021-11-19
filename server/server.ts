import fastify from "fastify";
import fastifyCors from "fastify-cors";
import fastifyIO from "fastify-socket.io";
import { Player } from "../shared/class/Player";
import { addPlayer, removePlayer, UPDATE_PLAYER } from "../shared/actions";
import {
  ControlKey,
  handleUpdatePlayerKeyEvent,
} from "../shared/handlers/handleUpdatePlayer";
import { createStore, Reducer } from "redux";
import { gameReducer } from "../shared/reducers/gameReducer";

const state = createStore(gameReducer as Reducer),
  server = fastify(),
  simulateLatency = (cb: () => {}) => {
    setTimeout(() => {
      cb();
    }, Math.floor(Math.random() * 250));
  };

server.register(fastifyCors, {});

server.register(fastifyIO, {
  cors: {
    origin: "http://localhost:1234",
  },
});

server.ready().then(() => {
  server.io.on("connection", (socket) => {
    const gameState = state.getState(),
      x = (Object.keys(gameState.players).length + 1) * 20,
      y = 10,
      player = new Player(socket.id, x, y),
      emitState = () => {
        simulateLatency(() => server.io.emit("gamestate", state.getState()));
      };

    state.dispatch(addPlayer(player));

    emitState();

    socket.conn.on("close", () => {
      state.dispatch(removePlayer(player));
      server.io.emit("gamestate", state.getState());
    });

    socket.on(UPDATE_PLAYER, (key: ControlKey) => {
      handleUpdatePlayerKeyEvent({
        store: state,
        key,
        playerId: player.id,
        cb: () => emitState(),
      });
    });
  });
});

server.listen(3000);
