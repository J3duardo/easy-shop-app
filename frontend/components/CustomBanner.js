import React, {useEffect, useState} from "react";
import {View, Image, StyleSheet, Dimensions, ScrollView} from "react-native";
import Swiper from "react-native-swiper";

const {width} = Dimensions.get("window");

const CustomBanner = () => {
  const [bannerData, setBannerData] = useState([]);

  useEffect(() => {
    setBannerData([
      "https://images.vexels.com/media/users/3/126443/preview2/ff9af1e1edfa2c4a46c43b0c2040ce52-macbook-pro-touch-bar-banner.jpg",
      "https://pbs.twimg.com/media/D7P_yLdX4AAvJWO.jpg",
      "https://www.yardproduct.com/blog/wp-content/uploads/2016/01/gardening-banner.jpg"
    ]);

    return () => setBannerData([]);
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.swiper}>
          <Swiper
            style={{height: 130}}
            containerStyle={{flexDirection: "row", alignItems: "center", marginTop: 10, padding: 0}}
            showsPagination={false}
            showsButtons={true}
            autoplay
            autoplayTimeout={4}
          >
            {bannerData.map((item, i) => {
              return (
                <View key={i} style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                  <Image
                    key={i}
                    style={styles.imageBanner}
                    resizeMode="contain"
                    source={{uri: item}}
                  />
                </View>
              )
            })}
          </Swiper>
          <View style={{height: 20}}></View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gainsboro"
  },
  swiper: {
    width: width,
    alignItems: "center",
    marginTop: 10
  },
  imageBanner: {
    height: width/2,
    width: width - 40,
    marginHorizontal: 20, 
    borderRadius: 10
  }
});

export default CustomBanner;
