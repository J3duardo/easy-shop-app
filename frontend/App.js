import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import CustomHeader from "./components/CustomHeader";
import TabsNavigator from "./navigators/TabsNavigator";
import {Root} from "native-base";
import axios from "axios";
import {Provider} from "react-redux";
import store from "./redux/reduxStore";
import baseUrl from "./api/baseUrl";
import { navigationRef } from "./navigationRef";

axios.defaults.baseURL = baseUrl;

// LogBox.ignoreAllLogs(false);

const App = () => {
  return (
    <Root>
      <NavigationContainer ref={navigationRef}>
        <Provider store={store}>
          <CustomHeader />
          <TabsNavigator />
        </Provider>
      </NavigationContainer>
    </Root>
  );
}

export default App;
