import { createSelector } from "@reduxjs/toolkit";

const selectProducts = (state) => state.products.allProducts;

export const productSelector = createSelector([selectProducts], (products) => {
  const calculated = {
    types: {},
    categories: {},
    flashSales: [],
    wishlist: [],
    total: products,
  };

  for (const product of products) {
    // type-wise distribute
    if (!calculated.types[product.type]) {
      calculated.types[product.type] = [];
    }

    // category-wise distribute
    if (!calculated.categories[product.category]) {
      calculated.categories[product.category] = [];
    }

    calculated.types[product.type].push(product); //type
    calculated.categories[product.category].push(product); //category

    // flash sales - distribution
    if (product.flash.isFlash) {
      calculated.flashSales.push(product);
    }

    // wishlist distribution
    if (product.liked) {
      calculated.wishlist.push(product);
    }
  }

  return calculated;
});
