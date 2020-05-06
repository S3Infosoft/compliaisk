import { SET_CURRENT_USER, USER_LOADING, GET_USERS, GET_LOGS } from "../actions/types";

const isEmpty = require("is-empty");

const initialState = {
  isAuthenticated: false,
  user: {},
  users: [],
  logs: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_USERS:
      return {
        ...state,
        users: action.payload
      };
    case GET_LOGS:
      return {
        ...state,
        logs: action.payload
      };
    default:
      return state;
  }
}
