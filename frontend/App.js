import React from "react";
import {View, StyleSheet, LogBox} from "react-native";
import CustomHeader from "./components/CustomHeader";
import ProductsScreen from "./screens/Products/ProductsScreen";

// LogBox.ignoreAllLogs(false);

const App = () => {
  return (
    <View style={styles.container}>
      <CustomHeader />
      <ProductsScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
