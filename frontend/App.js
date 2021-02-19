import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import CustomHeader from "./components/CustomHeader";
import TabsNavigator from "./navigators/TabsNavigator";

// LogBox.ignoreAllLogs(false);

const App = () => {
  return (
    <NavigationContainer>
      <CustomHeader />
      <TabsNavigator />
    </NavigationContainer>
  );
}

export default App;
