import {CART_ITEM_TYPES} from "../types";

const initialState = {
  items: []
}

const cartReducer = (state = initialState, action) => {
  switch(action.type) {
    case CART_ITEM_TYPES.ADD_TO_CART:
      return {...state, items: [...state.items, action.payload]}
    case CART_ITEM_TYPES.REMOVE_FROM_CART:
      const filteredItems = state.items.filter(item => item.product._id !== action.payload);
      return {...state, items: filteredItems}
    case CART_ITEM_TYPES.CLEAR_CART:
      return {...state, items: []}
    default:
      return state
  }
}

export default cartReducer;