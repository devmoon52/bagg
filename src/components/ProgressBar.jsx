import nProgress from "nprogress";
import { useEffect } from "react";

const ProgressBar = ({ children }) => {
  useEffect(() => {
    nProgress.done();

    return () => {
      nProgress.start();
    };
  }, []);

  return children;
};

export default ProgressBar;
