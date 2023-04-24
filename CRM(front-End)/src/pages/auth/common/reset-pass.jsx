import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const schema = yup
  .object({
    newPass: yup.string().required("Password is Required"),
    cnfrmPass: yup
      .string()
      .required("confirm password is Required")
      .oneOf(
        [yup.ref("newPass"), null],
        "Confirm Password and Password muse be Same"
      ),
  })
  .required();
const ResetPass = () => {
  let params = useParams();
  let urldata = params.urlData;
  urldata = { data: urldata };
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
      data = Object.assign(data, urldata);
      let result = await fetch("http://127.0.0.1:2228/CRM/resetPass", {
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
        name="newPass"
        placeholder="Enter New Password"
        label="New Password"
        type="password"
        register={register}
        error={errors.newPass}
      />
      <Textinput
        name="cnfrmPass"
        placeholder="Enter Confirm Password"
        label="Confirm Password"
        type="password"
        register={register}
        error={errors.cnfrmPass}
      />

      <button
        className="btn btn-dark block w-full text-center"
        onClick={handleSubmit(onSubmit)}
      >
        Reset Password
      </button>
    </form>
  );
};

export default ResetPass;
