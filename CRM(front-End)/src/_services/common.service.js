import axios from "axios";
import { utils } from "../_helpers/utils";

export const CommonService = { 
    httpPostService,
    httpPutService,
    httpGetService,
    httpDeleteService,
    httpFileUpload,
    httpPatchService,
    httpGetOkountService,
    httpAxiosFileUpload
 };
 

 function httpPostService(url,data) {
    const token = utils.getCookie("SYSTACC_ACCESS_TOKEN")

    const requestOptions = {
         method: 'POST',
         headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json', 
             'Authorization': token
         },
         body: JSON.stringify(data)
     };
 
     return fetch(`${process.env.BASE_URL}/api/v1/${url}`, requestOptions)
         .then(handleResponse)
         .then(data => {
             return data;
         });
 }
 
 function httpPutService(url, data) {
    const token = utils.getCookie("SYSTACC_ACCESS_TOKEN")
     const requestOptions = {
         method: 'PUT',
         headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json' ,
             'Authorization': token
         },
         body: JSON.stringify(data)
     };
 
     return fetch(`${process.env.BASE_URL}/api/v1/${url}`, requestOptions)
         .then(handleResponse)
         .then(data => {
             return data;
         });
 }  

 function httpGetService(url) {
    const token = utils.getCookie("SYSTACC_ACCESS_TOKEN")

     const requestOptions = {
         method: 'GET',
         headers: { 
            'Content-Type': 'application/json',
            'Authorization': token
        },
     }; 
    //  if (data) requestOptions['body'] = JSON.stringify(data)
     return fetch(`${process.env.BASE_URL}/api/v1/${url}`, requestOptions)
         .then(handleResponse)
         .then(user => {
             return user;
         });
 } 


 function httpDeleteService(url) {
    const token = utils.getCookie("SYSTACC_ACCESS_TOKEN")

     const requestOptions = {
         method: 'DELETE',
         headers: { 
            'Content-Type': 'application/json',
            'Authorization': token     
        },
     };
 
     return fetch(`${process.env.BASE_URL}/api/v1/${url}`, requestOptions)
         .then(handleResponse)
         .then(user => {
             return user;
         });
 }
 
 
 function httpFileUpload(url,data) {
     const requestOptions = {
         method: 'POST',
         excelFile: data
     };
     console.log(requestOptions)
     return fetch(`${process.env.BASE_URL}/api/v1/${url}`, requestOptions)
         .then(handleResponse)
         .then(user => {
             return user;
         });
 }
 
 function httpAxiosFileUpload(url,data) {
    const token = utils.getCookie("SYSTACC_ACCESS_TOKEN")
     return axios({
        method: "post",
        url: `${process.env.BASE_URL}/api/v1/${url}`,
        data: data,
        headers: { 
            "Content-Type": "multipart/form-data",
            'Authorization': token     
         },
      }).then((res) => {
          return res
      })    
 }

 
 function handleResponse(response) {
     return response.text().then(text => { 
         const data = text && JSON.parse(text);
         if (!response.ok) {
             const error = data.message;
             return Promise.reject(error);
         }
         return data;
         
     });
 }

 

 function httpPatchService(url, data) {
    const token = utils.getCookie("SYSTACC_ACCESS_TOKEN")

    const requestOptions = {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(data)
    };
    return fetch(`${process.env.BASE_URL}/api/v1/${url}`, requestOptions)
        .then(handleResponse)
        .then(data => {
            return data;
        });
}

function httpGetOkountService(url) {
    const token = utils.getCookie("SYSTACC_ACCESS_TOKEN")
     const requestOptions = {
         method: 'GET',
         headers: { 
            'Content-Type': 'application/json',
            'Authorization': token
        },
     };
 
     return fetch(`${process.env.BASE_OKOUNT_URL}/api/v1/${url}`, requestOptions)
         .then(handleResponse)
         .then(user => {
             return user;
         });
}
