import React from "react";
import {View, Dimensions, StyleSheet} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {Container, Text, Button, Left, Right, H1, ListItem, Thumbnail, Body} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome5";
import {useSelector, useDispatch} from "react-redux";
import {addToCart, removeFromCart, clearCart} from "../../redux/actions/cartActions";

const Cart = () => {
  const navigation = useNavigation();
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  // console.log("Cart items:", cartItems);

  const itemsRender = () => {
    if(cartItems.length > 0) {
      // Calcular el precio total a pagar
      let totalPrice = null;
      cartItems.forEach(item => totalPrice = totalPrice + item.price);

      return (
        <Container>
          <H1 style={{alignSelf: "center"}}>Cart</H1>
          {cartItems.map(item => {
						return (
							<ListItem
                style={styles.listItem}
                key={item._id.$oid}
                avatar
							>
                <Left>
                  <Thumbnail
                    source={{uri: item.image ? item.image : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png"}}
                  />
                </Left>
                <Body style={styles.itemBody}>
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
  listItem: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  itemBody: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10
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
  }
})

export default Cart;
