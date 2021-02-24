import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {navigate} from "../../navigationRef";
import {USER_TYPES} from "../types";

const userAuthStart = () => {
  return {
    type: USER_TYPES.USER_AUTH_START
  }
}

export const userAuthSuccess = (user, token) => {
  return {
    type: USER_TYPES.USER_AUTH_SUCCESS,
    payload: {user, token}
  }
}

const userAuthError = (error) => {
  return {
    type: USER_TYPES.USER_AUTH_ERROR,
    payload: error
  }
}


/*---------------------------------*/
// Procesar el registro del usuario
/*---------------------------------*/
export const userSignup = (userData) => {
  const {name, email, password, passwordConfirm, phone, zip, city, country} = userData;

  return async (dispatch) => {
    dispatch(userAuthStart());

    try {
      const res = await axios({
        method: "POST",
        url: "/user/signup",
        data: {name, email, password, passwordConfirm, phone, zip, city, country},
        headers: {
          "Content-Type": "application/json"
        }
      });

      const {user, token} = res.data.data;
      const userString = JSON.stringify(user);  
      await AsyncStorage.multiSet([["user", userString], ["token", token]]);
      dispatch(userAuthSuccess(user, token));

    } catch (err) {
      let message = err.message;
      if(err.response) {
        message = err.response.data.msg
      }
      dispatch(userAuthError(message))
    }
  }
}


/*------------------------------*/
// Procesar el login del usuario
/*------------------------------*/
export const userLogin = (userData) => {
  const {email, password} = userData;

  return async (dispatch) => {
    dispatch(userAuthStart());
    try {
      const res = await axios({
        method: "POST",
        url: "/user/login",
        data: {email, password},
        headers: {
          "Content-Type": "application/json"
        }
      })
      
      const {user, token} = res.data.data;
      const userString = JSON.stringify(user);  
      await AsyncStorage.multiSet([["user", userString], ["token", token]]);
      dispatch(userAuthSuccess(user, token));
      navigate("UserProfile");

    } catch (err) {
      let message = err.message;
      if(err.response) {
        message = err.response.data.msg
      }
      dispatch(userAuthError(message)) 
    }
  }
}


/*-------------------------*/
// Cerrar sesión de usuario
/*-------------------------*/
export const userLogout = () => {
  return {type: USER_TYPES.USER_LOGOUT}
}


/*----------------*/
// Limpiar errores
/*----------------*/
export const clearErrors = () => {
  return {type: USER_TYPES.CLEAR_AUTH_ERROR}
}