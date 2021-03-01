import {Platform} from "react-native";
let baseUrl = "";

if(Platform.OS === "android") {
  baseUrl = "https://easyshop-backend.herokuapp.com/api/v1"
} else {
  baseUrl = "http://localhost:7500/api/v1"
}

export default baseUrl;