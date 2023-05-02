import React, { Fragment, useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { Menu, Transition, Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CommonService } from "../../../../_services/common.service";

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
const profileLabel = () => {
  return (
    <div className="flex items-center">
      <div className="flex-1 ltr:mr-[10px] rtl:ml-[10px]">
        <div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full">
          <img
            src={`http://localhost:2228/public/logo/${localStorage.getItem(
              "image"
            )}`}
            alt=""
            className="block w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
      <div className="flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="overflow-hidden text-ellipsis whitespace-nowrap w-[85px] block">
          {localStorage.getItem("Name")}
        </span>
        <span className="text-base inline-block ltr:ml-[10px] rtl:mr-[10px]">
          <Icon icon="heroicons-outline:chevron-down"></Icon>
        </span>
      </div>
    </div>
  );
};

const Profile = (
  noFade,
  disableBackdrop,
  className = "max-w-xl",
  centered,
  scrollContent,
  themeClass = "bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700",
  title = "Logout"
) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ProfileMenu = [
    {
      label: "Profile",
      icon: "heroicons-outline:user",

      action: () => {
        // console.log("profile");
        navigate("/profile");
      },
    },
    {
      label: "Reset Password",
      icon: "heroicons-outline:cog",
      action: () => {
        setShowModal2(true);
      },
    },
    {
      label: "Logout",
      icon: "heroicons-outline:login",
      action: () => {
        setShowModal(true);
      },
    },
  ];
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(FormValadtionSchema),
  });

  // Modal Content
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const closeModal = () => {
    setShowModal(false);
    setShowModal2(false);
  };

  function showModalsPass() {
    setShowModal2(true);
  }

  const passUpdateHandler = async (data) => {
    try {
      let result = await CommonService.httpPutService(
        `changePass/${localStorage.getItem("EmployeeID")}`,
        data
      );
      if (result.status == 200) {
        result = await result.json();
        toast.success(`${result.msg}`, {
          position: "top-right",
        });
        setShowModal2(false);
      } else {
        result = await result.json();
        toast.error(`${result.msg}`, {
          position: "top-right",
        });
        setShowModal2(false);
      }
    } catch (error) {
      toast.error(`Something went wrong !!`, {
        position: "top-right",
      });
      console.log(error);
      setShowModal2(false);
    }
  };

  const logout = () => {
    // localStorage.clear();
    localStorage.removeItem("jwt_Token");
    localStorage.removeItem("Name");
    localStorage.removeItem("image");
    localStorage.removeItem("EmployeeID");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  return (
    <>
      <Dropdown label={profileLabel()} classMenuItems="w-[180px] top-[58px]">
        {ProfileMenu.map((item, index) => (
          <Menu.Item key={index}>
            {({ active }) => (
              <div
                onClick={() => item.action()}
                className={`${
                  active
                    ? "bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-300 dark:bg-opacity-50"
                    : "text-slate-600 dark:text-slate-300"
                } block     ${
                  item.hasDivider
                    ? "border-t border-slate-100 dark:border-slate-700"
                    : ""
                }`}
              >
                <div className={`block cursor-pointer px-4 py-2`}>
                  <div className="flex items-center">
                    <span className="block text-xl ltr:mr-3 rtl:ml-3">
                      <Icon icon={item.icon} />
                    </span>
                    <span className="block text-sm">{item.label}</span>
                  </div>
                </div>
              </div>
            )}
          </Menu.Item>
        ))}
      </Dropdown>
      {/* Logout Modal Start */}

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
                    style={{ backgroundColor: "#ed6262" }}
                  >
                    <h2 className="capitalize leading-6 tracking-wider font-medium text-base text-white">
                      {title}
                    </h2>
                    <button onClick={closeModal} className="text-[22px]">
                      <Icon icon="heroicons-outline:x" />
                    </button>
                  </div>
                  <div
                    className={`px-6 py-8 ${
                      scrollContent ? "overflow-y-auto max-h-[400px]" : ""
                    }`}
                  >
                    <h4 className="font-medium text-lg mb-3 text-slate-900">
                      Are You Sure Want to logout ?
                    </h4>
                  </div>
                  <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
                    {/* {footerContent} */}
                    <Button
                      text="Yes"
                      className="btn-danger"
                      onClick={logout}
                    />
                    <Button
                      text="No"
                      className="btn-success "
                      onClick={() => {
                        setShowModal(false);
                      }}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* change Password Modal */}
      <Transition appear show={showModal2} as={Fragment}>
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
                      Change Password
                    </h2>
                    <button onClick={closeModal} className="text-[22px]">
                      <Icon icon="heroicons-outline:x" />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit(passUpdateHandler)}>
                    <div
                      className={`px-6 py-8 ${
                        scrollContent ? "overflow-y-auto max-h-[400px]" : ""
                      }`}
                    >
                      <Textinput
                        label="Old Password"
                        name="oldPass"
                        type="Password"
                        register={register}
                        error={errors.oldPass}
                        msgTooltip
                      />
                      <Textinput
                        label="New Password"
                        name="newPass"
                        type="Password"
                        id="InvalidState"
                        register={register}
                        error={errors.newPass}
                        msgTooltip
                      />
                      <Textinput
                        label="Confirm Password"
                        name="cnfrmPass"
                        type="Password"
                        register={register}
                        error={errors.cnfrmPass}
                        msgTooltip
                      />
                    </div>
                    <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
                      {/* {footerContent} */}

                      {/* <Button text="Update" className="btn-success " /> */}
                      <button className="btn btn-dark  text-center">
                        Submit
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Profile;
