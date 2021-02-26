import React from "react";
import {View, Text, Image, Button, StyleSheet, Dimensions} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {addToCart} from "../redux/actions/cartActions";

const ProductCard = (props) => {
  const {name, price, image, countInStock} = props.item;
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  /*--------------------------------------------*/
  // Chequear si el item ya fue agregado al cart
  /*--------------------------------------------*/
  const isAddedToCart = () => {
    return items.findIndex(item => JSON.stringify(item._id) === JSON.stringify(props.item._id)) > -1
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        resizeMode="contain"
        source={{uri: image ? image : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png"}}
      />
      <View style={styles.card} />
      <Text style={styles.title}>
        {name.length > 15 ? name.substring(0, 15 - 3) + "..." : name}
      </Text>
      <Text style={styles.price}>${price}</Text>
      {countInStock > 5 ?
        <View style={{width: "75%", marginTop: 10}}>
          <Button
            title={`${isAddedToCart() ? "Added": "Add"}`}
            color="#03bafc"
            disabled={isAddedToCart()}
            onPress={() => dispatch(addToCart(props.item))}
          />
        </View>
        : countInStock > 0 && countInStock <= 5 ?
        <Text style={{marginTop: 20, color: "black"}}>Only {countInStock} in stock!</Text>
        :
        <Text style={{marginTop: 20, color: "black"}}>Not available</Text>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width * 0.5 - 20,
    height: Dimensions.get("window").width / 1.7,
    marginTop: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
  },
  image: {
    position: "absolute",
    top: -45,
    width: Dimensions.get("window").width * 0.5 - 20 - 10,
    height: Dimensions.get("window").width * 0.5 - 20 - 30,
    backgroundColor: "transparent"
  },
  card: {
    marginBottom: 10,
    width: Dimensions.get("screen").width * 0.5 - 20 - 10,
    height: Dimensions.get("screen").width * 0.5 - 20 - 90,
    backgroundColor: "transparent"
  },
  title: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center"
  },
  price: {
    marginTop: 10,
    fontSize: 20,
    color: "orange"
  }
});

export default ProductCard;
