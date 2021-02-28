import React, {useState, useCallback} from "react";
import {View, Text, FlatList, Button, ActivityIndicator, StyleSheet, Dimensions} from "react-native";
import {useFocusEffect} from "@react-navigation/native";
import {useSelector} from "react-redux";
import axios from "axios";
import SearchBar from "../../components/SearchBar";
import ListItem from "./ListItem";

const Products = (props) => {
  const {navigate} = props.navigation;
  const {token} = useSelector((state) => state.auth);

  const [productsList, setProductsList] = useState([]);
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  /*------------------------*/
  // Consultar los productos
  /*------------------------*/
  useFocusEffect(useCallback(() => {
    if(token) {
      setIsLoading(true);
      axios({
        method: "GET",
        url: "/products"
      })
      .then(res => {
        const products = res.data.data;
        setProductsList(products);
        setIsLoading(false);
      })
      .catch(err => {
        let message = err.message;
        if(err.response) {
          message = err.response.data.msg;
        }
        setError(message);
        setIsLoading(false);
      })
    }

    return () => {
      setProductsList([]);
      setProductsFiltered([]);
      setIsLoading(true);
      setError(null);
    }

  }, [token]));


  /*----------------------------------------------*/
  // Filtrar los productos por término de búsqueda
  /*----------------------------------------------*/
  const searchResultsHandler = (term) => {
    if(!term.length) {
      setProductsFiltered(productsList)
    } else {
      const filtered = productsList.filter(item => item.product.name.toLowerCase().includes(term));
      setProductsFiltered(filtered)
    }
  }


  /*--------------------------------*/
  // Header de la lista de productos
  /*--------------------------------*/
  const ListHeader = () => {
    return (
      <View style={styles.listHeader}>
        <View style={{width: 55}}></View>
        <View style={styles.listHeaderItem}>
          <Text style={{fontWeight: "bold"}}>Brand</Text>
        </View>
        <View style={styles.listHeaderItem}>
          <Text style={{fontWeight: "bold"}}>Name</Text>
        </View>
        <View style={[styles.listHeaderItem, {marginLeft: -5}]}>
          <Text style={{fontWeight: "bold"}}>Category</Text>
        </View>
        <View style={[styles.listHeaderItem, {marginLeft: 10}]}>
          <Text style={{fontWeight: "bold"}}>Price</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={{marginBottom: 55}}>
      {/* Botones del header */}
      <View style={styles.headerBtnsWrapper}>
        <View style={styles.headerBtn}>
          <Button color="orange" title="Orders" onPress={() => navigate("Orders")} />
        </View>
        <View style={styles.headerBtn}>
          <Button
            color="orange"
            title="Products"
            onPress={() => navigate("Product Form", {edit: false, productId: null})}
          />
        </View>
        <View style={styles.headerBtn}>
          <Button color="orange" title="Categories" onPress={() => navigate("Categories")} />
        </View>
      </View>

      {/* Barra de búsqueda */}
      <View>
        <SearchBar onChangeHandler={searchResultsHandler} />
      </View>

      {/* Spinner */}
      {isLoading &&
        <View style={styles.spinnerWrapper}>
          <ActivityIndicator size="large" color="#03bafc" />
        </View>
      }

      {/* Lista de productos */}
      {!isLoading && productsList.length &&
        <FlatList
          style={{paddingHorizontal: 10}}
          data={productsFiltered.length ? productsFiltered : productsList}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={ListHeader}
          renderItem={({item, index}) => {
            return (
              <ListItem
                item={item}
                index={index}
                setProductsList={setProductsList}
              />
            )
          }}
        />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  headerBtnsWrapper: {
    width: Dimensions.get("screen").width,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 10
  },
  headerBtn: {
    minWidth: 100,
    borderRadius: 50,
    overflow: "hidden"
  },
  listHeader: {
    flexDirection: "row",
    padding: 5,
    backgroundColor: "gainsboro"
  },
  listHeaderItem: {
    width: Dimensions.get("screen").width/6,
    margin: 3,
  },
  spinnerWrapper: {
    height: Dimensions.get("screen").height/2,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default Products;
