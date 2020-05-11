import { SET_CURRENT_USER, USER_LOADING, GET_USERS, GET_LOGS, GET_FILES, GET_ERRORS,  } from "../actions/types";

const isEmpty = require("is-empty");

const initialState = {
  isAuthenticated: false,
  user: {},
  users: [],
  logs: [],
  files: [],
  errors: {},
  
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
    case GET_FILES:
      return {
        ...state,
        files: action.payload
      }
    case GET_ERRORS:
      return {
        ...state,
        errors: action.payload
      }
    
    default:
      return state;
  }
}
