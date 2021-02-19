import React from "react";
import {Image, SafeAreaView, StyleSheet, Text} from "react-native";
import icon from "../assets/icon.png";

const CustomHeader = () => {
  return (
    <SafeAreaView style={styles.header}>
      <Image 
        style={{height: 50, width: 50, marginRight: 16}}
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
    justifyContent: "center",
    paddingVertical: 10
  }
});

export default CustomHeader;
