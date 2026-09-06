export const formatTime = (totalSeconds) => {
  let h = Math.floor(totalSeconds / 3600);
  let m = Math.floor((totalSeconds % 3600) / 60);
  let s = totalSeconds % 60;

  return {
    h,
    m,
    s,
  };
};

export const getTwoDigit = (number) => {
  return number.toString().padStart(2, "00");
};
