import React from "react";
import {Image, SafeAreaView, StyleSheet, Text} from "react-native";
import icon from "../assets/icon.png";

const CustomHeader = () => {
  return (
    <SafeAreaView style={styles.header}>
      <Image 
        style={{height: 30, width: 30, marginRight: 16}}
        source={icon}
        resizeMode="contain"
      />
      <Text style={{fontSize: 16}}>Mi primera app en React Native</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#a0e1eb"
  }
});

export default CustomHeader;
