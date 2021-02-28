import React, {useState, useCallback, useEffect} from "react";
import {View, Text, StyleSheet, Platform} from "react-native";
import {Picker, Item, Icon, Toast} from "native-base";
import {useSelector} from "react-redux";
import axios from "axios";
import moment from "moment";
import {navigate} from "../navigationRef";

const OrderCard = (props) => {
  const {_id, shippingAddress1, shippingAddress2, city, country, createdAt, totalPrice, status} = props.order;
  const {token} = useSelector((state) => state.auth);

  const [orderStatus, setOrderStatus] = useState(status);
  const [cardColor, setCardColor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  /*------------------------------------------------------------*/
  // Asignar el color del card en función del status de la orden
  /*------------------------------------------------------------*/
  useEffect(() => {
    switch(orderStatus) {
      case "pending":
        return setCardColor("#E74C3C")
      case "canceled":
        return setCardColor("#E74C3C")
      case "processed":
        return setCardColor("#F1C40F")
      case "shipped":
        return setCardColor("#2ECC71")
      case "delivered":
        return setCardColor("#2ECC71")
    }
  }, [orderStatus]);


  /*------------------------------*/
  // Cambiar el status de la orden
  /*------------------------------*/
  const orderStatusChangeHandler = async (e) => {
    try {
      setIsLoading(true);

      await axios({
        method: "PATCH",
        url: `/orders/${_id}`,
        data: {
          e
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      setIsLoading(false);

      Toast.show({
        text: `Order ${_id} status changed to ${e}`,
        buttonText: "OK",
        buttonStyle: {alignSelf: "center"},
        position: "bottom",
        style: {minHeight: 80},
        type: "success",
        duration: 6000
      });
      
    } catch (error) {
      setIsLoading(false);
      let message = err.message;
      if(err.response) {
        message = err.response.data.msg
      }
      Toast.show({
        text: message,
        buttonText: "OK",
        buttonStyle: {alignSelf: "center"},
        position: "bottom",
        style: {minHeight: 80},
        type: "danger",
        duration: 6000
      })
    }
  }

  const pickerValues = ["pending", "canceled", "processed", "shipped", "delivered"]

  return (
    <View style={[styles.container, {backgroundColor: `${cardColor}`}]}>
      <View
        style={[
          styles.title,
          {borderBottomWidth: 1, borderBottomColor: `${cardColor === "#E74C3C" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)"}`}
        ]}
      >
        <Text
          style={{
            textTransform: "uppercase",
            textAlign: "center",
            fontWeight: "bold",
            color: cardColor === "#E74C3C" ? "white" : "black"
          }}
        >
          Order Number: {_id}
        </Text>
      </View>
      <View>
        <Text style={{textTransform: "capitalize", color: cardColor === "#E74C3C" ? "white" : "black"}}>
          Status: {orderStatus}
        </Text>
        <Text style={{color: cardColor === "#E74C3C" ? "white" : "black"}}>
          Address 1: {shippingAddress1}
        </Text>
        <Text style={{color: cardColor === "#E74C3C" ? "white" : "black"}}>
          Address 2: {shippingAddress2}
        </Text>
        <Text style={{color: cardColor === "#E74C3C" ? "white" : "black"}}>
          City: {city}
        </Text>
        <Text style={{color: cardColor === "#E74C3C" ? "white" : "black"}}>
          Country: {country}
        </Text>
        <Text style={{color: cardColor === "#E74C3C" ? "white" : "black"}}>
          Date: {moment(createdAt).calendar()}
        </Text>
        <Text style={styles.price}>
          Total Price: ${totalPrice}
        </Text>
        <View
          style={{
            marginTop: 10,
            borderTopWidth:1,
            borderTopColor: `${cardColor === "#E74C3C" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)"}`
          }}
        >
          {Platform.OS === "android" &&
            <Text style={{
              marginTop: 10,
              textAlign: "center",
              color: cardColor === "#E74C3C" ? "white" : "black",
            }}>
              Update order status
            </Text>
          }
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="arrow-down"/>}
            selectedValue={orderStatus}
            placeholder="Change order status"
            style={{color: cardColor === "#E74C3C" ? "white" : "black"}}
            placeholderStyle={{color: "#007AFF"}}
            onValueChange={async (e) => {
              await orderStatusChangeHandler(e);
              setOrderStatus(e);
            }}
          >
            {pickerValues.map(item => {
              return (
                <Item key={item} label={item} value={item} />
              )
            })}
          </Picker>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    padding: 15,
    borderRadius: 10
  },
  title: {
    marginBottom: 5,
    paddingBottom: 5,
    // backgroundColor: "#62B1F6"
  },
  price: {
    alignSelf: "flex-end",
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5, 
    textAlign: "right",
    fontWeight: "bold",
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.5)"
  }
});

export default OrderCard;
