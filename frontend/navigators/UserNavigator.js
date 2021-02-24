import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Login from "../screens/User/Login";
import Signup from "../screens/User/Signup";
import UserProfile from "../screens/User/UserProfile";

const Stack = createStackNavigator();

const UserNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          title: "User profile",
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
}

export default UserNavigator;
