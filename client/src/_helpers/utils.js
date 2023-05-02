import cookie from "js-cookie";

/**
 *
 * @param {*} cookieName
 * @param {*} value
 */
const setCookie = (cookieName, value) => {
  console.log(value);
  try {
    cookie.set(cookieName, value, {
      expires: 1,
      secure: false,
      sameSite: "strict",
      path: "/login",
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 *
 * @param {*} cookieName
 * @return cookie Value
 */
const getCookie = (cookieName) => {
  try {
    console.log(cookieName);
    return cookie.get(cookieName);
  } catch (error) {
    console.log(error);
  }
};

/**
 * @param {*} cookieName
 * @return  cookie Value
 */
const removeCookie = (cookieName) => {
  return cookie.remove(cookieName);
};

export const utils = {
  setCookie,
  getCookie,
  removeCookie,
};
