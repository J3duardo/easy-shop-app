import React from "react";
import {ScrollView, TouchableOpacity, StyleSheet} from "react-native";
import {ListItem, Badge, Text} from "native-base";

const CategoryFilter = (props) => {
  // console.log("Categories:", props.categories)

  const categoryBadgeRender = (item) => {
    const {name, _id} = item;
    
    return (
      <TouchableOpacity
        key={_id}
        onPress={() => {
          props.setActiveCategoryId(_id);
          props.setActive(name);
        }}
      >
        <Badge
          style={[
            styles.center,
            props.active === name ? styles.active : styles.inactive,
            {marginRight: 10}
          ]}
        >
          <Text
            style={{marginHorizontal: 10, textTransform: "capitalize", color: "white"}}
          >
            {name}
          </Text>
        </Badge>
      </TouchableOpacity>
    )
  }

  return (
    <ScrollView
      bounces
      horizontal
      style={{backgroundColor: "#f2f2f2"}}
    >
      <ListItem
        style={{borderRadius: 0}}
      >
        {categoryBadgeRender({_id: "all", name: "All"})}
        {props.categories.map(category => categoryBadgeRender(category))}
      </ListItem>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  active: {backgroundColor: "#03bafc"},
  inactive: {backgroundColor: "#a0e1eb"}
});

export default CategoryFilter;
