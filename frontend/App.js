import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import CustomHeader from "./components/CustomHeader";
import TabsNavigator from "./navigators/TabsNavigator";
import axios from "axios";
import {Provider} from "react-redux";
import store from "./redux/reduxStore";
import baseUrl from "./api/baseUrl";

axios.defaults.baseURL = baseUrl;

// LogBox.ignoreAllLogs(false);

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <CustomHeader />
        <TabsNavigator />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
