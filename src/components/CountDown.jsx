import { useEffect, useRef, useState } from "react";
import { formatTime, getTwoDigit } from "../utils/time";

const CountDown = ({ time }) => {
  const [remainingTime, setRemainingTime] = useState(time);

  useEffect(() => {
    setRemainingTime(time);
  }, [time]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev > 0) {
          return prev - 1;
        }
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [time]);

  const { h, m, s } = formatTime(remainingTime);

  return (
    <>
      <p>
        {getTwoDigit(h)}:{getTwoDigit(m)}:{getTwoDigit(s)}
      </p>
    </>
  );
};

export default CountDown;
