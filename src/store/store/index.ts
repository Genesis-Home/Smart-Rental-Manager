import { createStore, applyMiddleware, Store, Middleware } from 'redux';
import rootReducer from '../reducers/rootReducer';
import thunk from 'redux-thunk';
import { Action } from 'redux';

export type RootState = ReturnType<typeof rootReducer>;

const store: Store<RootState, Action> = createStore(
  rootReducer,
  {},
  applyMiddleware(thunk)
);

export default store;
