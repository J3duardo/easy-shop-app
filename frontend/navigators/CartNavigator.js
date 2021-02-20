import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Cart from "../screens/Cart/Cart";
import Checkout from "../screens/Cart/Checkout";

const Stack = createStackNavigator();

const CartNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{
          headerShown: true
        }}
      />
      <Stack.Screen
        name="Checkout"
        component={Checkout}
        options={{
          headerShown: true
        }}
      />
    </Stack.Navigator>
  );
}

export default CartNavigator;
