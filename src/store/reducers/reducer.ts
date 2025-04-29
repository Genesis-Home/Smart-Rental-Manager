import { Action, State } from "../../types/types";

const initState: State = {
  isLoader: false,
  user: {},
  isLocation: false,
  savedCords: [],
  isError: false,
};

const reducer = (state = initState, action: Action): State => {
  switch (action.type) {
    case "IS_LOADER":
      return {
        ...state,
        isLoader: state.isLoader,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "IS_LOCATION":
      return {
        ...state,
        isLocation: action.payload,
      };
    case "SAVED_COORDS":
      return {
        ...state,
        savedCords: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
