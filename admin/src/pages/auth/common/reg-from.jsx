import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Textinput from "components/ui/Textinput";
import Button from "components/ui/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "components/ui/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import { Auth } from "store/actions/index.js";
import { SignupUser } from "firebasefolder/firebasemethod";

const schema = yup
  .object({
    name: yup.string().required("Name is Required"),
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup
      .string()
      .min(6, "Password must be at least 8 characters")
      .max(20, "Password shouldn't be more than 20 characters")
      .required("Please enter password"),
    // confirm password
  })
  .required();

const RegForm = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.authentication);

  // const [registerUser, { isLoading, isError, error, isSuccess }] =
  //   useRegisterUserMutation();

  const [checked, setChecked] = useState(false);
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

    let userCredentials = {
      name: data.name,
      email: data.email,
      gender: "male",
      password: data.password,
    };
    dispatch(Auth.registerUser(userCredentials));

    SignupUser(userCredentials)
  };

  useEffect(() => {
    if (data?.token) {
      navigate("/verify-email");
    }
  }, [data]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 ">
      <Textinput
        name="name"
        label="name"
        type="text"
        placeholder=" Enter your name"
        register={register}
        error={errors.name}
        className="h-[48px]"
      />{" "}
      <Textinput
        name="email"
        label="email"
        type="email"
        placeholder=" Enter your email"
        register={register}
        error={errors.email}
        className="h-[48px]"
      />
      <Textinput
        name="password"
        label="passwrod"
        type="password"
        placeholder=" Enter your password"
        register={register}
        error={errors.password}
        className="h-[48px]"
      />
      <Checkbox
        label="You accept our Terms and Conditions and Privacy Policy"
        value={checked}
        onChange={() => setChecked(!checked)}
      />
      <Button
        type="submit"
        text="Create an account"
        className="btn btn-dark block w-full text-center bg-slate-900"
        isLoading={loading}
      />
    </form>
  );
};

export default RegForm;
