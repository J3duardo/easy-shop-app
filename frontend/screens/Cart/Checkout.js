import React, {useEffect, useState} from "react";
import {View, Button, StyleSheet} from "react-native";
import {Item, Picker} from "native-base";
import Icon from "react-native-vector-icons";
import {useSelector} from "react-redux";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import Form from "../../components/form/Form";
import Input from "../../components/form/Input";
import countriesData from "../../assets/countries.json";

const Checkout = (props) => {
  const items = useSelector((state) => state.cart.items);
  const {navigate} = props.navigation;

  const [orderItems, setOrderItems] = useState([]);
  const [address, setAddress] = useState("");
  const [secondAddress, setSecondAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [countries, setCountries] = useState(countriesData);

  useEffect(() => {
    setOrderItems(items);
    return () => setOrderItems([]);
  }, [items]);

  const orderHandler = () => {
    const order = {
      city,
      country,
      orderItems,
      orderDate: Date.now(),
      shippingAddress1: address,
      shippingAddress2: secondAddress,
      zip
    }

    return order;
  }
  
  // Chequear si todos los campos del formulario fueron completados
  const isValid = () => {
    if(!address || !secondAddress || !city || !zip || !phone || !country) {
      return false
    }
    return true;
  }

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <Form title="Shipping Address">
        <Input
          placeholder="Phone"
          name="phone"
          value={phone}
          keyboardType="numeric"
          onChangeHandler={(text) => setPhone(text)}
        />
        <Input
          placeholder="Shiping Address 1"
          name="shippingAddress"
          value={address}
          onChangeHandler={(text) => setAddress(text)}
        />
        <Input
          placeholder="Shiping Address 2"
          name="shippingAddress2"
          value={secondAddress}
          onChangeHandler={(text) => setSecondAddress(text)}
        />
        <Input
          placeholder="City"
          name="city"
          value={city}
          onChangeHandler={(text) => setCity(text)}
        />
        <Input
          placeholder="Zip code"
          name="zip"
          value={zip}
          keyboardType="numeric"
          onChangeHandler={(text) => setZip(text)}
        />
        <Item picker style={{width: "80%", marginBottom: 20}}>
          <Picker
            mode="dropdown"
            iosIcon={() => <Icon name="arrow-down" color="#007aaf" />}
            selectedValue={country}
            placeholder="Select your country"
            placeholderStyle={{color: "#007aaf"}}
            placeholderIconColor="#007aaf"
            onValueChange={(e) => setCountry(e)}
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
        <View style={{width: "80%", alignItems: "center"}}>
          <Button
            title={`${!isValid() ? "Complete all fields" : "Confirm"}`}
            color="#03bafc"
            disabled={!isValid()}
            onPress={() => navigate("Payment", {order: orderHandler()})}
          />
        </View>
      </Form>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({});

export default Checkout;
