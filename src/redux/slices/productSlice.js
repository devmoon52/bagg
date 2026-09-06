import { createSlice } from "@reduxjs/toolkit";
import { products } from "../../data/products";
import { countryOptions } from "../../data/listData";
import { getHiddenNums } from "../../utils/services";

const checkOutReady = {
  subtotal: 0,
  toPurchase: [],
  ...countryOptions,
};

const initialState = {
  allProducts: products,
  cart: [],
  checkout: checkOutReady,
  purchaseHistory: {
    productIDs: [],
    history: [],
  },
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    update_products: (state, action) => {
      state.products = action.payload;
    },

    // cart
    update_cart: (state, action) => {
      const product = action.payload;

      const isAlreadyExisted = state.cart.some((p) => p.id === product.id);

      if (isAlreadyExisted) {
        state.cart = state.cart.filter((p) => p.id !== product.id);
      } else {
        state.cart.push(product);
      }
    },
    // cart reset
    raset_cart: (state, action) => {
      state.cart = [];
    },

    toggle_like: (state, action) => {
      const proID = action.payload;

      const product = state.allProducts.find((p) => p.id === proID);
      product.liked = !product.liked;
    },

    // subtotal + to-purchased update
    update_checkout: (state, action) => {
      state.checkout = action.payload;
    },
    // checkout reset
    raset_checkout: (state, action) => {
      state.checkout = {
        subtotal: 0,
        toPurchase: [],
        ...countryOptions,
      };
    },

    // make purchase history
    confirm_purchase: (state, action) => {
      const { products, history } = action.payload;

      history.cardNumber = getHiddenNums(history.cardNumber, {
        first: 2,
        last: 3,
      });
      history.cvc = getHiddenNums(history.cvc);
      history.purchaseTime = new Date().toISOString();

      state.purchaseHistory.history.push(history);
      state.purchaseHistory.productIDs = products;
    },
  },
});

export const {
  update_products,
  toggle_like,
  update_cart,
  update_checkout,
  remove_totalcharge,
  confirm_purchase,
  raset_checkout, // raset checkout
  raset_cart, // raset cart
} = productSlice.actions;
export default productSlice.reducer;
