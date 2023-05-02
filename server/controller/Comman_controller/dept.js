const express = require("express");
const conn = require("../../config/config");
var logger = require("../../config/winston");
const http_status = require("../../constants/http_status");
const Validation = require("../../utils/validation/validation");
const utils = require("../../utils/utils");

fs = require("fs");
const addDept = (req, res) => {
  if (!Validation.isValid(req.body.data)) {
    return res
      .status(http_status.BAD_REQUEST)
      .send({ status: false, msg: "Please Provide Data !!" });
  }
  let data = req.body.data;
  console.log(data);
  for (item of data.test) {
    if (!Validation.isValid(item.firstName)) {
      return res
        .status(http_status.BAD_REQUEST)
        .send({ status: false, msg: "Please Provide Full Name !!" });
    }
    console.log(item);
  }
};

module.exports = {
  addDept,
};
