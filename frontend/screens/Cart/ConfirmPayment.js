import React, {useState} from "react";
import {View, ScrollView, StyleSheet, Dimensions, ActivityIndicator} from "react-native";
import {Text, Left, Right, ListItem, Thumbnail, Body} from "native-base";
import {useDispatch} from "react-redux";
import {clearCart} from "../../redux/actions/cartActions";
import { TouchableOpacity } from "react-native-gesture-handler";

const ConfirmPayment = (props) => {
  const order = props.route.params && props.route.params.order;
  const {navigate} = props.navigation;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const confirmOrderHandler = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(clearCart());
      navigate("Cart")
    }, 1500);
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
                    key={item.name}
                  >
                    <Left>
                      <Thumbnail source={{uri: item.image}} />
                    </Left>
                    <Body style={styles.body}>
                      <Left>
                        <Text>{item.name}</Text>
                      </Left>
                      <Right>
                        <Text>${item.price}</Text>
                      </Right>
                    </Body>
                  </ListItem>
                )
              })}
            </View>

            <View style={styles.cta}>
              <TouchableOpacity disabled={isLoading} onPress={confirmOrderHandler}>
                {!isLoading &&
                  <Text style={{textTransform: "uppercase", fontSize: 14, color: "white"}}>
                    Place order
                  </Text>
                }
              </TouchableOpacity>
              {isLoading && <ActivityIndicator color="white" animating={isLoading} />}
            </View>
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    marginLeft: 0,
    backgroundColor: "white"
  },
  body: {
    flexDirection: "row",
    alignItems: "center"
  },
  cta: {
    width: 120,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#03bafc"
  }
})

export default ConfirmPayment;
