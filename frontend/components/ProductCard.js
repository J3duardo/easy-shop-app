import React from "react";
import {View, Text, Image, Button, StyleSheet, Dimensions} from "react-native";

const ProductCard = (props) => {
  const {name, price, image, countInStock} = props.item;

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
      {countInStock > 0 ?
        <View style={{width: "75%", marginTop: 10}}>
          <Button title="Add" color="green"  />
        </View>
        :
        <Text style={{marginTop: 20}}>Currently unavailable</Text>
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
