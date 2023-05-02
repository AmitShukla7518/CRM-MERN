import axios from "axios";
import { utils } from "../_helpers/utils";
let BASE_URL = "http://127.0.0.1:2228/CRM";

export const CommonService = {
  httpPostService,
  httpPutService,
  httpGetService,
  httpDeleteService,
  httpFileUpload,
  httpPatchService,
  httpAxiosFileUpload,
};

function httpPostService(url, data) {
  const token = JSON.parse(localStorage.getItem("jwt_Token"));

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  };

  return fetch(`${BASE_URL}/${url}`, requestOptions);
}

function httpPutService(url, data) {
  const token = JSON.parse(localStorage.getItem("jwt_Token"));
  const requestOptions = {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  };
  return fetch(`${BASE_URL}/${url}`, requestOptions);
}

function httpGetService(url) {
  const token = JSON.parse(localStorage.getItem("jwt_Token"));

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  };
  //  if (data) requestOptions['body'] = JSON.stringify(data)
  return fetch(`${BASE_URL}/${url}`, requestOptions)
    .then(handleResponse)
    .then((user) => {
      return user;
    });
}

function httpDeleteService(url) {
  const token = JSON.parse(localStorage.getItem("jwt_Token"));

  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  };
  return fetch(`${BASE_URL}/${url}`, requestOptions);
}

function httpFileUpload(url, data) {
  const requestOptions = {
    method: "POST",
    excelFile: data,
  };
  console.log(requestOptions);
  return fetch(`${BASE_URL}/${url}`, requestOptions)
    .then(handleResponse)
    .then((user) => {
      return user;
    });
}

function httpAxiosFileUpload(url, data) {
  const token = JSON.parse(localStorage.getItem("jwt_Token"));
  return axios({
    method: "post",
    url: `${BASE_URL}/${url}`,
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  }).then((res) => {
    return res;
  });
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      const error = data.message;
      return Promise.reject(error);
    }
    return data;
  });
}

function httpPatchService(url, data) {
  const token = JSON.parse(localStorage.getItem("jwt_Token"));
 const requestOptions = {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  };
  return fetch(`${BASE_URL}/${url}`, requestOptions)
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}
