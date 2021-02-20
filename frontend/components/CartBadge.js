import React from "react";
import {StyleSheet} from "react-native";
import {Badge, Text} from "native-base";
import {useSelector} from "react-redux";

const CartBadge = () => {
  const cartItems = useSelector((state) => state.cart.items);

  if(cartItems.length === 0) {
    return null;
  }

  return (
    <Badge style={styles.badge}>
      <Text style={styles.badgeText}>{cartItems.length}</Text>
    </Badge>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -10,
    right: -10,
    minWidth: 25,
    height: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    zIndex: 10
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold"
  }
})

export default CartBadge;
