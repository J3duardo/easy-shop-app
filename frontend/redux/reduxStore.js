import {createStore, combineReducers, applyMiddleware} from "redux"
import thunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension/developmentOnly";
import cartReducer from "./reducers/cartReducer";
import userReducer from "./reducers/userReducer";

const reducers = combineReducers({
  cart: cartReducer,
  auth: userReducer
});

const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));

export default store;