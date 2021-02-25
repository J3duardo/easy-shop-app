import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Products from "../screens/Admin/Products";
import Orders from "../screens/Admin/Orders";
import Categories from "../screens/Admin/Categories";
import ProductForm from "../screens/Admin/ProductForm";

const Stack = createStackNavigator();

const AdminNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Products"
        component={Products}
        options={{
          title: "Products",
          headerShown: true
        }}
      />
      <Stack.Screen
        name="Orders"
        component={Orders}
        options={{
          title: "Orders",
          headerShown: true
        }}
      />
      <Stack.Screen
        name="Categories"
        component={Categories}
        options={{
          title: "Categories",
          headerShown: true
        }}
      />
      <Stack.Screen
        name="ProductForm"
        component={ProductForm}
        options={{
          // title: "Product Form",
          // headerShown: true
        }}
      />
    </Stack.Navigator>
  );
}

export default AdminNavigator;
