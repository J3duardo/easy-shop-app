import React, {useState} from "react";
import {View, Text, Image, TouchableOpacity, StyleSheet, Dimensions} from "react-native";
import {useNavigation} from "@react-navigation/native";
import ProductModal from "./ProductModal";

const ListItem = (props) => {
  const {item, index, setProductsList} = props;
  const navigation = useNavigation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <View>
      {/* Modal para editar/eliminar el producto */}
      <ProductModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        navigate={navigation.navigate}
        productId={item._id}
        setProductsList={setProductsList}
      />

      {/* Producto */}
      <TouchableOpacity
        style={[
          styles.container,
          {backgroundColor: index % 2 === 0 ? "white" : "gainsboro"}
        ]}
        onPress={() => navigation.navigate("Details", {item, routeName: "AdminPanel"})}
        onLongPress={() => setIsModalOpen(true)}
      >
        <Image
          style={styles.image}
          resizeMode="contain"
          source={{uri: item.image ? item.image : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png"}}
        />
        <Text style={styles.item}>{item.brand}</Text>
        <Text style={styles.item} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
        <Text style={styles.item} numberOfLines={1} ellipsizeMode="tail">{item.category.name}</Text>
        <Text style={styles.item}>${item.price}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: Dimensions.get("screen").width,
    padding: 10,
  },
  image: {
    borderRadius: 50,
    width: 40,
    height: 40,
    marginRight: 10
  },
  item: {
    flexWrap: "wrap",
    width: Dimensions.get("screen").width/6,
    margin: 3
  }
});

export default ListItem;
