import { Route, Routes } from "react-router-dom";
import { ForgetPassword, Home, Login, ResetPassword, SignUp } from "../Pages";

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
    </Routes>
  );
};

export default AppRouter;
