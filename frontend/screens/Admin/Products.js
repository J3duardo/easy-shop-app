import React, {useState, useCallback} from "react";
import {View, Text, FlatList, ActivityIndicator, StyleSheet} from "react-native";
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
  const [productsFilter, setProductsFilter] = useState("");
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
      setProductsFilter(null);
      setIsLoading(true);
      setError(null);
    }

  }, [token]));

  return (
    <View>
      <View>
        <SearchBar onChangeHandler={setProductsFilter} />
      </View>

      {isLoading &&
        <View style={{height: 200, justifyContent: "center", alignItems: "center"}}>
          <ActivityIndicator size="large" color="#03bafc" />
        </View>
      }

      {!isLoading && productsList.length &&
        <FlatList
          style={{paddingHorizontal: 10}}
          data={productsList}
          keyExtractor={(item) => item._id}
          renderItem={({item}) => {
            return (
              <ListItem item={item} />
            )
          }}
        />
      }
    </View>
  );
}

const styles = StyleSheet.create({});

export default Products;
