import React, {useEffect, useState} from "react";
import {View, Text, Button, StyleSheet} from "react-native";
import {Item, Picker} from "native-base";
import Icon from "react-native-vector-icons";
import {useSelector} from "react-redux";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import Form from "../../components/form/Form";
import Input from "../../components/form/Input";
import countriesData from "../../assets/countries.json";

const Checkout = (props) => {
  const items = useSelector((state) => state.cart.items);
  const {user} = useSelector((state) => state.auth);
  const {navigate} = props.navigation;

  const [orderItems, setOrderItems] = useState([]);
  const [address, setAddress] = useState("");
  const [secondAddress, setSecondAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [countries, setCountries] = useState(countriesData);
  const [error, setError] = useState(null);
  const [serverResponseError, setServerResponseError] = useState(null);


  /*-------------------------------------------------------------------------------------------*/
  // Generar los items de las órdenes especificando la cantidad de cada producto (1 por defecto)
  /*-------------------------------------------------------------------------------------------*/
  useEffect(() => {
    let data = items.map(el => {
      return {product: el, quantity: 1}
    });

    setOrderItems(data);

    return () => setOrderItems([]);
  }, [items]);

  
  // Validar campos y procesar la orden
  const orderHandler = () => {
    setError(null);

    if(!phone.length) {
      return setError({type: "phone", msg: "You must provide your phone"})
    }
    
    if(!address.length) {
      return setError({type: "shippingAddress", msg: "Your address is required"})
    }

    if(!secondAddress.length) {
      return setError({type: "shippingAddress2", msg: "Your address is required"})
    }

    if(!city.length) {
      return setError({type: "city", msg: "Your city is required"})
    }

    if(!zip.length) {
      return setError({type: "zip", msg: "The zip code is required"})
    }

    if(!country.length) {
      return setError({type: "country", msg: "You must provide your country"})
    }

    const order = {
      city,
      country,
      orderItems,
      phone,
      shippingAddress1: address,
      shippingAddress2: secondAddress,
      user: user._id,
      zip,
    }

    return navigate("Payment", {order});
  }

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <Form
        title="Shipping Address"
        serverResponseError={serverResponseError}
      >
        <Input
          placeholder="Phone"
          name="phone"
          id="phone"
          value={phone}
          keyboardType="phone-pad"
          onChangeHandler={setPhone}
          clearErrors={() => setError(null)}
          validationError={error && error.type === "phone"}
        />
        {error && error.type === "phone" && <Text style={styles.errorMsg}>{error.msg}</Text>}

        <Input
          placeholder="Shipping Address 1"
          name="shippingAddress"
          id="shippingAddress"
          value={address}
          onChangeHandler={setAddress}
          clearErrors={() => setError(null)}
          validationError={error && error.type === "shippingAddress"}
        />
        {error && error.type === "shippingAddress" && <Text style={styles.errorMsg}>{error.msg}</Text>}
        
        <Input
          placeholder="Shipping Address 2"
          name="shippingAddress2"
          id="shippingAddress2"
          value={secondAddress}
          onChangeHandler={setSecondAddress}
          clearErrors={() => setError(null)}
          validationError={error && error.type === "shippingAddress2"}
        />
        {error && error.type === "shippingAddress2" && <Text style={styles.errorMsg}>{error.msg}</Text>}

        <Input
          placeholder="City"
          name="city"
          id="city"
          value={city}
          onChangeHandler={setCity}
          clearErrors={() => setError(null)}
          validationError={error && error.type === "city"}
        />
        {error && error.type === "city" && <Text style={styles.errorMsg}>{error.msg}</Text>}

        <Input
          placeholder="Zip code"
          name="zip"
          id="zip"
          value={zip}
          keyboardType="numeric"
          onChangeHandler={setZip}
          clearErrors={() => setError(null)}
          validationError={error && error.type === "zip"}
        />
        {error && error.type === "zip" && <Text style={styles.errorMsg}>{error.msg}</Text>}
        
        <Item picker style={{width: "80%", marginBottom: 20}}>
          <Picker
            mode="dropdown"
            iosIcon={() => <Icon name="arrow-down" color="#007aaf" />}
            selectedValue={country}
            placeholder="Select your country"
            placeholderStyle={{color: "#007aaf"}}
            placeholderIconColor="#007aaf"
            onValueChange={(e) => {setCountry(e); error && error.type === "country" && setError(null)}}
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

        <View style={{width: "80%", alignItems: "center"}}>
          <Button
            title="Confirm"
            color="#03bafc"
            // disabled={!isValid()}
            onPress={orderHandler}
          />
        </View>
      </Form>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  errorMsg: {
    marginBottom: 15,
    textAlign: "center",
    color: "red"
  },
  invalidInputStyle: {
    borderColor: "red"
  }
});

export default Checkout;
