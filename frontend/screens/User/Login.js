import React, {useEffect, useState} from "react";
import {Text, TouchableOpacity, StyleSheet, Dimensions} from "react-native";
import {Toast} from "native-base";
import {useSelector, useDispatch} from "react-redux";
import Form from "../../components/form/Form";
import Input from "../../components/form/Input";
import TouchableCta from "../../components/TouchableCta";
import {regExp} from "../../utils/emailValidator";
import {userLogin, clearErrors} from "../../redux/actions/userActions";

const Login = (props) => {
  const {navigate} = props.navigation;
  const dispatch = useDispatch();
  const {user, token, isLoading, authError} = useSelector((state) => state.auth);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  
  /*----------------------------------------------*/
  // Limpiar el state local al salir de la pantalla
  /*----------------------------------------------*/
  useEffect(() => {
    const clearState = props.navigation.addListener("blur", () => {
      setEmail("");
      setPassword("");
      setError(null);
      Toast.hide();
    });

    return () => clearState();
  }, []);


  /*--------------------------------------------------*/
  // Validar los campos y procesar el login del usuario
  /*--------------------------------------------------*/
  const onSubmitHandler = async () => {
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

    dispatch(userLogin({email, password}));
  }


  /*------------------------------------------------------------------*/
  // Mostrar notificaciones toast y redirigir en caso de login exitoso
  /*------------------------------------------------------------------*/
  useEffect(() => {
    if(user && token && !authError) {
      Toast.show({
        text: `Welcome back ${user.name.split(" ")[0]}`,
        buttonText: "OK",
        buttonStyle: {alignSelf: "center"},
        position: "bottom",
        style: {minHeight: 80},
        type: "success",
        duration: 4000,
        onClose: () => navigate("Home")
      });
    }

    if(authError) {
      Toast.show({
        text: authError,
        buttonText: "OK",
        buttonStyle: {alignSelf: "center"},
        position: "bottom",
        style: {minHeight: 80},
        type: "danger",
        duration: 8000,
        onClose: () => dispatch(clearErrors())
      })
    }

  }, [user, token, authError]);

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
