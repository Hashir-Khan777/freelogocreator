import React, { useEffect, useState } from "react";
import Textinput from "components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { sendPasswordResetEmail } from "firebase/auth";
import { database } from "firebasefolder/firebaseconfig";
import { toast } from "react-toastify";
import { Auth } from "store/actions/index.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "components/ui/Button";
import { useDispatch } from "react-redux";

const OtpScr = () => {
  const { verifyData, loading } = useSelector((state) => state.authentication);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const schema = yup
    .object({
      code: yup.string().required("Code is Required"),
    })
    .required();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const navigate = useNavigate();

  const onSubmit = async (data, e) => {
    e.preventDefault();

    dispatch(
      Auth.verifyEmail({
        ...data,
        resetPass: searchParams.get("resetPass") || false,
      })
    );

    reset();
  };

  useEffect(() => {
    if (verifyData?.resetPass) {
      navigate("/reset-pass");
    } else {
      if (verifyData?.token) {
        navigate("/dashboard");
      }
    }
  }, [verifyData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <Textinput
        name="code"
        placeholder="Otp"
        label="Enter Otp Code"
        type="number"
        register={register}
        error={errors.code}
        className="h-[48px]"
      />

      <Button
        type="submit"
        text="Verify Email"
        className="btn btn-dark block w-full text-center bg-slate-900"
        isLoading={loading}
      />
    </form>
  );
};

export default OtpScr;
