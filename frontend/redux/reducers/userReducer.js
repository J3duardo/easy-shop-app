import AsyncStorage from "@react-native-async-storage/async-storage";
import {USER_TYPES} from "../types";

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  authError: null
}

const cartReducer = async (state = initialState, action) => {
  switch(action.type) {
    case USER_TYPES.USER_AUTH_START:
      return {...state, isLoading: true, authError: null}
    case USER_TYPES.USER_AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        error: null
      }
    case USER_TYPES.USER_AUTH_ERROR:
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        authError: action.payload
      }
    case USER_TYPES.USER_LOGOUT:
      await AsyncStorage.multiRemove(["token", "user"]);
      return {
        user: null,
        token: null,
        isLoading: false,
        authError: null
      }
    case USER_TYPES.CLEAR_AUTH_ERROR:
      return {
        ...state,
        authError: null
      }
    default:
      return state
  }
}

export default cartReducer;