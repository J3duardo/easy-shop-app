import React, {useState, useEffect} from "react";
import {View, Text, StyleSheet} from "react-native";

const AvailabilityIndicator = (props) => {
  const {item} = props;
  const [status, setStatus] = useState(null);
  const [color, setColor] = useState(null);

  useEffect(() => {
    if(item.countInStock > 5) {
      setColor("#afec1a");
      setStatus("Available");
    } else if (item.countInStock > 0 && item.countInStock <= 5) {
      setColor("orange");
        setStatus(`Only ${item.countInStock} in stock`);
    } else {
      setColor("#ec241a");
      setStatus("Not available");
    }

    return () => {
      setStatus(null);
      setColor(null);
    }
  }, [item]);

  return (
    <View
      style={{...styles.container, backgroundColor: `${color}`}}
    >
      <Text style={{color: "white"}}>
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 10,
    paddingHorizontal: 10,
    paddingVertical: 15
  }
});

export default AvailabilityIndicator;
