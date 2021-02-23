import React from "react";
import {TextInput, StyleSheet} from "react-native";

const Input = (props) => {
  const {id, placeholder, name, value, autoCorrect, onChangeHandler, onFocusHandler, isSecureText, keyboardType, clearErrors, validationError} = props;

  return (
    <TextInput
      style={[styles.inputStyles, {borderColor: `${validationError ? "red": "#03bafc"}`}]}
      id={id}
      placeholder={placeholder}
      name={name}
      value={value}
      autoCorrect={autoCorrect}
      onChangeText={(text) => {onChangeHandler(text), clearErrors()}}
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
    backgroundColor: "white"
  }
});

export default Input;
