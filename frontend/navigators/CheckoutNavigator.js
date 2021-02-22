import React from "react";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import Checkout from "../screens/Cart/Checkout";
import Payment from "../screens/Cart/Payment";
import ConfirmPayment from "../screens/Cart/ConfirmPayment";

const Tabs = createMaterialTopTabNavigator();

const CheckoutNavigator = () => {
  return (
    <Tabs.Navigator
      tabBarOptions={{
        labelStyle: {fontSize: 14, textTransform: "uppercase"},
        activeTintColor: "#03bafc",
        inactiveTintColor: "#999",
        indicatorStyle: {height: 2, backgroundColor: "#03bafc"}
      }}
    >
      <Tabs.Screen
        name="Checkout"
        options={{title: "Shipping"}}
        component={Checkout}
      />
      <Tabs.Screen
        name="Payment"
        component={Payment}
      />
      <Tabs.Screen
        name="Confirm"
        options={{title: "Confirm"}}
        component={ConfirmPayment}
      />
    </Tabs.Navigator>
  );
}

export default CheckoutNavigator;
