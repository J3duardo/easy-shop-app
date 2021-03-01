import React, {useState, useCallback} from "react";
import {View, Text, FlatList, ScrollView, ActivityIndicator, StyleSheet} from "react-native";
import {Toast} from "native-base";
import {useFocusEffect} from "@react-navigation/native";
import {useSelector} from "react-redux";
import axios from "axios";
import OrderCard from "../../components/OrderCard";

const Orders = () => {
  const {token} = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /*----------------------*/
  // Consultar las órdenes
  /*----------------------*/
  useFocusEffect(useCallback(() => {
    if(token) {
      setIsLoading(true);
      axios({
        method: "GET",
        url: "/orders",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setIsLoading(false);
        setOrders(res.data.data)
      })
      .catch(err => {
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
      })
    }

    return () => setOrders([]);
  }, [token]));


  return (
    <React.Fragment>
      {isLoading &&
        <View style={styles.spinnerWrapper}>
          <ActivityIndicator size="large" color="#03bafc" />
        </View>
      }
      {!isLoading && orders.length === 0 &&
        <View style={styles.spinnerWrapper}>
          <Text>
            Currently there are no orders available
          </Text>
        </View>
      }
      {!isLoading && orders.length > 0 &&
        <ScrollView style={styles.container}>
          <FlatList
            style={{marginBottom: 10}}
            data={orders}
            keyExtractor={(order) => order._id}
            renderItem={({item}) => {
              return (
                <OrderCard order={item} />
              )
            }}
          />
        </ScrollView>
      }
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    // minHeight: "100%",
    flex: 1,
    padding: 10
  },
  spinnerWrapper: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
});

export default Orders;