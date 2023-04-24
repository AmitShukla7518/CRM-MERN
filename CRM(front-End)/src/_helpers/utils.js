
// export const utils = { 
//     paramsToString,
//     setCookie,
//     getCookie,
//     removeCookie,
//     parseJWTToken,
//     isConsented,
//     isLogin
//  };
// var isConsented = getCookie('isConsented') ? getCookie('isConsented') : false

// function paramsToString(obj) {
//     var str = [];
//     for (var p in obj)
//       if (obj.hasOwnProperty(p)) {
//         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
//       }
//     return str.join("&");
// }

// function setCookie(cname, cvalue, exdays) {
//   const d = new Date();
//   d.setTime(d.getTime() + (exdays*24*60*60*1000));
//   let expires = "expires="+ d.toUTCString();
//   document.cookie= `${cname}=${cvalue};${expires};path=/;domain=${process.env.DOMAIN}`
// }

// function getCookie(cname) {
//   let name = cname + "=";
//   let decodedCookie = decodeURIComponent(document.cookie);
//   let ca = decodedCookie.split(';');
//   for(let i = 0; i <ca.length; i++) {
//     let c = ca[i];
//     while (c.charAt(0) == ' ') {
//       c = c.substring(1);
//     }
//     if (c.indexOf(name) == 0) {
//       return c.substring(name.length, c.length);
//     }
//   }
//   return "";
// }

// function removeCookie(name) {
//   setCookie(name, "", -1);
// }

// function parseJWTToken(token,secret = process.env.SECRET_JWT) {
//   try {
//     var base64Url = token.split('.')[1];
//     var base64 = base64Url.replace('-', '+').replace('_', '/');
//     return JSON.parse(window.atob(base64))
//   } catch (error) {
//     return null
//   }
// }

//  function isLogin() {
//   try {
//       if(getCookie('SYSTACC_ACCESS_TOKEN')){
//           let tokenData =  parseJWTToken(getCookie('SYSTACC_ACCESS_TOKEN'))
//           var current_time = new Date().getTime() / 1000;
//           if(tokenData && !(current_time > tokenData.exp)){
//            return true
//           }
//           return false
//        }else{
//         removeCookie('SYSTACC_ACCESS_TOKEN')
//         removeCookie('SYSTACC_USER_LOGIN_DATA')
//         removeCookie('SYSTACC_FINANCIAL_YEAR')
//        }
//        return false;
//   } catch (error) {
//       return false
//   }
// }


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
 * @return  cookie Value
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
  removeCookie
};