import { Outlet } from "react-router-dom";

const AuthLayout = () => (
  <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500">
    <Outlet />
  </main>
);

export default AuthLayout;