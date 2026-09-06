// throttle
export const throttle = (callback, delay) => {
  let lastRun = 0;

  return function (...args) {
    const now = Date.now();
    if (now - lastRun > delay) {
      callback.apply(this, args);
      lastRun = now;
    }
  };
};

// debounce
export const debounce = (callback, delay) => {
  let timer;

  function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  }

  debounced.cancel = () => {
    clearTimeout(timer);
  };

  return debounced;
};
