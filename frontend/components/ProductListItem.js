import React from "react";
import {View, TouchableOpacity, StyleSheet, Dimensions} from "react-native";
import ProductCard from "./ProductCard";

const ProductListItem = (props) => {
  const {item} = props;

  return (
    <TouchableOpacity style={styles.touchable}>
      <View style={styles.wrapper}>
        <ProductCard item={item}/>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    width: "50%",
  },
  wrapper: {
    width: Dimensions.get("window").width * 0.5,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    // backgroundColor: "gainsboro"
  }
});

export default ProductListItem;
