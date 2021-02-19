import React,{useState, useEffect} from "react";
import {View, Text, Button, Image, StyleSheet, ScrollView} from "react-native";
import {Left, Right, Container, H1} from "native-base";

const ProductDetails = (props) => {
  const {item} = props.route.params;
  const [currentProduct, setCurrentProduct] = useState(item);
  const [isAvailable, setIsAvailable] = useState(null);

  useEffect(() => {

  }, [])

  return (
    <Container style={styles.container}>
      <ScrollView style={{padding: 8, marginBottom: 80}}>
        <View>
          <Image
            source={{
              uri: item.image ? item.image : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png"
            }}
            resizeMode="contain"
            style={styles.image}
          />
        </View>
      </ScrollView>
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
    height: 250
  }
})

export default ProductDetails;
