import React from "react";
import {View, Text, TouchableOpacity, StyleSheet, ActivityIndicator} from "react-native";

const TouchableCta = (props) => {
  const {title, onSubmitHandler, isLoading} = props;

  return (
    <View style={styles.cta}>
      <TouchableOpacity style={styles.touchable} disabled={isLoading} onPress={onSubmitHandler}>
        {!isLoading &&
          <Text style={{textTransform: "uppercase", fontSize: 14, color: "white"}}>
            {title}
          </Text>
        }
        {isLoading && <ActivityIndicator color="white" animating={isLoading} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cta: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15
  },
  touchable: {
    width: 120,
    height: 40,
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#03bafc"
  }
});

export default TouchableCta;
