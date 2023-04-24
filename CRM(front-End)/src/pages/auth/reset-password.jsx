import React from "react";
import { Link,useParams} from "react-router-dom";
import ForgotPass from "./common/forgot-pass";
import useDarkMode from "@/hooks/useDarkMode";
import ResetPass from "./common/reset-pass";
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/logo.svg";
import bgImage from "@/assets/images/all-img/login-bg.png";
const ForgotPass2 = () => {



  let params = useParams();
  let urldata = params.urlData;
  let isExpire = atob(urldata);
  isExpire = JSON.parse(isExpire);
  let currentTime = new Date();
  currentTime = currentTime.valueOf();
 
  const isExpired = isExpire.expiryIn <= currentTime;
  const [isDark] = useDarkMode();
  
  return (
    <div className="loginwrapper">
      <div className="lg-inner-column">
        <div className="right-column relative">
          <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
            <div className="auth-box2 flex flex-col justify-center h-full">
              <div className="mobile-logo text-center mb-6 lg:hidden block">
                <Link to="/">
                  <img
                    src={isDark ? LogoWhite : Logo}
                    alt=""
                    className="mx-auto"
                  />
                </Link>
              </div>
              <div className="text-center 2xl:mb-10 mb-5">
                <div className="text-slate-500 dark:text-slate-400 text-base">
                  Reset Password with Cogent.
                </div>
              </div>

              {isExpired ? (
                <><div className="text-center text-red-500 font-bold text-lg">
                  oops! page is expired</div><br></br><br></br><br></br>
                  <p className="text-center">Click <Link to="\login" style={{color:"blue"}}>here</Link> to Redirect Login Page</p></>
                
              ) : (
                <ResetPass />
              )}
            </div>
            {/* </div> */}
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
  );
};

export default ForgotPass2;
