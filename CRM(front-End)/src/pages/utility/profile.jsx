import React, { useState, Fragment, useMemo, useEffect } from "react";
import { Link, json } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import BasicArea from "./appex-chart/BasicArea";
import { toast } from "react-toastify";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/components/ui/Button";
import { Dialog, Transition } from "@headlessui/react";
import User_default from "@/assets/images/all-img/User_default.jpg";
import Fileinput from "@/components/ui/Fileinput";

// Password Validation

const FormValadtionSchema = yup.object({
  oldPass: yup
    .string()
    .required("Old Password is required")
    .min(8, "Password must be at least 8 characters long"),
  newPass: yup
    .string()
    .required("New Password is required")
    .min(8, "Password must be at least 8 characters long"),
  cnfrmPass: yup
    .string()
    .required("Confirm Password is required")
    .oneOf(
      [yup.ref("newPass"), null],
      "Confirm Password  and New Password can't Same"
    ),
});

const FormValadtionSchemaProfile = yup.object({
  name: yup
    .string()
    .required("Name required")
    .min(3, "Name must be at least 3 characters"),
  phone: yup
    .string()
    .required("Phone is required")
    .min(10, "Phone must be at least 10 characters long")
    .max(12, "Phone less than 12 digits"),
  email: yup.string().email("Email is not valid").required("Email is required"),
});

