import { createStore, applyMiddleware, Store, Middleware } from "redux";
import rootReducer from "../reducers/rootReducer";
import thunk, { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, undefined, Action>;

const store: Store<RootState, Action> = createStore(
  rootReducer,
  {},
  applyMiddleware(thunk)
);

export default store;
