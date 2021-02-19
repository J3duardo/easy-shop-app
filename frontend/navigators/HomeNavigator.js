import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import ProductsScreen from "../screens/Products/ProductsScreen";
import ProductDetails from "../screens/Products/ProductDetails";

const Stack = createStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={ProductsScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Product Details"
        component={ProductDetails}
        options={{
          headerShown: true
        }}
      />
    </Stack.Navigator>
  );
}

export default HomeNavigator;
