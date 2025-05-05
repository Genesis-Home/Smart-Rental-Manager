import { Action, State } from "../../types/types";

const initState: State = {
  isLoader: false,
  user: {},
  isLocation: false,
  savedCords: [],
  isError: false,
  properties: [],
  property: null,
  contacts: [],
  userProperties: [],
  schedules:[]
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
    case "SET_PROPERTIES":
      return {
        ...state,
        properties: action.payload,
      };
    case "SET_USER_CONTACTS":
      return {
        ...state,
        contacts: action.payload,
      };
    case "SET_USER_PROPERTIES":
      return {
        ...state,
        userProperties: action.payload,
      };
    case "SET_USER_SCHEDULES":
      return {
        ...state,
        schedules: action.payload,
      };
    case "SET_PROPERTY":
      return {
        ...state,
        property: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
