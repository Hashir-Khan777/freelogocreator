import React, { useEffect, useState } from "react";
import Textinput from "components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { sendPasswordResetEmail } from "firebase/auth";
import { database } from "firebasefolder/firebaseconfig";
import { toast } from "react-toastify";
import { Auth } from "store/actions/index.js";
import Button from "components/ui/Button";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const schema = yup
  .object({
    password: yup
      .string()
      .min(6, "Password must be at least 8 characters")
      .max(20, "Password shouldn't be more than 20 characters")
      .required("Please enter password"),
  })
  .required();
const ResetPasswordIn = () => {
  const { resetPass, loading } = useSelector((state) => state.authentication);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data, e) => {
    e.preventDefault();

    dispatch(Auth.resetPassword(data));
  };

  useEffect(() => {
    if (resetPass?.success) {
      navigate("/");
    }
  }, [resetPass]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <Textinput
        name="password"
        label="New Password"
        type="password"
        register={register}
        error={errors.email}
        className="h-[48px]"
      />

      <Button
        type="submit"
        text="Reset Password"
        className="btn btn-dark block w-full text-center bg-slate-900"
        isLoading={loading}
      />
    </form>
  );
};

export default ResetPasswordIn;
