import { createStore, Reducer } from "redux";
import { gameReducer } from "./reducers/gameReducer";

export const state = createStore(gameReducer as Reducer);
