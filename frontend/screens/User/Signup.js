import React, {useState, useEffect} from "react";
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from "react-native";
import {Item, Picker, Toast} from "native-base";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons";
import axios from "axios";
import Form from "../../components/form/Form";
import Input from "../../components/form/Input";
import {regExp} from "../../utils/emailValidator";
import countriesData from "../../assets/countries.json";
import TouchableCta from "../../components/TouchableCta";

const Signup = (props) => {
  const {navigate} = props.navigation;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState(countriesData);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /*----------------------------------------------*/
  // Limpiar el state local al salir de la pantalla
  /*----------------------------------------------*/
  useEffect(() => {
    const clearState = props.navigation.addListener("blur", () => {
      setName("");
      setEmail("");
      setPassword("");
      setPasswordConfirm("");
      setPhone("");
      setZip("");
      setCountry("");
      setError(null);
      setIsLoading(false);
    });

    return () => clearState();

  }, [props.navigation]);

  const onSubmitHandler = async () => {
    const user = {name, email, password, passwordConfirm, phone, zip, country}
    setError(null);

    if(!name.length) {
      return setError({type: "name", msg: "Name is required"})
    }

    if(!email.length) {
      return setError({type: "email", msg: "Email is required"})
    }

    if(!regExp.test(email)) {
      return setError({type: "email", msg: "Invalid email address"})
    }

    if(!password.length) {
      return setError({type: "password", msg: "Password is required"})
    }

    if(!passwordConfirm.length) {
      return setError({type: "passwordConfirm", msg: "You must confirm your password"})
    }

    if(password !== passwordConfirm) {
      return setError({type: "passwordMatch", msg: "Passwords don't match"})
    }

    if(!zip.length) {
      return setError({type: "zip", msg: "Zip code is required"})
    }

    if(!phone.length) {
      return setError({type: "phone", msg: "Phone is required"})
    }

    if(!city.length) {
      return setError({type: "city", msg: "The city is required"})
    }

    if(!country) {
      return setError({type: "country", msg: "You must select your country"})
    }

    try {
      setIsLoading(true);

      const res = await axios({
        method: "POST",
        url: "/user/signup",
        data: {name, email, password, passwordConfirm, zip, phone, city, country},
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      setIsLoading(false);
      const userData = res.data.data.user;
      const token = res.data.data.token;

      Toast.show({
        text: `Welcome ${userData.name.split(" ")[0]}, your account was created successfully.`,
        buttonText: "OK",
        buttonStyle: {alignSelf: "center"},
        position: "bottom",
        style: {minHeight: 80},
        type: "success",
        duration: 8000,
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
    <KeyboardAwareScrollView
      viewIsInsideTabBar
      extraHeight={100}
      resetScrollToCoords={{x: 0, y: 0}}
      enableOnAndroid
    >
      <Form title="Signup">
        <Input
          name="name"
          id="name"
          placeholder="Name"
          value={name}
          onChangeHandler={setName}
          clearErrors={() => setError(null)}
          validationError={error && error.type === "name"}
        />
        {error && error.type === "name" && <Text style={styles.errorMsg}>{error.msg}</Text>}

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
          validationError={error && (error.type === "password" || error.type === "passwordMatch")}
          isSecureText
        />
        {error && (error.type === "password" || error.type === "passwordMatch") && <Text style={styles.errorMsg}>{error.msg}</Text>}

        <Input
          name="passwordConfirm"
          id="passwordConfirm"
          placeholder="Confirm password"
          value={passwordConfirm}
          onChangeHandler={setPasswordConfirm}
          clearErrors={() => setError(null)}
          validationError={error && (error.type === "passwordConfirm" || error.type === "passwordMatch")}
          isSecureText
        />
        {error && (error.type === "passwordCofirm" || error.type === "passwordMatch") && <Text style={styles.errorMsg}>{error.msg}</Text>}

        <Input
          placeholder="Zip code"
          name="zip"
          value={zip}
          keyboardType="numeric"
          onChangeHandler={setZip}
          clearErrors={() => setError(null)}
          validationError={error && error.type === "zip"}
        />
        {error && error.type === "zip" && <Text style={styles.errorMsg}>{error.msg}</Text>}

        <Input
          placeholder="Phone"
          name="phone"
          value={phone}
          keyboardType="phone-pad"
          onChangeHandler={setPhone}
          clearErrors={() => setError(null)}
          validationError={error && error.type === "phone"}
        />
        {error && error.type === "phone" && <Text style={styles.errorMsg}>{error.msg}</Text>}

        <Input
          placeholder="City"
          name="city"
          value={city}
          onChangeHandler={setCity}
          clearErrors={() => setError(null)}
          validationError={error && error.type === "city"}
        />
        {error && error.type === "city" && <Text style={styles.errorMsg}>{error.msg}</Text>}

        <Item picker style={{width: "80%", marginBottom: 20}}>
          <Picker
            mode="dropdown"
            iosIcon={() => <Icon name="arrow-down" color="#007aaf" />}
            selectedValue={country}
            placeholder="Select your country"
            placeholderStyle={{color: "#007aaf"}}
            placeholderIconColor="#007aaf"
            onValueChange={setCountry}
          >
            {countries.map(country => {
              return (
                <Picker.Item
                  key={country.code}
                  label={country.name}
                  value={country.name}
                />
              )
            })}
          </Picker>
        </Item>
        {error && error.type === "country" && <Text style={styles.errorMsg}>{error.msg}</Text>}

        {/* Procesar el formulario */}
        <TouchableCta title="Signup" onSubmitHandler={onSubmitHandler} isLoading={isLoading} />

        <TouchableOpacity style={styles.loginLink} onPress={() => navigate("Login")}>
          <Text style={{fontSize: 16, color: "#03bafc"}}>Already have an account? Login!</Text>
        </TouchableOpacity>
      </Form>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  loginLink: {
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

export default Signup;