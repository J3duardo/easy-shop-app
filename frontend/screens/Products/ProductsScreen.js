import React, {useState, useEffect, useCallback} from "react";
import {View, FlatList, Text, Dimensions, ScrollView, ActivityIndicator} from "react-native";
import {Container, Header, Icon, Item, Input} from "native-base";
import {useFocusEffect} from "@react-navigation/native";
import axios from "axios";
import ProductListItem from "../../components/ProductListItem";
import SearchResults from "./SearchResults";
import CustomBanner from "../../components/CustomBanner";
import CategoryFilter from "./CategoryFilter";

const ProductsScreen = (props) => {
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState([]);
  const [active, setActive] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [term, setTerm] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  /*-------------------------------------*/
  // Función para consultar los productos
  /*-------------------------------------*/
  const getAllProducts = async () => {
    const res = await axios({
      method: "GET",
      url: "/products"
    });

    return res.data.data;
  }


  /*--------------------------------------*/
  // Función para consultar las categorías
  /*--------------------------------------*/
  const getAllCategories = async () => {
    const res = await axios({
      method: "GET",
      url: "/categories"
    });

    return res.data.data;
  }


  /*--------------------------*/
  // Consultar las categorías
  /*--------------------------*/
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);

      getAllCategories()
      .then((categories) => {
        setCategories(categories);
        setActiveCategoryId("all");
        setActive("All");
      })
      .catch(err => {
        console.log({"Async error": err.message})
        setIsLoading(false);
      });

      return () => {
        setAllProducts([]);
        setFilteredProducts(null);
        setCategories([]);
        setProductsByCategory([])
      };
    }, [])
  );


  /*------------------------------------*/
  // Consultar todos los productos
  // Filtrar los productos por categoría
  /*------------------------------------*/
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      setAllProducts([]);
      setProductsByCategory([]);
      
      if(activeCategoryId === "all") {
        getAllProducts()
        .then(allProducts => {
          setAllProducts(allProducts);
          setProductsByCategory(allProducts)
          setIsLoading(false);
        })
        .catch(err => {
          console.log({"Async Error": err.message});
          setIsLoading(false);
        });
        
      } else {
        axios({
          method: "GET",
          url: `/products/category/${activeCategoryId}`
        })
        .then(res => {
          setProductsByCategory(res.data.data);
          setIsLoading(false);
        })
        .catch(err => {
          console.log({"Async Error": err.message})
          setIsLoading(false);
        });
      }
    }, [activeCategoryId])
  );


  /*---------------------------------------------*/
  // Filtrar los productos por témino de búsqueda
  /*---------------------------------------------*/
  const searchProductsHandler = (searchTerm) => {
    setTerm(searchTerm);
    const filtered = productsByCategory.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if(filtered.length > 0) {
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(null);
    }
  }


  return (
    <Container>
      <Header
        style={{backgroundColor: "#03bafc"}}
        searchBar
        rounded
        androidStatusBarColor="#03bafc"
      >
        <Item>
          <Icon name="md-search-sharp" />
          <Input
            placeholder="Search"
            onChangeText={(text) => searchProductsHandler(text)}
          />
        </Item>
      </Header>
      {term ?
        <SearchResults items={filteredProducts} navigation={props.navigation} />
        :
        <ScrollView
          style={{width: Dimensions.get("window").width, flex: 1}}
          stickyHeaderIndices={[1]}
        >
          <View>
            <CustomBanner />
          </View>
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "lightgrey",
              borderBottomWidth: 1,
              borderBottomColor: "lightgrey"
            }}
          >
            <CategoryFilter
              categories={categories}
              productsByCategory={productsByCategory}
              setActiveCategoryId={setActiveCategoryId}
              active={active}
              setActive={setActive}
            />
          </View>
          {!isLoading && productsByCategory.length > 0 ?
            <View style={{marginBottom: 10}}>
              <FlatList
                numColumns={2}
                columnWrapperStyle={{justifyContent: "space-between"}}
                data={productsByCategory}
                keyExtractor={(el) => el._id}
                renderItem={({item}) => {
                  return (
                    <ProductListItem item={item} navigation={props.navigation} />
                  )
                }}
              />
            </View>
            :
            <View>
              {isLoading &&
                <ActivityIndicator
                  style={{marginTop: 100}}
                  animating={isLoading}
                  size="large"
                  color="black"
                />
              }
              {!isLoading && productsByCategory.length === 0 &&
                <Text style={{paddingVertical: 24, fontSize: 18, fontWeight: "bold", textAlign: "center"}}>
                  No products found for that category
                </Text>
              }
            </View>
          }
        </ScrollView>
      }
    </Container>
  );
}

export default ProductsScreen;
