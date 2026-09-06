// get discounted price
export const getDiscountedPrice = (price, discount) => {
  return +(price - (price / 100) * discount).toFixed(2);
};

export const getHiddenNums = (number = "", pattern) => {
  if (!number) return;

  if (!pattern || typeof pattern !== "object") {
    return "x".repeat(number.length);
  }

  let { first, last } = pattern;

  let firstSlice = number.slice(0, first);
  let lastSlice = number.slice(-last);
  let middleCount = number.length - (first + last);

  return firstSlice + "x".repeat(middleCount) + lastSlice;
};

export const getAvatarWord = (texts) => {
  if (!texts) return;

  const splited = texts.split(" ");

  if (splited.length > 1) {
    return splited[0][0] + splited[1][0];
  } else {
    return splited[0][0];
  }
};
