import { Route, Routes } from "react-router-dom";
import {
  Filter,
  ForgetPassword,
  Home,
  Login,
  ResetPassword,
  SignUp,
  SVGCanvasEditor,
} from "../Pages";

const AppRouter = () => {
  return (
    <Routes>
      <Route caseSensitive path="/" element={<Home />} />
      <Route caseSensitive path="/login" element={<Login />} />
      <Route caseSensitive path="/signup" element={<SignUp />} />
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
