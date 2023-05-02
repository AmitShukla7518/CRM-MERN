const express = require("express");
const conn = require("../../config/config");
var logger = require("../../config/winston");
const http_status = require("../../constants/http_status");
const Validation = require("../../utils/validation/validation");
const utils = require("../../utils/utils");

let getAllLob = async (req, res) => {
  try {
    let query = "  select value,label from tbl_LOB order by value, label asc;";
    conn.query(query, (err, result) => {
      if (err) throw err;
      res.status(http_status.OK).send(result);
    });
  } catch (error) {
    console.log(error);
  }
};

let getAllLocation  = async (req, res) => {
  try {
    let query = "  select value,label from tbl_location order by value, label asc;";
    conn.query(query, (err, result) => {
      if (err) throw err;
      res.status(http_status.OK).send(result);
    });
  } catch (error) {
    console.log(error);
  }
};


let getAllDegination  = async (req, res) => {
  try {
    let query = "  select value,label from tbl_Degination order by value, label asc;";
    conn.query(query, (err, result) => {
      if (err) throw err;
      res.status(http_status.OK).send(result);
    });
  } catch (error) {
    console.log(error);
  }
};


module.exports = {
  getAllLob,
  getAllLocation,
  getAllDegination
};
