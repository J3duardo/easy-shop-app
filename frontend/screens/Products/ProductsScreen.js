import React, {useState, useEffect} from "react";
import {View, FlatList, Text, Dimensions, ScrollView} from "react-native";
import {Container, Header, Icon, Item, Input} from "native-base";
import ProductListItem from "../../components/ProductListItem";
import SearchResults from "./SearchResults";
import CustomBanner from "../../components/CustomBanner";
import productsData from "./testProducts.json";
import categoriesData from "./categories.json";
import CategoryFilter from "./CategoryFilter";

const ProductsScreen = (props) => {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState([]);
  const [active, setActive] = useState(null);
  const [term, setTerm] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);

  useEffect(() => {
    setProductsByCategory(productsData);
    setFilteredProducts(productsData);
    setCategories(categoriesData);
    setActive("All");

    return () => {
      // setProducts([]);
      setFilteredProducts(null);
      setCategories([]);
      setProductsByCategory([])
    };
  }, []);


  /*---------------------------------------------*/
  // Filtrar los productos por témino de búsqueda
  /*---------------------------------------------*/
  const searchProductsHandler = (searchTerm) => {
    setTerm(searchTerm);
    const filtered = productsData.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if(filtered.length > 0) {
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(null);
    }
  }

  /*------------------------------------*/
  // Filtrar los productos por categoría
  /*------------------------------------*/
  const categoryFilterHandler = (filter) => {
    console.log("Passed filter:", filter);
    if(filter === "5f15d5cdcb4a6642bddc0fe0" || !filter) {
      setProductsByCategory(productsData)
    } else {
      setProductsByCategory(() => productsData.filter(item => item.category.$oid === filter));
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
              categoryFilterHandler={categoryFilterHandler}
              active={active}
              setActive={setActive}
            />
          </View>
          {productsByCategory.length > 0 ?
            <View style={{marginBottom: 10}}>
              <FlatList
                numColumns={2}
                columnWrapperStyle={{justifyContent: "space-between"}}
                data={productsByCategory}
                keyExtractor={(el) => el._id.$oid}
                renderItem={({item}) => {
                  return (
                    <ProductListItem item={item} navigation={props.navigation} />
                  )
                }}
              />
            </View>
            :
            <Text style={{paddingVertical: 24, fontSize: 18, fontWeight: "bold", textAlign: "center"}}>
              No products found for that category
            </Text>
          }
        </ScrollView>
      }
    </Container>
  );
}

export default ProductsScreen;
