import React, {useState, useEffect} from "react";
import {View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions} from "react-native";
import {Toast, Icon} from "native-base";
import {useSelector} from "react-redux";
import axios from "axios";
import TouchableCta from "../../components/TouchableCta";

const Categories = () => {
  const {token} = useSelector((state) => state.auth);

  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedItemId, setUpdatedItemId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedItemId, setDeletedItemId] = useState(null);


  /*-------------------------*/
  // Consultar las categorías
  /*-------------------------*/
  useEffect(() => {
    setIsLoading(true);
    axios({
      method: "GET",
      url: "/categories"
    })
    .then(res => {
      setCategories(() => {
        // Ordenar las categorías alfabéticamente
        return res.data.data.sort((a, b) => {
          if(a.name.split(" ")[0].toLowerCase() < b.name.split(" ")[0].toLowerCase()) {
            return -1;
          }
          if(a.name.split(" ")[0].toLowerCase() > b.name.split(" ")[0].toLowerCase()) {
            return 1;
          }
          return 0;
        })
      });
      setIsLoading(false);
    })
    .catch(err => {
      let message = err.message;
      if(err.response) {
        message = err.response.data.msg
      }

      Toast.show({
        text: message,
        buttonText: "OK",
        buttonStyle: {alignSelf: "center"},
        position: "bottom",
        style: {minHeight: 80},
        type: "danger",
        duration: 6000
      })
    })
  }, []);


  /*-------------------------------------*/
  // Togglear modo de edición de categoría
  /*-------------------------------------*/
  const updateCategoryHandler = (id) => {
    // Salir del modo edición si se vuelve a presionar el ícono de editar
    if(isUpdating) {
      setIsUpdating(false);
      setCategoryName("");
      return;
    }
    
    setIsUpdating(true);
    setUpdatedItemId(id);
    setCategoryName(() => {
      const name = categories.find(item => item._id === id).name;
      return name;
    });
  }


  /*-----------------------*/
  // Crear/editar categorías
  /*-----------------------*/
  const onSubmitHandler = async () => {
    try {
      setIsSubmitting(true);

      const res = await axios({
        method: isUpdating ? "PATCH" : "POST",
        url: isUpdating ? `/categories/${updatedItemId}` : "/categories",
        data: {name: categoryName},
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if(isUpdating) {
        setCategories(prev => {
          const updatedCategories = [...prev];
          const index = prev.findIndex(item => item._id === updatedItemId);
          updatedCategories.splice(index, 1, res.data.data);
          return updatedCategories;
        });
  
        setIsUpdating(false);
        setIsSubmitting(false);
        setUpdatedItemId(null);
        setCategoryName("");
        return;

      } else {
        setCategories(prev => {
          return [res.data.data, ...prev]
        });
        setCategoryName("");
        setIsSubmitting(false);
      }
      
    } catch (error) {
      setIsSubmitting(false);
      let message = err.message;
      if(err.response) {
        message = err.response.data.msg
      }

      Toast.show({
        text: message,
        buttonText: "OK",
        buttonStyle: {alignSelf: "center"},
        position: "bottom",
        style: {minHeight: 80},
        type: "danger",
        duration: 6000
      })
    }
  }


  /*-------------------*/
  // Eliminar categoría
  /*-------------------*/
  const deleteCategoryHandler = async (id) => {
    try {
      setIsDeleting(true);
      setDeletedItemId(id);

      await axios({
        method: "DELETE",
        url: `/categories/${id}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCategories(prev => {
        const filtered = prev.filter(item => item._id !== id);
        return filtered;
      });

      setIsDeleting(false);
      setDeletedItemId(null);
      
    } catch (error) {
      setIsDeleting(false);
      setDeletedItemId(null);

      let message = err.message;
      if(err.response) {
        message = err.response.data.msg
      }

      Toast.show({
        text: message,
        buttonText: "OK",
        buttonStyle: {alignSelf: "center"},
        position: "bottom",
        style: {minHeight: 80},
        type: "danger",
        duration: 6000
      })
    }
  }

  return (
    <View style={{position: "relative", flex: 1}}>
      {/* Spinner */}
      {isLoading &&
        <View style={styles.spinnerWrapper}>
          <ActivityIndicator size="large" color="#03bafc" />
        </View>
      }
      {!isLoading &&
        <React.Fragment>
          <View style={{marginBottom: 60}}>
            <FlatList
              data={categories}
              keyExtractor={(item) => item._id}
              renderItem={({item}) => {
                return (
                  <View
                    style={[
                      styles.categoryItem,
                      {opacity: isDeleting && deletedItemId === item._id ? 0.25 : 1},
                      {backgroundColor: isUpdating && updatedItemId === item._id ? "#bbebfc" : "white"}
                    ]}
                  >
                    <Text style={styles.categoryName}>{item.name}</Text>
                    <View style={styles.categoryBtnsWrapper}>
                      <TouchableOpacity
                        style={[styles.categoryBtn, {marginRight: 5}]}
                        onPress={() => updateCategoryHandler(item._id)}
                      >
                        <Icon style={{fontSize: 22, color: "#03bafc"}} name="edit" type="Entypo" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.categoryBtn} onPress={() => deleteCategoryHandler(item._id)}>
                        <Icon style={{fontSize: 22, color: "red"}} name="trash-alt" type="FontAwesome5" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              }}
            />
          </View>
          <View style={styles.bottomBar}>
            <View style={{flex: 1}}>
              <TextInput
                style={styles.input}
                value={categoryName}
                placeholder="Add category"
                onChangeText={(text) => setCategoryName(text)}
              />
            </View>
            <View style={{borderRadius: 2, overflow: "hidden"}}>
              <TouchableCta
                title="Submit"
                isLoading={isSubmitting}
                marginTop="none"
                onSubmitHandler={onSubmitHandler}
              />
            </View>
          </View>
        </React.Fragment>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  spinnerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  categoryItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: {width: 0, height: 0},
    elevation: 1
  },
  categoryName: {
    marginLeft: 5,
    fontSize: 16
  },
  categoryBtnsWrapper: {
    flexDirection: "row",
    alignItems: "center"
  },
  categoryBtn: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "rgba(0,0,0,0.02)"
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: Dimensions.get("screen").width,
    height: 60,
    padding: 5,
    backgroundColor: "white"
  },
  input: {
    height: 40,
    alignSelf: "stretch",
    marginRight: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 2
  }
});

export default Categories;
