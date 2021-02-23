import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions} from "react-native";
import {Toast} from "native-base";
import axios from "axios";
import Form from "../../components/form/Form";
import Input from "../../components/form/Input";
import TouchableCta from "../../components/TouchableCta";
import {regExp} from "../../utils/emailValidator";

const Login = (props) => {
  const {navigate} = props.navigation;
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  /*----------------------------------------------*/
  // Limpiar el state local al salir de la pantalla
  /*----------------------------------------------*/
  useEffect(() => {
    const clearState = props.navigation.addListener("blur", () => {
      setEmail("");
      setPassword("");
      setError(null);
      setIsLoading(false);
    });

    return () => clearState();

  }, [props.navigation]);


  /*--------------------------------------------------*/
  // Validar los campos y procesar el login del usuario
  /*--------------------------------------------------*/
  const onSubmitHandler = async () => {
    const user = {email, password}
    setError(null);

    if(!email.length) {
      return setError({type: "email", msg: "Email is required"})
    }

    if(!regExp.test(email)) {
      return setError({type: "email", msg: "Invalid email address"})
    }

    if(!password.length) {
      return setError({type: "password", msg: "Password is required"})
    }

    try {
      setIsLoading(true);

      const res = await axios({
        method: "POST",
        url: "/user/login",
        data: user,
        headers: {
          "Content-Type": "application/json"
        }
      });

      setIsLoading(false);
      const userData = res.data.data.user;
      const token = res.data.data.token;

      Toast.show({
        text: `Welcome back ${userData.name}`,
        buttonText: "OK",
        buttonStyle: {alignSelf: "center"},
        position: "bottom",
        style: {minHeight: 80},
        type: "success",
        duration: 4000,
        onClose: () => navigate("Home")
      });
      
    } catch (error) {
      let message = error.message;
      if(error.response) {
        message = error.response.data.msg
      }
      setIsLoading(false);

      Toast.show({
        text: message,
        buttonText: "OK",
        buttonStyle: {alignSelf: "center"},
        position: "bottom",
        style: {minHeight: 80},
        type: "danger",
        duration: 9000
      })
    }
  }

  return (
    <Form title="Login">
      <Input
        name="email"
        id="email"
        placeholder="Email"
        value={email}
        onChangeHandler={setEmail}
        clearErrors={() => setError(null)}
        validationError={error && error.type === "email"}
      />
      {error && error.type === "email" && <Text style={styles.errorMsg}>{error.msg}</Text>}

      <Input
        name="password"
        id="password"
        placeholder="Password"
        value={password}
        onChangeHandler={setPassword}
        clearErrors={() => setError(null)}
        validationError={error && error.type === "password"}
        isSecureText
      />
      {error && error.type === "password" && <Text style={styles.errorMsg}>{error.msg}</Text>}      

      {/* Procesar el formulario */}
      <TouchableCta title="Login" onSubmitHandler={onSubmitHandler} isLoading={isLoading} />

      <TouchableOpacity style={styles.signupLink} onPress={() => navigate("Signup")}>
        <Text style={{fontSize: 16, color: "#03bafc"}}>Don't have an account yet? Signup!</Text>
      </TouchableOpacity>
    </Form>
  );
}

const styles = StyleSheet.create({
  signupLink: {
    width: Dimensions.get("window").width * 0.8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  errorMsg: {
    marginBottom: 15,
    textAlign: "center",
    color: "red"
  },
  invalidInputStyle: {
    borderColor: "red"
  }
});

export default Login;
