import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";



const AppLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

export default AppLayout;
