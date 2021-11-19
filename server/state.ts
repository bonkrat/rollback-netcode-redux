import { createStore, Reducer } from "redux";
import { gameReducer } from "../shared/reducers/gameReducer";

export const state = createStore(gameReducer as Reducer);
