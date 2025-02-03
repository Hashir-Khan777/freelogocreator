import { Route, Routes } from "react-router-dom";
import {
  About,
  Contact,
  Filter,
  ForgetPassword,
  Home,
  Login,
  Logo,
  ResetPassword,
  SignUp,
  SVGCanvasEditor,
  Website,
} from "../Pages";

const AppRouter = () => {
  return (
    <Routes>
      <Route caseSensitive path="/" element={<Home />} />
      <Route caseSensitive path="/login" element={<Login />} />
      <Route caseSensitive path="/signup" element={<SignUp />} />
      <Route caseSensitive path="/about" element={<About />} />
      <Route caseSensitive path="/contact" element={<Contact />} />
      <Route caseSensitive path="/website" element={<Website />} />
      <Route caseSensitive path="/logo" element={<Logo />} />
      <Route
        caseSensitive
        path="/forgetpassword"
        element={<ForgetPassword />}
      />
      <Route caseSensitive path="/resetpassword" element={<ResetPassword />} />
      <Route caseSensitive path="/edit" element={<SVGCanvasEditor />} />
      <Route caseSensitive path="/filter/:category" element={<Filter />} />
    </Routes>
  );
};

export default AppRouter;
