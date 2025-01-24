import React, { useEffect, useState } from "react";
import Textinput from "components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "components/ui/Checkbox";
import Button from "components/ui/Button";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { useLoginMutation } from "store/api/auth/authApiSlice";
import { setUser } from "store/api/auth/authSlice";
import { toast } from "react-toastify";
import { loginUser } from "store/actions/auth";
const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup.string().required("Password is Required"),
  })
  .required();
const LoginForm = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { data, loading } = useSelector((state) => state.authentication);
  // const [login, { isLoading, isError, error, isSuccess }] = useLoginMutation();

  const dispatch = useDispatch();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    //
    mode: "all",
  });
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    // try {
    //   const response = await login(data);
    //   if (response.error) {
    //     throw new Error(response.error.message);
    //   }
    //   if (response.data.error) {
    //     throw new Error(response.data.error);
    //   }
    //   if (!response.data.token) {
    //     throw new Error("Invalid credentials");
    //   }
    //   dispatch(setUser(data));
    //   navigate("/dashboard");
    //   localStorage.setItem("user", JSON.stringify(response.data.user));
    //   toast.success("Login Successful");
    // } catch (error) {
    //   toast.error(error.message);
    // }
    dispatch(loginUser(data));
    // .catch((err)=>{
    //   toast.error(err.message);
    //   console.log(err.message)
    // })
    // data.preventDefault()
    // let userCredentials={
    //   email: data.email, password: data.password
    // }
    // dispatch(loginUserToolkit(userCredentials))
  };

  useEffect(() => {
    if (data?.token) {
      navigate("/dashboard");
    }
  }, [data]);

  useEffect(() => {
    if (localStorage.getItem("_user")) {
      navigate("/dashboard");
    }
  }, []);

  const [checked, setChecked] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <Textinput
        name="email"
        label="email"
        type="email"
        placeholder="Enter Your Email"
        register={register}
        error={errors.email}
        className="h-[48px]"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Textinput
        name="password"
        label="passwrod"
        type="password"
        placeholder="Enter Your Password"
        register={register}
        error={errors.password}
        className="h-[48px]"
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex justify-between">
        <Checkbox
          value={checked}
          onChange={() => setChecked(!checked)}
          label="Keep me signed in"
        />
        <Link
          to="/forgot-password"
          className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
        >
          Forgot Password?{" "}
        </Link>
      </div>

      <Button
        type="submit"
        text="Sign in"
        className="btn btn-dark block w-full text-center bg-slate-900"
        isLoading={loading}
      />
    </form>
  );
};

export default LoginForm;
