// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers/rootReducer'; // combineReducers

const store = configureStore({
  reducer: rootReducer,
});

export default store;
