import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Products from "../screens/Admin/Products";
import Orders from "../screens/Admin/Orders";
import Categories from "../screens/Admin/Categories";
import ProductForm from "../screens/Admin/ProductForm";
import ProductDetails from "../screens/Products/ProductDetails";

const Stack = createStackNavigator();

const AdminNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Products"
        component={Products}
        options={{
          title: "Admin Products",
          headerShown: true
        }}
      />
      <Stack.Screen
        name="Details"
        component={ProductDetails}
        options={{
          title: "Product Details",
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
