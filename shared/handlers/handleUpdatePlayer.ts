import { Store } from "redux";
import { updatePlayer } from "../actions";

interface UpdatePlayerParams {
  store: Store;
  distance?: number;
  playerId: string;
}

// TODO move these into their own shared types file
export type ControlKey = "s" | "w" | "a" | "d";

export const directions = ["up", "down", "left", "right", "none"] as const;
export type Direction = typeof directions[number];

interface HandleUpdatePlayerParams extends UpdatePlayerParams {
  direction: Direction;
}

interface UpdatePlayerKeyEventParams extends UpdatePlayerParams {
  key: ControlKey;
  cb: () => void;
}

export function handleUpdatePlayer({
  store,
  distance = 10,
  playerId,
  direction,
}: HandleUpdatePlayerParams) {
  if (store) {
    const currState = store.getState();
    const currPlayer = currState.players[playerId];

    if (direction === "up") {
      store.dispatch(
        updatePlayer({
          ...currPlayer,
          y: currPlayer.y + distance,
          direction,
        })
      );
    }

    if (direction === "down") {
      store.dispatch(
        updatePlayer({
          ...currPlayer,
          y: currPlayer.y - distance,
          direction,
        })
      );
    }

    if (direction === "left") {
      store.dispatch(
        updatePlayer({
          ...currPlayer,
          x: currPlayer.x - distance,
          direction,
        })
      );
    }

    if (direction === "right") {
      store.dispatch(
        updatePlayer({
          ...currPlayer,
          x: currPlayer.x + distance,
          direction,
        })
      );
    }

    if (direction === "none") {
      store.dispatch(
        updatePlayer({
          ...currPlayer,
          direction,
        })
      );
    }
  }
}

export function handleUpdatePlayerKeyEvent({
  store,
  key,
  distance = 10,
  playerId,
  cb,
}: UpdatePlayerKeyEventParams) {
  const buildHandleUpdatePlayer = (direction: Direction) =>
    handleUpdatePlayer({ store, distance, playerId, direction });

  if (store) {
    const currState = store.getState();
    const currPlayer = currState.players[playerId];

    if (key === "s") {
      buildHandleUpdatePlayer("up");
    }
    if (key === "w") {
      buildHandleUpdatePlayer("down");
    }
    if (key === "a") {
      buildHandleUpdatePlayer("left");
    }
    if (key === "d") {
      buildHandleUpdatePlayer("right");
    }

    if (!key) {
      store.dispatch(updatePlayer({ ...currPlayer, direction: "none" }));
    }

    cb();
  }
}
