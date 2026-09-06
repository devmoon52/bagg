import Header from "../components/sections/Header";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";

const Frame = ({ children }) => {
  return (
    <div>
      <ScrollToTop />
      <Header />

      {children ? children : <Outlet />}
    </div>
  );
};

export default Frame;