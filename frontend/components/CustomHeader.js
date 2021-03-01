import React from "react";
import {Image, SafeAreaView, StyleSheet, Text} from "react-native";
import icon from "../assets/icon.png";

const CustomHeader = () => {
  return (
    <SafeAreaView style={styles.header}>
      <Image 
        style={{height: 65}}
        source={icon}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#a0e1eb"
  }
});

export default CustomHeader;
