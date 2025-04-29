import { createStore, applyMiddleware, Store, Middleware } from "redux";
import rootReducer from "../reducers/rootReducer";
import { RootState } from "../../types/types";
import { Action } from "redux";


const store: Store<RootState, Action> = createStore(
  rootReducer,
  {}
  // applyMiddleware(thunk)
);

export default store;
