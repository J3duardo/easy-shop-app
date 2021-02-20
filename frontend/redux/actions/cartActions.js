import {CART_ITEM_TYPES} from "../types";

export const addToCart = (item) => {
  return {
    type: CART_ITEM_TYPES.ADD_TO_CART,
    payload: item
  }
}

export const removeFromCart = (itemId) => {
  return {
    type: CART_ITEM_TYPES.REMOVE_FROM_CART,
    payload: itemId
  }
}

export const clearCart = () => {
  return {type: CART_ITEM_TYPES.CLEAR_CART}
}