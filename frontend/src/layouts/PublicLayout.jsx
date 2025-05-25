import NavbarPublic from "../components/NavbarPublic";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";


const PublicLayout = () => (
  <>
  <main className="relative min-h-screen overflow-x-hidden">
      <div className="absolute -top-28 -left-28 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-[80px] -z-10"></div>
      <div className="overflow-hidden">
    <NavbarPublic />
    <Outlet />
    <Footer id="contact" />
    </div>
    </main>
  </>
);

export default PublicLayout;
