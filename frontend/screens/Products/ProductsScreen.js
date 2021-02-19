import React, {useState, useEffect} from "react";
import {View, FlatList, Dimensions, ScrollView} from "react-native";
import {Container, Header, Icon, Item, Input} from "native-base";
import ProductListItem from "../../components/ProductListItem";
import productsData from "./testProducts.json";
import SearchResults from "./SearchResults";
import CustomBanner from "../../components/CustomBanner";

const ProductsScreen = () => {
  const [products, setProducts] = useState(null);
  const [term, setTerm] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);

  useEffect(() => {
    setProducts(productsData);
    setFilteredProducts(productsData);
    return () => {
      setProducts([]);
      setFilteredProducts(null);
    };
  }, []);

  const searchProductsHandler = (searchTerm) => {
    setTerm(searchTerm);
    const filtered = productsData.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if(filtered.length > 0) {
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(null);
    }
  }

  console.log("Filtered results:", filteredProducts ? filteredProducts.length : 0)

  return (
    <Container>
      <Header searchBar rounded androidStatusBarColor="green">
        <Item>
          <Icon name="md-search-sharp" />
          <Input
            placeholder="Buscar"
            onChangeText={(text) => searchProductsHandler(text)}
          />
        </Item>
      </Header>
      {term ?
        <SearchResults items={filteredProducts} />
        :
        <View style={{width: Dimensions.get("window").width, flex: 1}}>
          <View>
            <CustomBanner />
          </View>
          <ScrollView>
            <View>
              <FlatList
                numColumns={2}
                columnWrapperStyle={{justifyContent: "space-between"}}
                data={products}
                keyExtractor={(el) => el.name}
                renderItem={({item}) => {
                  return (
                    <ProductListItem item={item}/>
                  )
                }}
              />
            </View>
          </ScrollView>
        </View>
      }
    </Container>
  );
}

export default ProductsScreen;
