import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./common/login-form";
// import Social from "./common/social";
import { ToastContainer } from "react-toastify";
import useDarkMode from "@/hooks/useDarkMode";
// image import
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/logo.svg";
import bgImage from "@/assets/images/all-img/login-bg.png";

const login2 = () => {
  const [isDark] = useDarkMode();
  return (
    <>
      <ToastContainer />
      <div className="loginwrapper">
        <div className="lg-inner-column">
          <div className="right-column relative">
            <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
              <div className="auth-box h-full flex flex-col justify-center">
                <div className="mobile-logo text-center mb-6 lg:hidden block">
                  {/* <Link to="/">
                    <img
                      src={isDark ? LogoWhite : Logo}
                      alt=""
                      className="mx-auto"
                    />
                  </Link> */}
                </div>
                <div className="text-center 2xl:mb-10 mb-4">
                  <h4 className="font-medium">Sign in</h4>
                  <div className="text-slate-500 dark:text-slate-400 text-base">
                    Sign in to your account to start using Cogent
                  </div>
                </div>
                <LoginForm />
              </div>
              <div className="auth-footer text-center">
                Copyright 2021, Cogent All Rights Reserved.
              </div>
            </div>
          </div>
          <div
            className="left-column bg-cover bg-no-repeat bg-center "
            style={{
              backgroundImage: `url("https://cogenteservices.com/wp-content/uploads/2019/10/IMG_20190517_163724.jpg")`,
            }}
          >
            <div className="flex flex-col h-full justify-center">
              <div className="flex-1 flex flex-col justify-center items-center">
                <Link to="/"></Link>
              </div>
              <div>
                <div className="black-500-title max-w-[525px] mx-auto pb-20 text-center">
                  Walcome to{" "}
                  <span
                    className="text-white font-bold"
                    style={{ color: "orange" }}
                  >
                    {" "}
                    Cogent
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default login2;
