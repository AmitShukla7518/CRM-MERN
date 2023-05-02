import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import Card from "@/components/ui/Card";
import { useForm} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Fileinput from "@/components/ui/Fileinput";
import {useNavigate } from "react-router-dom";
// import Select from "react-select";
import * as yup from "yup";
import Select, { components } from "react-select";
import { toast } from "react-toastify";
import { CommonService } from "../../../_services/common.service";
import SelectSimple from "@/components/ui/Select";

const FormValidationSchema = yup
  .object({
    fullname: yup.string().required(),
    // number: yup.number().required().positive(),
    email: yup
      .string()
      .email("Email is not valid")
      .required("Email is required"),
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(/^[0-9]{10}$/, "Phone number is not valid"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmpass: yup
      .string()
      .required("Confirm Password is required")
      .oneOf(
        [yup.ref("password"), null],
        "Confirm Password and Password muse be Same"
      ),
    address: yup.string().required(" location is required"),
    degination: yup.string().required(" Degination is required"),
  })
  .required();

const styles = {
  multiValue: (base, state) => {
    return state.data.isFixed ? { ...base, opacity: "0.5" } : base;
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, color: "#626262", paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: "none" } : base;
  },
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const FormAdd = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
  });

  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  let [ImageError, setImageErr] = useState(false);
  const [lobName, setlobName] = useState([]);
  let [lobNameList, setLobNameList] = useState([]);
  let [locationList, setlocationList] = useState([]);
  let [degination, setDeginationList] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    getLobList();
    getLobList();
    getLocationList();
    getDegination();
  }, []);

  // async function getLobList() {
  //   let result = await fetch("http://127.0.0.1:2228/CRM/getLOB", {
  //     headers: {
  //       authorization: JSON.parse(localStorage.getItem("jwt_Token")),
  //     },
  //   });
  //   result = await result.json();
  //   setLobNameList(result);
  // }
  async function getLobList() {
    let result = await CommonService.httpGetService("getLOB");
    setLobNameList(result);
  }
  async function getDegination() {
    let result = await CommonService.httpGetService("getAllDegination");
    setDeginationList(result);
  }
  async function getLocationList() {
    let result = await CommonService.httpGetService("getLocation");
    console.log(result);
    setlocationList(result);
  }

  const handleFileChange = (e) => {
    const image = e.target.files[0];
    if (!image.name.match(/\.(jpg|JPEG|png|gif)$/)) {
      setImageErr(true);
    } else {
      setSelectedFile(image);
      setImageErr(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      let LOb = [];
      for (let index = 0; index < lobName.length; index++) {
        LOb.push(lobName[index]);
      }
      LOb = LOb.toString();
      const Body = new FormData();
      Body.append("lob_Name", LOb);
      Body.append("full_name", data.fullname);
      Body.append("email", data.email);
      Body.append("phone", data.phone);
      Body.append("password", data.password);
      Body.append("confrm_pass", data.confirmpass);
      Body.append("des", data.degination);
      Body.append("location", selectedLocation.value);
      Body.append("address", data.address);
      Body.append("social_Media", "null");
      Body.append("logo_file", selectedFile);
      let result = await CommonService.httpAxiosFileUpload("clinet", Body);
      console.log("result", result);
      toast.success(`${result.data.msg}`, {
        position: "top-right",
      });
      navigate("/dashboard");
    } catch (err) {
      console.log("err", err.response.data.msg);
      toast.error(`${err.response.data.msg}`, {
        position: "top-right",
      });
    }
  };

  return (
    <div>
      <Card title="Add Client">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:grid-cols-2 grid gap-5 grid-cols-1 "
        >
          <Textinput
            label="Full Name*"
            type="text"
            placeholder="Type your User Name"
            name="fullname"
            register={register}
            error={errors.fullname}
          />
          <Textinput
            label="Email*"
            type="email"
            placeholder="Enter Email"
            name="email"
            register={register}
            error={errors.email}
          />
          <Textinput
            label="Phone*"
            type="text"
            placeholder="Enter Your Phone Number"
            name="phone"
            register={register}
            error={errors.phone}
          />

          <Textinput
            label="Degination*"
            type="text"
            placeholder="Enter Valid Degination"
            name="degination"
            register={register}
            error={errors.degination}
          />

          <Textinput
            label="Password*"
            type="password"
            placeholder="8+ characters, 1 capitat letter "
            name="password"
            error={errors.password}
            hasicon
            register={register}
          />
          <Textinput
            label="Confirm Password*"
            type="password"
            placeholder="Password"
            name="confirmpass"
            error={errors.confirmpass}
            register={register}
            hasicon
          />
          <label className="form-label" htmlFor="mul_1">
            LOB Name
          </label>
          <label className="form-label" htmlFor="mul_1">
            Location
          </label>
          <Select
            label="LOB Name "
            isClearable={false}
            styles={styles}
            isMulti
            value={lobNameList.filter((obj) => lobName.includes(obj.value))}
            name="lob_Name"
            options={lobNameList}
            className="react-select"
            classNamePrefix="select"
            id="mul_1"
            onChange={(e) => {
              setlobName(Array.isArray(e) ? e.map((x) => x.value) : []);
            }}
          />

          <Select
            placeholder="Select"
            isClearable={false}
            styles={styles}
            register={register}
            value={selectedLocation}
            name="location"
            options={locationList}
            className="react-select"
            classNamePrefix="select"
            id="mul_1"
            onChange={(e) => {
              setSelectedLocation(e);
            }}
          />
          <SelectSimple
            label="Degination"
            name="degination"
            register={register}
            options={degination}
          />
          <Textinput
            label="Address*"
            type="text"
            placeholder="Enter Location"
            name="address"
            error={errors.address}
            register={register}
          />
          <Fileinput
            name="logo_png"
            selectedFile={selectedFile}
            onChange={handleFileChange}
            placeholder="Upload Avtar"
          />
          {ImageError ? (
            <span style={{ color: "red" }}>
              Please Upload Valid Image Format
            </span>
          ) : (
            ""
          )}

          <div className="lg:col-span-2 col-span-1">
            <div className="ltr:text-right rtl:text-left">
              <button className="btn btn-dark  text-center">Submit</button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};
export default FormAdd;
