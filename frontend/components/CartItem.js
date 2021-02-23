import React, {useState} from "react";
import {StyleSheet} from "react-native";
import {Text, Left, Right, ListItem, Thumbnail, Body} from "native-base";

const CartItem = (props) => {
  // console.log("Item:", props.item)
  const {item} = props.item;
  const [quantity, setQuantity] = useState(item.quantity);

  if(!item) {
    return null
  }

  return (
    <ListItem
      style={styles.listItem}
      avatar
    >
      <Left style={{alignSelf: "center", marginBottom: 5}}>
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
    margin: 10,
    borderBottomColor: "transparent"
  },
});

export default CartItem;
