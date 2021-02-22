import React from "react";
import {TextInput, StyleSheet} from "react-native";

const Input = (props) => {
  const {id, placeholder, name, value, autoCorrect, onChangeHandler, onFocusHandler, isSecureText, keyboardType} = props;

  return (
    <TextInput
      style={styles.inputStyles}
      id={id}
      placeholder={placeholder}
      name={name}
      value={value}
      autoCorrect={autoCorrect}
      onChangeText={onChangeHandler}
      onFocus={onFocusHandler}
      secureTextEntry={isSecureText}
      keyboardType={keyboardType}
    />
  );
}

const styles = StyleSheet.create({
  inputStyles: {
    width: "80%",
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#03bafc",
    backgroundColor: "white"
  }
});

export default Input;