const profile = (
  noFade,
  disableBackdrop,
  className = "max-w-xl",
  centered,
  scrollContent,
  themeClass = "bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700",
  title = "Update Profile"
) => {
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  let [EmployeeID, setEmployeeID] = useState("");
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [phone, setPhone] = useState("");
  let [location, setLocation] = useState("");
  let [logo, setLogo] = useState("");
  let [designation, setDesignation] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // For Update Profile Action
  const {
    register: register1,
    formState: { errors: errorsProfile },
    handleSubmit: handleProfileSubmit,
  } = useForm({
    resolver: yupResolver(FormValadtionSchemaProfile),
  });

  const handleFileChange = async (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  function showModals() {
    setShowModal(true);
  }

  const GetEmpDetails = async (EmployeeID) => {
    let result = await fetch(
      `http://127.0.0.1:2228/CRM/getDataByID/${localStorage.getItem(
        "EmployeeID"
      )}`,
      {
        headers: {
          authorization: JSON.parse(localStorage.getItem("jwt_Token")),
        },
      }
    );
    result = await result.json();
    setEmployeeID(result.data[0].userID);
    setPhone(result.data[0].phone);
    setName(result.data[0].fullname);
    setLocation(result.data[0].Location);
    setEmail(result.data[0].Email);
    setDesignation(result.data[0].designation);
    setLogo(result.data[0].imgPath);
    // setShowModal(true);
  };

  useEffect(() => {
    GetEmpDetails();
  }, []);

  // Update Profile
  async function profileUpdateHandler(data) {
    // data = Object.assign({ logo_file: selectedFile }, data);
    try {
      const Body = new FormData();
      Body.append("name", data.name);
      Body.append("email", data.email);
      Body.append("phone", data.phone);
      Body.append("logo_file", selectedFile);
      let result = await fetch(
        `http://127.0.0.1:2228/CRM/updateProfile/${data.EmployeeID}`,
        {
          method: "PUT",
          body: Body,
          headers: {
            authorization: JSON.parse(localStorage.getItem("jwt_Token")),
          },
        }
      );
      setShowModal(false);
      console.log("result", result.status);
      if (result.status == 200) {
        result = await result.json();
        toast.success(`${result.msg}`, {
          position: "top-right",
        });
        GetEmpDetails();
        if (result.ImgPath != undefined || result.ImgPath == "") {
          localStorage.setItem("image", result.ImgPath);
        }
      } else {
        result = await result.json();
        toast.error(`${result.msg}`, {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error(`Something went wrong !!`, {
        position: "top-right",
      });
      console.log(error);
      setShowModal(false);
    }
  }

  return (
    <div>
      <div className="space-y-5 profile-page">
        <div className="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
          <div className="bg-slate-900 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"></div>
          <div className="profile-box flex-none md:text-start text-center">
            <div className="md:flex items-end md:space-x-6 rtl:space-x-reverse">
              <div className="flex-none">
                <div className="md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 ring-slate-100 relative">
                  <img
                    src={`http://localhost:2228/public/logo/${logo}`}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                  <button
                    className="absolute right-2 h-8 w-8 bg-slate-50 text-slate-600 rounded-full shadow-sm flex flex-col items-center justify-center md:top-[140px] top-[100px]"
                    onClick={showModals}
                  >
                    <Icon icon="heroicons:pencil-square" />
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
                  {name}
                </div>
                <div className="text-sm font-light text-slate-600 dark:text-slate-400">
                  {designation}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-info-500 md:flex md:text-start text-center flex-1 max-w-[516px] md:space-y-0 space-y-4">
            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                $32,400
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Total Balance
              </div>
            </div>

            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                200
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Board Card
              </div>
            </div>

            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                3200
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Calender Events
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="lg:col-span-4 col-span-12">
            <Card title="Info">
              <ul className="list space-y-8">
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:envelope" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      EmployeeID
                    </div>
                    <a
                      href="mailto:someone@example.com"
                      className="text-base text-slate-600 dark:text-slate-50"
                    >
                      {EmployeeID}
                    </a>
                  </div>
                </li>
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:envelope" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      EMAIL
                    </div>
                    <a
                      href="mailto:someone@example.com"
                      className="text-base text-slate-600 dark:text-slate-50"
                    >
                      {email}
                    </a>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:phone-arrow-up-right" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      PHONE
                    </div>
                    <a
                      href="tel:0189749676767"
                      className="text-base text-slate-600 dark:text-slate-50"
                    >
                      {phone}
                    </a>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:map" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      LOCATION
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {location}
                    </div>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
          <div className="lg:col-span-8 col-span-12">
            <Card title="User Overview">
              <BasicArea height={190} />
            </Card>
          </div>
        </div>
      </div>
      {/* Update Profile Modal */}
      <Transition appear show={showModal} as={Fragment}>
        <Dialog as="div" className="relative z-[99999]" onClose={closeModal}>
          {/* {!disableBackdrop && ( */}
          <Transition.Child
            as={Fragment}
            enter={noFade ? "" : "duration-300 ease-out"}
            enterFrom={noFade ? "" : "opacity-0"}
            enterTo={noFade ? "" : "opacity-100"}
            leave={noFade ? "" : "duration-200 ease-in"}
            leaveFrom={noFade ? "" : "opacity-100"}
            leaveTo={noFade ? "" : "opacity-0"}
          >
            <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
          </Transition.Child>
          {/* )} */}

          <div className="fixed inset-0 overflow-y-auto">
            <div
              className={`flex min-h-full justify-center text-center p-6 ${
                centered ? "items-center" : "items-start "
              }`}
            >
              <Transition.Child
                as={Fragment}
                enter={noFade ? "" : "duration-300  ease-out"}
                enterFrom={noFade ? "" : "opacity-0 scale-95"}
                enterTo={noFade ? "" : "opacity-100 scale-100"}
                leave={noFade ? "" : "duration-200 ease-in"}
                leaveFrom={noFade ? "" : "opacity-100 scale-100"}
                leaveTo={noFade ? "" : "opacity-0 scale-95"}
              >
                <Dialog.Panel
                  className={`w-full transform overflow-hidden rounded-md
           bg-white dark:bg-slate-800 text-left align-middle shadow-xl transition-alll ${className}`}
                >
                  <div
                    className={`relative overflow-hidden py-4 px-5 text-white flex justify-between  ${themeClass}`}
                  >
                    <h2 className="capitalize leading-6 tracking-wider font-medium text-base text-white">
                      {title}
                    </h2>
                    <button onClick={closeModal} className="text-[22px]">
                      <Icon icon="heroicons-outline:x" />
                    </button>
                  </div>
                  <form>
                    <div
                      className={`px-6 py-8 ${
                        scrollContent ? "overflow-y-auto max-h-[400px]" : ""
                      }`}
                    >
                      <Textinput
                        label="EmployeeID"
                        name="EmployeeID"
                        defaultValue={EmployeeID}
                        type="text"
                        register={register1}
                        placeholder="Enter Your Name"
                        readonly
                      />
                      <Textinput
                        label="Name"
                        name="name"
                        defaultValue={name}
                        id="InvalidState"
                        type="text"
                        placeholder="Enter Your Name"
                        register={register1}
                        error={errorsProfile.name}
                        msgTooltip
                      />
                      {/* <Textinput
                        label="Old Password"
                        name="oldPass"
                        type="Password"
                        register={register}
                        error={errors.oldPass}
                        msgTooltip
                      /> */}
                      <Textinput
                        label="Phone"
                        type="text"
                        name="phone"
                        defaultValue={`${phone}`}
                        placeholder="Enter Your Phone"
                        register={register1}
                        error={errorsProfile.phone}
                        msgTooltip
                      />
                      <Textinput
                        label="Email"
                        type="Email"
                        name="email"
                        defaultValue={email}
                        placeholder="Enter Your Name"
                        register={register1}
                        error={errorsProfile.email}
                        msgTooltip
                      />
                      <label className="form-label" htmlFor="mul_1">
                        Avtar
                      </label>
                      <Fileinput
                        name="basic"
                        badge
                        selectedFile={selectedFile}
                        onChange={handleFileChange}
                      />
                    </div>
                  </form>
                  <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
                    {/* {footerContent} */}

                    <button
                      className="btn btn-dark  text-center"
                      onClick={handleProfileSubmit(profileUpdateHandler)}
                    >
                      Submit
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default profile;
