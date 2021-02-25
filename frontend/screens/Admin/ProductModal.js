import React, {useState} from "react";
import {View, Modal, Button, TouchableHighlight, StyleSheet} from "react-native";
import {Icon, Toast} from "native-base";
import {useSelector, useDispatch} from "react-redux";
import axios from "axios";
import {userLogout} from "../../redux/actions/userActions";

const ProductModal = (props) => {
  const {navigate, isModalOpen, productId, setIsModalOpen, setProductsList} = props;
  const dispatch = useDispatch();
  const {token} = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  /*----------------------------------------*/
  // Eliminar el producto de la base de datos
  /*----------------------------------------*/
  const deleteProductHandler = async (id) => {
    setIsLoading(true);

    try {
      await axios({
        method: "DELETE",
        url: `/products/${id}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setProductsList((prev) => {
        let filtered = prev.filter(item => item._id !== id);
        return filtered;
      });

      setIsLoading(false);

      Toast.show({
        text: "Product deleted sucessfully",
        buttonText: "OK",
        buttonStyle: {alignSelf: "center"},
        position: "bottom",
        style: {minHeight: 80},
        type: "success",
        duration: 2500
      })
      
    }catch (error) {
      setIsLoading(false);
      let message = error.message;
      if(error.response) {
        message = error.response.data.msg;
      }

      Toast.show({
        text: message,
        buttonText: "OK",
        buttonStyle: {alignSelf: "center"},
        position: "bottom",
        style: {minHeight: 80},
        type: "danger",
        duration: 8000
      });

      // Cerrar sesión y redirigir a login si el token está expirado
      if(message.includes("expired token")) {
        setTimeout(() => {
          dispatch(userLogout());
        }, 5000);
      }
    }
  }

  return (
    <Modal
      animationType="fade"
      transparent
      presentationStyle="overFullScreen"
      visible={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
    >
      <View style={styles.centeredModalView}>
        <View style={styles.modalView}>
          <TouchableHighlight
            underlayColor="rgba(0,0,0,0.05)"
            onPress={() => setIsModalOpen(false)}
            disabled={isLoading}
            style={{
              position:"absolute", 
              top: 0, 
              right: 0, 
              alignSelf: "flex-end",
              padding: 8,
              borderRadius: 50
            }}
          >
            <Icon name="close" type="AntDesign" style={{fontSize: 30}} />
          </TouchableHighlight>

          <View style={{flexDirection: "row", paddingHorizontal: 20}}>          
            <View style={{width: 60, marginRight: 10}}>
              <Button
                title="Edit"
                color="#03bafc"
                disabled={isLoading}
                onPress={() => {
                  navigate("Product Form");
                  setIsModalOpen(false)
                }}
              />
            </View>
            <View style={{minWidth: 60}}>
              <Button
                title="Delete"
                color="red"
                disabled={isLoading}
                onPress={async () => {
                  await deleteProductHandler(productId);
                  setIsModalOpen(false);
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredModalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalView: {
    alignItems: "center",
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.8,
    elevation: 5,
    borderRadius: 20,
    backgroundColor: "white"
  }
});

export default ProductModal;
