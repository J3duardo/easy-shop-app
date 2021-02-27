import React, {useState} from "react";
import {View, ScrollView, StyleSheet, Dimensions} from "react-native";
import {Text, ListItem, Thumbnail, Toast} from "native-base";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {clearCart} from "../../redux/actions/cartActions";
import TouchableCta from "../../components/TouchableCta";

const ConfirmPayment = (props) => {
  const order = props.route.params && props.route.params.order;
  const {token} = useSelector((state) => state.auth);
  const {navigate} = props.navigation;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  /*-----------------------------------*/
  // Enviar la orden a la base de datos
  /*-----------------------------------*/
  const confirmOrderHandler = async () => {
    setIsLoading(true);
    
    try {
      const res = await axios({
        method: "POST",
        url: "/orders",
        data: order,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      setIsLoading(false);

      console.log({orderData: res.data.data})

      Toast.show({
        text: "Your order was placed successfully",
        buttonText: "OK",
        buttonStyle: {alignSelf: "center"},
        position: "bottom",
        style: {minHeight: 80},
        type: "success",
        duration: 6000,
        onClose: () => {
          dispatch(clearCart());
          navigate("Cart");
        }
      })

    } catch (error) {
      setIsLoading(false);
      let message = error.message;
      if(error.response) {
        message = error.response.data.msg
      }

      Toast.show({
        text: message,
        buttonText: "OK",
        buttonStyle: {alignSelf: "center"},
        position: "bottom",
        style: {minHeight: 80},
        type: "danger",
        duration: 6000,
      })
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={{marginBottom: 10, fontSize: 20, fontWeight: "bold"}}>
          Confirm order
        </Text>
        {order &&
          <React.Fragment>
            <View style={{width: "85%", borderWidth: 1, borderColor: "#03bafc"}}>
              <Text style={styles.title}>Shipping to: </Text>

              <View style={{padding: 8}}>
                <Text>
                  <Text style={{fontWeight: "bold"}}>Address:</Text> {order.shippingAddress1}
                </Text>
                <Text>
                  <Text style={{fontWeight: "bold"}}>Address 2:</Text> {order.shippingAddress2}
                </Text>
                <Text>
                  <Text style={{fontWeight: "bold"}}>City:</Text> {order.city}
                </Text>
                <Text>
                  <Text style={{fontWeight: "bold"}}>Zip Code:</Text> {order.zip}
                </Text>
                <Text>
                  <Text style={{fontWeight: "bold"}}>Country:</Text> {order.country}
                </Text>
              </View>

              <Text style={styles.title}>Items</Text>

              {order.orderItems.map(item => {
                return (
                  <ListItem
                    style={styles.listItem}
                    key={item.product._id}
                  >
                    <View style={styles.thumbnailContainer}>
                      <Thumbnail source={{uri: item.product.image}} />
                    </View>
                    <View style={styles.body}>
                      <Text style={{flexShrink: 1, marginRight: 10}}>{item.product.name}</Text>
                      <Text style={{flexShrink: 0, textAlign: "right"}}>${item.product.price}</Text>
                    </View>
                  </ListItem>
                )
              })}
            </View>

            {/* Enviar la orden */}
            <TouchableCta title="Place order" isLoading={isLoading} onSubmitHandler={confirmOrderHandler} />
          </React.Fragment>
        }
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: Dimensions.get("window").height,
    padding: 10,
    alignItems: "center",
    backgroundColor: "white"
  },
  content: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    margin: 8,
    paddingBottom: 5,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginLeft: 0,
    backgroundColor: "white"
  },
  body: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 5,
  },
  thumbnailContainer: {
    marginRight: 10,
    padding: 4,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: "rgba(0,0,0,0.2)",
    backgroundColor: "rgba(0,0,0,0.1)"
  }
})

export default ConfirmPayment;
