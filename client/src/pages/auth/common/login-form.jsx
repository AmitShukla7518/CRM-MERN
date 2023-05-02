import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { utils } from "../../../_helpers/utils";
import { CommonService } from "../../../_services/common.service";

const schema = yup
  .object({
    email: yup.string().required("Email is Required"),
    password: yup.string().required("Password is Required"),
  })
  .required();
const LoginForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    let userId = data.email;
    let Pass = data.password;
    let result = await CommonService.httpPostService(`login`, { userId, Pass });
    result = await result.json();
    if (result.msg === "Success") {
      console.log("userStatus", result.data.ActiveStatus);
      toast.success("login successfully", {
        position: "top-right",
      });
      utils.setCookie("jwt_Token", result.JWT_Token);
      localStorage.setItem("jwt_Token", JSON.stringify(result.JWT_Token));
      localStorage.setItem("image", result.data.imgPath);
      localStorage.setItem("Name", result.data.fullname);
      localStorage.setItem("EmployeeID", result.data.userID);
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } else {
      toast.error("Invalid credentials", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const [checked, setChecked] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <Textinput
        name="email"
        label="email"
        type="text"
        register={register}
        error={errors.email}
      />
      <Textinput
        name="password"
        label="passwrod"
        type="password"
        register={register}
        error={errors.password}
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

      <button className="btn btn-dark block w-full text-center">Sign in</button>
    </form>
  );
};

export default LoginForm;
