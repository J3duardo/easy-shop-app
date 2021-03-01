import React, {useState, useEffect, useCallback} from "react";
import {View, Text, ScrollView, FlatList, ActivityIndicator, StyleSheet} from "react-native";
import {Container, Toast} from "native-base";
import {useFocusEffect} from "@react-navigation/native";
import {useSelector, useDispatch} from "react-redux";
import axios from "axios";
import {userLogout} from "../../redux/actions/userActions";
import {clearCart} from "../../redux/actions/cartActions";
import TouchableCta from "../../components/TouchableCta";
import OrderCard from "../../components/OrderCard";

const UserProfile = (props) => {
  const dispatch = useDispatch();
  const {navigate} = props.navigation;
  const {user, token} = useSelector((state) => state.auth);

  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
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


  /*--------------------------------*/
  // Consultar las órdenes del usuario
  /*--------------------------------*/
  useFocusEffect(useCallback(() => {
    setLoadingOrders(true);
    axios({
      method: "GET",
      url: `/orders/user/${user._id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setLoadingOrders(false);
      setUserOrders(res.data.data);
    })
    .catch(err => {
      let message = err.message;
      if(err.response) {
        message = err.response.data.msg;
      }
      
      setLoadingOrders(false);
      Toast.show({
        text: message,
        duration: 5000,
        buttonText: "OK",
        position: "bottom",
        buttonStyle: {alignSelf: "center"},
        style: {minHeight: 80},
        type: "danger"
      })
    });

    return () => {
      setUserOrders([]);
      setIsLoading(false);
      setLoadingOrders(true);
    };

  }, [user, token]));


  /*--------------*/
  // Cerrar sesión
  /*--------------*/
  const logoutHandler = async () => {
    setIsLoading(true);
    dispatch(clearCart());
    await dispatch(userLogout());
    setIsLoading(false);
    navigate("Login");
  }
  

  return (
    <React.Fragment>
      {loadingOrders &&
        <View style={styles.spinnerWrapper}>
          <ActivityIndicator size="large" color="#03bafc" />
        </View>
      }

      {!loadingOrders &&
        <Container style={styles.container}>
          <View style={styles.subContainer}>
            <Text style={{fontSize: 30}}>
              {user && user.name}
            </Text>
            <View>
              <Text style={{marginTop: 10}}>
                Email: {user && user.email}
              </Text>
              <Text style={{marginTop: 10}}>
                Phone: {user && user.phone}
              </Text>
              <Text style={{marginTop: 10}}>
                Account type: {user && user.isAdmin ? "Admin" : "User"}
              </Text>
            </View>
            <View>
              <TouchableCta title="Logout" onSubmitHandler={logoutHandler} isLoading={isLoading} />
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.ordersContainer}>
            <View>
              <Text style={{marginBottom: 5, fontSize: 24}}>My orders</Text>
            </View>
            <FlatList
              data={userOrders}
              keyExtractor={(order) => order._id}
              renderItem={({item}) => {
                return (
                  <OrderCard order={item} routeName="UserProfile" />
                )
              }}
            />
          </ScrollView>
        </Container>
      }
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10
  },
  subContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 15,
    borderBottomColor: "#a0e1eb",
    borderBottomWidth: 1
  },
  ordersContainer: {
    alignItems: "center",
    paddingTop: 10,
  },
  spinnerWrapper: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  }
})

export default UserProfile;