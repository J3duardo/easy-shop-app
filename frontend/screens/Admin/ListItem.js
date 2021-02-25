import React, {useState} from "react";
import {View, Text, Image, TouchableOpacity, TouchableHighlight, StyleSheet} from "react-native";
import {Icon} from "native-base";
import {useNavigation} from "@react-navigation/native";

const ListItem = (props) => {
  const {item} = props;
  const navigation = useNavigation();

  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate("Product Details", {item, routeName: "AdminPanel"})}>
        <Image
          resizeMode="contain"
          source={{uri: item.image ? item.image : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png"}}
        />
        <Text>{item.brand}</Text>
        <Text numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
        <Text numberOfLines={1} ellipsizeMode="tail">{item.category.name}</Text>
        <Text>${item.price}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({

});

export default ListItem;
