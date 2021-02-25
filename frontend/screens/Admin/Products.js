import React, {useState, useCallback} from "react";
import {View, Text, FlatList, ActivityIndicator, StyleSheet, Dimensions} from "react-native";
import {Header, Item, Input, Icon} from "native-base";
import {useFocusEffect} from "@react-navigation/native";
import {useSelector, useDispatch} from "react-redux";
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
      const filtered = productsList.filter(item => item.name.toLowerCase().includes(term));
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
    <View>
      <View>
        <SearchBar onChangeHandler={searchResultsHandler} />
      </View>

      {isLoading &&
        <View style={styles.spinnerWrapper}>
          <ActivityIndicator size="large" color="#03bafc" />
        </View>
      }

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
