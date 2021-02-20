import React from "react";
import {View, Dimensions, StyleSheet, TouchableOpacity} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {Container, Text, Button, Left, Right, H1, ListItem, Thumbnail, Body} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome5";
import {useSelector, useDispatch} from "react-redux";
import {SwipeListView} from "react-native-swipe-list-view";
import {addToCart, removeFromCart, clearCart} from "../../redux/actions/cartActions";
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
              <Text style={styles.price}>${totalPrice}</Text>
            </View>
            <View style={{flexDirection: "row", flex: 1, justifyContent: "flex-end"}}>
              <Button transparent style={{marginRight: 4}} onPress={() => navigation.navigate("Checkout")}>
                <Text style={{color: "#03bafc"}}>Checkout</Text>
              </Button>
              <Button transparent onPress={() => dispatch(clearCart())}>
                <Text style={{color: "#03bafc"}}>Clear cart</Text>
              </Button>
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
            <Button style={{backgroundColor: "#03bafc"}} onPress={() => navigation.navigate("Home")}>
              <Text>Go to shop</Text>
            </Button>
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
    bottom: 0,
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
