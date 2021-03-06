import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING,
  GET_USERS,
  GET_LOGS,
  GET_FILES,
} from "./types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Register User
export const registerUser = (userData, history) => (dispatch) => {
  axios
    .post("/api/users/register", userData)
    .then((res) => history.push("/login")) // re-direct to login on successful register
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// User password reset
export const userPasswordReset = (userData, history) => (dispatch) => {
  axios
    .put("/api/users/passwordreset", userData)
    .then((res) => {
      if (res.data == "Password Updated") {
        history.push("/login"); // re-direct to login on successful passsword reset
        alert(res.data);
      } else {
        alert(res.data);
      }
    })
    .catch((err) => {
      console.log("Errors: ", err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

// Login - get user token
export const loginUser = (userData) => (dispatch) => {
  axios
    .post("/api/users/login", userData)
    .then((res) => {
      // Save to localStorage
      // Set token to localStorage
      const { token } = res.data;

      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING,
  };
};
// Log user out
export const logoutUser = (history) => (dispatch) => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

// Get users
export const fetchUsers = () => (dispatch) => {
  fetch("http://localhost:5000/api/users/userslist")
    .then((res) => res.json())
    .then((data) =>
      dispatch({
        type: GET_USERS,
        payload: data,
      })
    );
};

// Get logs
export const fetchLogs = () => (dispatch) => {
  fetch("http://localhost:5000/api/calllogs/logs")
    .then((res) => res.json())
    .then((data) => {
      dispatch({
        type: GET_LOGS,
        payload: data,
      });
    });
};

// Get files
export const fetchFiles = () => (dispatch) => {
  fetch("http://localhost:5000/api/fileupload/filelist")
    .then((res) => res.json())
    .then((data) => {
      dispatch({
        type: GET_FILES,
        payload: data,
      });
    });
};
