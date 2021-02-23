import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import CustomHeader from "./components/CustomHeader";
import TabsNavigator from "./navigators/TabsNavigator";
import {Root} from "native-base";
import axios from "axios";
import {Provider} from "react-redux";
import store from "./redux/reduxStore";
import baseUrl from "./api/baseUrl";

axios.defaults.baseURL = baseUrl;

// LogBox.ignoreAllLogs(false);

const App = () => {
  return (
    <Root>
      <Provider store={store}>
        <NavigationContainer>
          <CustomHeader />
          <TabsNavigator />
        </NavigationContainer>
      </Provider>
    </Root>
  );
}

export default App;
