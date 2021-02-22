import React from "react";
import {ScrollView, Text, Dimensions, StyleSheet} from "react-native";

const {width} = Dimensions.get("window");

const Form = (props) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      {props.children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    paddingTop: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    marginBottom: 10,
    fontSize: 30
  }
})

export default Form;
