import React from "react";
import {View, StyleSheet, Dimensions} from "react-native";
import {Content, Left, Body, ListItem, Thumbnail, Text} from "native-base";

const SearchResults = (props) => {
  const {items} = props;
  return (
    <Content style={{width: Dimensions.get("window").width}}>
      {items ?
        items.map(item => {
          return (
            <ListItem key={item._id.$oid} avatar>
              <Left>
                <Thumbnail
                  source={{uri: item.image ? item.image : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png"}}
                />
              </Left>
              <Body>
                <Text>{item.name}</Text>
                <Text note>{item.description}</Text>
              </Body>
            </ListItem>
          )
        })
        :
        <View>
          <Text style={{textAlign: "center"}}>
            No products found.
          </Text>
        </View>
      }
    </Content>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center"
  }
});

export default SearchResults;
