import React from "react";
import {TextInput, StyleSheet} from "react-native";
import {Textarea} from "native-base";

const Input = (props) => {
  const {id, placeholder, name, value, autoCorrect, onChangeHandler, onFocusHandler, isSecureText, keyboardType, clearErrors, validationError, textarea} = props;

  if(textarea) {
    return (
      <Textarea
        rowSpan={5}
        style={[styles.inputStyles, {borderColor: `${validationError ? "red": "#03bafc"}`}]}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={value.toString()}
        autoCorrect={autoCorrect}
        onChangeText={(text) => {onChangeHandler(text); clearErrors()}}
        onFocus={onFocusHandler}
        keyboardType={keyboardType}
      />
    )
  }

  return (
    <TextInput
      style={[styles.inputStyles, {borderColor: `${validationError ? "red": "#03bafc"}`}]}
      id={id}
      placeholder={placeholder}
      name={name}
      value={value.toString()}
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
