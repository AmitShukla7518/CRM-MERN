import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
  })
  .required();
const ForgotPass = () => {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    try {
      let result = await fetch("http://127.0.0.1:2228/CRM/forgotPass", {
        method: "post",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (result.status == 200) {
        result = await result.json();
        console.log(result.msg);
        toast.success(`${result.msg}`, {
          position: "top-right",
        });
        navigate("/login");
      } else {
        result = await result.json();
        toast.error(`${result.msg}`, {
          position: "top-right",
        });
        navigate("/login");
      }
    } catch (error) {
      navigate("/login");
      toast.error(`Something Want wrong !!`, {
        position: "top-right",
      });
      console.log(error);
    }
  };

  return (
    <form className="space-y-4 ">
      <Textinput
        name="email"
        label="email"
        type="email"
        register={register}
        error={errors.email}
      />
      

      <button
        className="btn btn-dark block w-full text-center"
        onClick={handleSubmit(onSubmit)}
      >
        Send recovery email
      </button>
    </form>
  );
};

export default ForgotPass;
