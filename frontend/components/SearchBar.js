import React from "react";
import {Header, Item, Input, Icon} from "native-base";

const SearchBar = (props) => {
  const {onChangeHandler} = props;

  return (
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
          onChangeText={(text) => onChangeHandler(text)}
        />
      </Item>
    </Header>
  );
}

export default SearchBar;
