import {Platform} from "react-native";
let baseUrl = "";

if(Platform.OS === "android") {
  baseUrl = "http://192.168.0.105:7500/api/v1"
} else {
  baseUrl = "http://localhost:7500/api/v1"
}

export default baseUrl;