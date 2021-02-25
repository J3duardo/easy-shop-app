import React, {useState, useEffect, useCallback} from "react";
import {View, Text, ScrollView, StyleSheet} from "react-native";
import {Container, Toast} from "native-base";
import {useFocusEffect} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useSelector, useDispatch} from "react-redux";
import {userLogout} from "../../redux/actions/userActions";
import {clearCart} from "../../redux/actions/cartActions";
import TouchableCta from "../../components/TouchableCta";

const UserProfile = (props) => {
  const dispatch = useDispatch();
  const {navigate} = props.navigation;
  const {user, token} = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if(!token) {
      navigate("Login");
      Toast.show({
        text: "You need to be logged in to access this page",
        duration: 3000,
        buttonText: "OK",
        position: "bottom",
        buttonStyle: {alignSelf: "center"},
        style: {minHeight: 80},
        type: "danger"
      })
    }
  }, [user, token]);


  const logoutHandler = async () => {
    setIsLoading(true);
    dispatch(clearCart());
    await dispatch(userLogout());
    setIsLoading(false);
    navigate("Login");
  }
  

  return (
    <Container style={styles.container}>
      <ScrollView contentContainerStyle={styles.subContainer}>
        <Text style={{fontSize: 30}}>
          {user && user.name}
        </Text>
        <View style={{marginTop: 20}}>
          <Text style={{marginTop: 10}}>
            Email: {user && user.email}
          </Text>
          <Text style={{marginTop: 10}}>
            Phone: {user && user.phone}
          </Text>
        </View>
        <View style={{marginTop: 80}}>
          <TouchableCta title="Logout" onSubmitHandler={logoutHandler} isLoading={isLoading} />
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 15
  },
  subContainer: {
    alignItems: "center"
  }
})

export default UserProfile;