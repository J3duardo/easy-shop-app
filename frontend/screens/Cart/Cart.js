import React from "react";
import {View, Button, Dimensions, StyleSheet, TouchableOpacity} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {Container, Text, H1} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome5";
import {useSelector, useDispatch} from "react-redux";
import {SwipeListView} from "react-native-swipe-list-view";
import {removeFromCart, clearCart} from "../../redux/actions/cartActions";
import CartItem from "../../components/CartItem";

const Cart = () => {
  const navigation = useNavigation();
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  // console.log("Cart items:", cartItems);

  const itemsRender = () => {
    if(cartItems.length > 0) {
      // Calcular el precio total a pagar
      let totalPrice = null;
      cartItems.forEach(item => totalPrice = +(totalPrice + item.price).toFixed(2));

      return (
        <Container>
          <H1 style={{alignSelf: "center"}}>Cart</H1>
          <SwipeListView
            keyExtractor={(item) => item._id.$oid}
            data={cartItems}
            renderItem={(item) => {
              return <CartItem item={item} />
            }}
            renderHiddenItem={(item) => {
              return (
                <View style={styles.hiddenSwipeContainer}>
                  <TouchableOpacity
                    style={styles.hiddenSwipeBtn}
                    onPress={() => dispatch(removeFromCart(item.item._id.$oid))}
                  >
                    <Icon name="trash" color="white" size={24} />
                  </TouchableOpacity>
                </View>
              )
            }}
            disableRightSwipe={true}
            previewOpenDelay={3000}
            friction={1000}
            tension={40}
            leftOpenValue={75}
            stopLeftSwipe={75}
            rightOpenValue={-75}
          />
          <View style={styles.bottomContainer}>
            <View>
              <Text style={styles.price}>Total: ${totalPrice}</Text>
            </View>
            <View style={{flexDirection: "row", flex: 1, justifyContent: "flex-end"}}>
              <View style={{marginRight: 5}}>
                <Button title="Checkout" color="#03bafc" onPress={() => navigation.navigate("Checkout")} />
              </View>
              <Button title="Clear cart" color="#03bafc" onPress={() => dispatch(clearCart())} />
            </View>
          </View>
        </Container>
      )
    } else {
      return (
        <Container style={styles.emptyContainer}>
          <Text>Your cart is empty.</Text>
          <Text>Add products to your cart.</Text>
          <View style={{marginTop: 10}}>
            <Button
              title="Go to shop"
              color="#03bafc"
              onPress={() => navigation.navigate("Home")}
            />
          </View>
        </Container>
      )
    }
  }

  return (
    <React.Fragment>
      {itemsRender()}
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  bottomContainer: {
    position: "absolute",
    bottom: 5,
    left: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: Dimensions.get("window").width,
    paddingHorizontal: 10,
    backgroundColor: "white"
  },
  hiddenSwipeContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flex: 1
  },
  hiddenSwipeBtn: {
    width: 60,
    height: 60,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red"
  }
})

export default Cart;
