import React, {useState} from "react";
import {View, Button} from "react-native";
import {Container, Header, Content, ListItem, Text, Radio, Right, Left, Picker, Icon, Body, Title} from "native-base";

const methods = [
  {name: "Cash on Delivery", value: 1},
  {name: "Bank Transfer", value: 2},
  {name: "Card Payment", value: 3}
];

const paymentCards = [
  {name: "Wallet", value: 1},
  {name: "Visa", value: 2},
  {name: "Master Card", value: 3},
  {name: "Other", value: 4},
]

const Payment = (props) => {
  const order = props.route.params && props.route.params.order;
  const {navigate} = props.navigation;
  const [selectedMethod, setSelectedMethod] = useState(1);
  const [paymentCard, setPaymentCard] = useState(null);

  if(!order) {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20}}>
        <Text style={{textAlign: "center"}}>
          You haven't completed the order!
        </Text>
        <Text style={{marginBottom: 15, textAlign: "center"}}>
          Please, go back to Shipping and complete the order form.
        </Text>
        <Button
          title="Go back to shipping"
          color="#03bafc"
          onPress={() => navigate("Checkout")}
        />
      </View>
    );
  }

  return (
    <Container style={{marginTop: 1}}>
      <Header
        style={{backgroundColor: "#03bafc"}}
        androidStatusBarColor="#03bafc"
      >
        <Body>
          <Title>Choose your payment method</Title>
        </Body>
      </Header>
      <Content>
        {methods.map(item => {
          return (
            <ListItem key={item.value} onPress={() => setSelectedMethod(item.value)}>
              <Left>
                <Text>
                  {item.name}
                </Text>
              </Left>
              <Right>
                <Radio selectedColor="#03bafc" color="#999" selected={selectedMethod === item.value}/>
              </Right>
            </ListItem>
          )
        })}
        {selectedMethod === 3 &&
          <Picker
            style={{marginHorizontal: 10}}
            mode="dropdown"
            iosIcon={() => <Icon name="arrow-down" color="#007aaf" />}
            headerStyle={{backgroundColor: "orange"}}
            headerBackButtonTextStyle={{color: "#fff"}}
            headerTitleStyle={{color: "#fff"}}
            selectedValue={paymentCard}
            onValueChange={(x) => setPaymentCard(x)}
          >
            {paymentCards.map(item => {
              return <Picker.Item key={item.value} label={item.name} value={item.name} />
            })}
          </Picker>
        }
        <View style={{marginTop: 10, alignSelf: "center"}}>
          <Button title="Confirm payment" color="#03bafc" onPress={() => navigate("Confirm", {order})} />
        </View>
      </Content>
    </Container>
  );
}

export default Payment;
