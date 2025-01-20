import React, { useEffect, Suspense } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loading from "components/Loading";
import { verifyUser } from "store/actions/auth";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
const AuthLayout = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <ToastContainer />
        {<Outlet />}
      </Suspense>
    </>
  );
};

export default AuthLayout;
