import React, {useState} from "react";
import {TouchableOpacity, StyleSheet} from "react-native";
import {View, Text, Left, Right, ListItem, Thumbnail, Body, Icon} from "native-base";

const CartItem = (props) => {
  const {product, quantity} = props.item;
  const {setItems} = props;

  const updateProductQuantity = (id, qty) => {
    setItems(prev => {
      let updated = [...prev];
      const index = updated.findIndex(el => el.product._id === id);
      updated[index].quantity = qty;
      return updated;
    })
  }

  if(!product) {
    return null
  }

  return (
    <ListItem
      style={styles.listItem}
      avatar
    >
      <Left style={{alignSelf: "center", marginBottom: 5}}>
        <Thumbnail
          source={{uri: product.image ? product.image : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png"}}
        />
      </Left>
      <Body style={styles.itemBody}>
        <Left>
          <Text>{product.name}</Text>
        </Left>
        <Right>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <Text style={{marginRight: 15}}>${product.price}</Text>
            <View>
              <TouchableOpacity
                style={{padding: 5}}
                onPress={() => updateProductQuantity(product._id, quantity + 1)}
              >
                <Icon type="Entypo" name="chevron-thin-up" />
              </TouchableOpacity>
              <Text style={{textAlign: "center"}}>{quantity}</Text>
              <TouchableOpacity
                style={{padding: 5}}
                onPress={() => {
                  let amount = quantity > 1 ? quantity - 1 : 1;
                  updateProductQuantity(product._id, amount)
                }}
              >
                <Icon type="Entypo" name="chevron-thin-down" />
              </TouchableOpacity>
            </View>
          </View>
        </Right>
      </Body>
    </ListItem>
  );
}

const styles = StyleSheet.create({
  listItem: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 0,
    backgroundColor: "white"
  },
  itemBody: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    borderBottomColor: "transparent"
  },
});

export default CartItem;
