import React, {useState, useEffect} from "react";
import {View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions, Platform} from "react-native";
import {Item, Picker, Toast, Icon} from "native-base";
import * as ExpoImagePicker from "expo-image-picker";
import axios from "axios";
import {useSelector} from "react-redux";
import mime from "mime";
import Form from "../../components/form/Form";
import Input from "../../components/form/Input";
import TouchableCta from "../../components/TouchableCta";

const ProductForm = (props) => {
  const {navigate} = props.navigation;
  const {edit, productId} = props.route.params;
  const {token} = useSelector(state => state.auth);

  const [currentProduct, setCurrentProduct] = useState({});
  const [categories, setCategories] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [pickerValue, setPickerValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [productImage, setProductImage] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProducDescription] = useState("");
  const [productRichDescription, setProductRichDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productCountInStock, setProductCountInStock] = useState("");
  const [productRating, setProductRating] = useState("");
  const [productNumReviews, setProductNumReviews] = useState(0);
  const [productIsFeatured, setProductIsFeatured] = useState(false);


  /*------------------------------------------------------*/
  // Consultar el producto seleccionado en caso de edición
  /*------------------------------------------------------*/
  useEffect(() => {
    if(!edit) {
      setIsLoading(false);
    }

    if(edit && productId) {
      setIsLoading(true);
      axios({
        method: "GET",
        url: `/products/details/${productId}`
      })
      .then(res => {
        const {image, brand, name, price, description, richDescription, category, countInStock, rating, numReviews, isFeatured} = res.data.data;

        setCurrentProduct(res.data.data);
        setProductImage(image);
        setProductBrand(brand);
        setProductName(name);
        setProductPrice(price);
        setProducDescription(description);
        setProductRichDescription(richDescription);
        setProductCategory(category._id);
        setProductCountInStock(countInStock);
        setProductRating(rating);
        setProductNumReviews(numReviews);
        setProductIsFeatured(isFeatured);

        setIsLoading(false);
      })
      .catch(err => {
        let message = err.message;
        if(err.response) {
          message = err.response.data.msg;
        }

        Toast.show({
          text: message,
          buttonText: "OK",
          buttonStyle: {alignSelf: "center"},
          position: "bottom",
          style: {minHeight: 80},
          type: "danger",
          duration: 8000
        })
        
        setIsLoading(false);
      })
    }
  }, [edit, productId]);  


  /*------------------------------------*/
  // Consultar las categorías disponibles
  /*------------------------------------*/
  useEffect(() => {
    axios({
      method: "GET",
      url: "/categories"
    })
    .then(res => {
      setCategories(res.data.data);
    })
    .catch(err => {
      let message = err.message;
      if(err.response) {
        message = err.response.data.msg;
      }

      Toast.show({
        text: message,
        buttonText: "OK",
        buttonStyle: {alignSelf: "center"},
        position: "bottom",
        style: {minHeight: 80},
        type: "danger",
        duration: 8000
      })
    })
  }, []);


  /*------------------------------------------------*/
  // Seleccionar imagen del producto desde la galería
  /*------------------------------------------------*/
  const imagePickerGalleryHandler = async () => {
    if(Platform.OS !== "web") {
      try {
        await ExpoImagePicker.requestCameraPermissionsAsync();

        const result = await ExpoImagePicker.launchImageLibraryAsync({
          mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1
        });

        if(!result.cancelled) {
          setProductImage(result.uri)
        }
        
      } catch (error) {
        let message = error.message;
        if(error.message.includes("rejected permissions")) {
          message = "Sorry, the app requires storage permissions to select images from gallery"
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
  }


  /*------------------------------------------------*/
  // Seleccionar imagen del producto desde la cámara
  /*------------------------------------------------*/
  const imagePickerCameraHandler = async () => {
    if(Platform.OS !== "web") {
      try {
        await ExpoImagePicker.requestCameraPermissionsAsync();

        const result = await ExpoImagePicker.launchCameraAsync({
          mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1
        });

        if(!result.cancelled) {
          setProductImage(result.uri)
        }

      } catch (error) {
        let message = error.message;
        if(error.message.includes("rejected permissions")) {
          message = "Sorry, the app requires camera permissions to take pictures"
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
  }


  /*---------------------------------------*/
  // Enviar la data del producto al backend
  /*---------------------------------------*/
  const onSubmitHandler = async () => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Chequear si se actualizó la imagen del producto
      if(productImage.length > 0 && productImage !== currentProduct.image) {
        const imagePath = productImage.split("/");
        const imageName = `${Date.now()}-${imagePath[imagePath.length - 1]}`;
  
        formData.append("image", {
          uri: productImage,
          type: mime.getType(productImage),
          name: imageName
        });
      } else {
        formData.append("image", currentProduct.image)
      }

      formData.append("name", productName);
      formData.append("brand", productBrand);
      formData.append("price", productPrice);
      formData.append("rating", productRating);
      formData.append("description", productDescription);
      formData.append("richDescription", productRichDescription);
      formData.append("category", productCategory);
      formData.append("countInStock", productCountInStock);
      formData.append("numReviews", productNumReviews);
      formData.append("isFeatured", productIsFeatured);

      const res = await axios({
        method: edit ? "PATCH" : "POST",
        url: edit ? `/products/${currentProduct._id}` : "/products",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      
      setCurrentProduct(res.data.data);
      setIsSubmitting(false);

      Toast.show({
        text: `Product ${edit ? "updated" : "created"} successfully`,
        buttonText: "OK",
        buttonStyle: {alignSelf: "center"},
        position: "bottom",
        style: {minHeight: 80},
        type: "success",
        duration: 2500,
        onClose: () => navigate("Products")
      })
      
    } catch (err) {
      setIsSubmitting(false);

      let message = err.message;
      if(err.response) {
        message = err.response.data.msg;
      }

      Toast.show({
        text: message,
        buttonText: "OK",
        buttonStyle: {alignSelf: "center"},
        position: "bottom",
        style: {minHeight: 80},
        type: "danger",
        duration: 8000
      })
    }
  }
  

  return (
    <View>
      {/* Spinner */}
      {isLoading &&
        <View style={styles.spinnerWrapper}>
          <ActivityIndicator size="large" color="#03bafc" />
        </View>
      }
      {!isLoading &&
        <Form title={`${edit ? "Update product" : "Add new product"}`}>
          <View style={styles.imageWrapper}>
            <Image
              style={styles.image}
              source={{uri: productImage ? productImage : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png"}}
              resizeMode="contain"
            />
            <View style={styles.imagePickerWrapper}>
              <TouchableOpacity
                style={[styles.imagePickerIcon, {marginRight: 5}]}
                onPress={() => imagePickerGalleryHandler()}
              >
                <Icon style={{color: "white"}} name="images" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.imagePickerIcon}
                onPress={() => imagePickerCameraHandler()}
              >
                <Icon style={{color: "white"}} name="camera" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.label}>
            <Text>Brand</Text>
          </View>
          <Input
            name={productBrand}
            value={productBrand}
            placeholder="Brand"
            id="brand"
            onChangeHandler={setProductBrand}
            clearErrors={() => null}
            onFocusHandler={() => null}
            validationError={null}
          />

          <View style={styles.label}>
            <Text>Name</Text>
          </View>
          <Input
            name={productName}
            value={productName}
            placeholder="Name"
            id="name"
            onChangeHandler={setProductName}
            clearErrors={() => null}
            onFocusHandler={() => null}
            validationError={null}
          />

          <View style={styles.label}>
            <Text>Price</Text>
          </View>
          <Input
            name={productPrice}
            value={productPrice}
            placeholder="Price"
            id="price"
            onChangeHandler={setProductPrice}
            clearErrors={() => null}
            onFocusHandler={() => null}
            validationError={null}
            keyboardType="numeric"
          />

          <View style={styles.label}>
            <Text>Stock</Text>
          </View>
          <Input
            name={productCountInStock}
            value={productCountInStock}
            placeholder="Stock"
            id="stock"
            onChangeHandler={setProductCountInStock}
            clearErrors={() => null}
            onFocusHandler={() => null}
            validationError={null}
            keyboardType="numeric"
          />

          <View style={styles.label}>
            <Text>Description</Text>
          </View>
          <Input
            textarea
            name={productDescription}
            value={productDescription}
            placeholder="Description"
            id="description"
            onChangeHandler={setProducDescription}
            clearErrors={() => null}
            onFocusHandler={() => null}
            validationError={null}
          />

          <View style={styles.label}>
            <Text>Category</Text>
          </View>
          <Item picker style={{width: "85%"}}>
            <Picker
              mode="dropdown"
              iosIcon={<Icon color="#007aaf" name="arrow-down"/>}
              placeholder="Select product category"
              selectedValue={pickerValue || currentProduct.category._id}
              placeholderStyle={{color: "#007aaf"}}
              placeholderIconColor="#007aaf"
              onValueChange={(e) => {setPickerValue(e); setProductCategory(e)}}
            >
              {categories.map(item => {
                return (
                  <Picker.Item
                    key={item._id}
                    label={item.name}
                    value={item._id}
                  />
                )
              })}
            </Picker>
          </Item>
          
          <View style={{marginBottom: 15}}>
            <TouchableCta title="Submit" onSubmitHandler={onSubmitHandler} isLoading={isSubmitting} />
          </View>
        </Form>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  spinnerWrapper: {
    height: Dimensions.get("screen").height/2,
    justifyContent: "center",
    alignItems: "center"
  },
  imageWrapper: {
    width: 200,
    height: 200,
    justifyContent: "center",
    marginBottom: 15,
    padding: 0
  },
  image: {
    width: "100%",
    height: "100%"
  },
  imagePickerWrapper: {
    position: "absolute",
    right: 5,
    bottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  imagePickerIcon: {
    padding: 8,
    borderRadius: 100,
    backgroundColor: "#03bafc"
  },
  label: {
    // display: "none",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5
  }
});

export default ProductForm;