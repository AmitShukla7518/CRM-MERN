import React from "react";
import useDarkMode from "@/hooks/useDarkMode";
import { Link } from "react-router-dom";
import useWidth from "@/hooks/useWidth";

import MainLogo from "@/assets/images/logo/logo.svg";
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import MobileLogo from "@/assets/images/logo/logo-c.svg";
import MobileLogoWhite from "@/assets/images/logo/logo-c-white.svg";
const Logo = () => {
  const [isDark] = useDarkMode();
  const { width, breakpoints } = useWidth();

  return (
    <div>
      <Link to="/dashboard">
        {width >= breakpoints.xl ? (
          // <img src={isDark ? LogoWhite : "https://cogenteservices.com/wp-content/uploads/2020/01/logo-1.png"} alt="" style={{height:69,width:142}} />
          <img src={isDark ? "https://cogenteservices.com/wp-content/uploads/2020/01/logo-1.png" : "https://cogenteservices.com/wp-content/uploads/2020/01/logo-1.png"} alt="" style={{height:69,width:142}} />
        ) : (
          // <img src={isDark ? MobileLogoWhite : MobileLogo} alt="" />
          <img src="https://cogenteservices.com/wp-content/uploads/2019/08/banner-logo.png" alt="" style={{height:37,width:40}} />
        )}
      </Link>
    </div>
  );
};

export default Logo;
