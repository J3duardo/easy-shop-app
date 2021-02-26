import React from "react";
import {View, Text, Button, Image, StyleSheet, ScrollView} from "react-native";
import {Left, Right, Container, H1} from "native-base";
import {useDispatch, useSelector} from "react-redux";
import {addToCart} from "../../redux/actions/cartActions";
import AvailabilityIndicator from "../../components/AvailabilityIndicator";

const ProductDetails = (props) => {
  const {navigate} = props.navigation;
  const {item} = props.route.params;
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  // Chequear si el producto ya fue agregado al carrito
  const isAdded = (id) => {
    return items.findIndex(item => item._id === id)
  }

  return (
    <Container style={styles.container}>
      <ScrollView>
        <View>
          <Image
            source={{
              uri: item.image ? item.image : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png"
            }}
            resizeMode="contain"
            style={styles.image}
          />
        </View>
        <View style={[styles.contentWrapper, {paddingBottom: 60}]}>
          <H1 style={styles.contentHeader}>{item.name}</H1>
          {/* <Text style={styles.contentText}>{item.brand}</Text> */}
          <AvailabilityIndicator item={item} />
          <Text style={{marginTop: 15}}>{item.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomWraper}>
        <Left>
          <Text style={styles.price}>${item.price}</Text>
        </Left>
        <Right>
          <View style={styles.bottomBtnWrapper}>
            <Button
              title={`${isAdded(item._id) !== -1 ? "Added" : "Add to cart"}`}
              disabled={isAdded(item._id) !== -1 || item.countInStock === 0}
              onPress={() => dispatch(addToCart(item))}
              color="#03bafc"
            />
          </View>
        </Right>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: "100%"
  },
  imageContainer: {
    padding: 0,
    margin: 0,
    backgroundColor: "white"
  },
  image: {
    width: "100%",
    height: 250,
    marginBottom: 10
  },
  contentWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10
  },
  contentHeader: {
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold"
  },
  contentText: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold"
  },
  bottomWraper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    padding: 10,
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    zIndex: 100
  },
  price: {
    fontSize: 24,
    color: "red"
  },
  bottomBtnWrapper: {
    minWidth: 110
  }
})

export default ProductDetails;
