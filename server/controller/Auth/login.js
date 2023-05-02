const express = require("express");
const conn = require("../../config/config");
var logger = require("../../config/winston");
const http_status = require("../../constants/http_status");
const Validation = require("../../utils/validation/validation");
const utils = require("../../utils/utils");
var nodemailer = require("nodemailer");

const login = async (req, res, next) => {
  try {
    console.log(req.body.userId);
    if (!Validation.isValid(req.body.userId)) {
      return res.status(http_status.BAD_REQUEST).send({
        status: false,
        message: "Please provide Valid UserId or Email 🛑",
      });
    }
    if (!Validation.isValid(req.body.Pass)) {
      return res
        .status(http_status.BAD_REQUEST)
        .send({ status: false, message: "Please provide Password 🛑" });
    }
    let query = `select * from users where email = '${req.body.userId}' or userId ='${req.body.userId}' limit 1;`;
    conn.query(query, async (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        let passwordMatch = await utils.comparePwd(
          req.body.Pass,
          result[0].Password
        );
        if (!passwordMatch)
          return res
            .status(http_status.BAD_REQUEST)
            .send({ message: "Invalid username or password 🛑" });
        console.log(result[0].ActiveStatus[0]);
        if (result[0].ActiveStatus[0] != true)
          return res
            .status(http_status.BAD_REQUEST)
            .send({ message: "invalid username or password Status🛑" });
        let jwtToken = await utils.generateJWTToken(
          result[0],
          process.env.SECRET,
          process.env.tokenLife
        );
        res
          .status(http_status.OK)
          .send({ JWT_Token: jwtToken, msg: "Success", data: result[0] });
      } else {
        res
          .status(http_status.BAD_REQUEST)
          .send({ status: false, message: "Invalid Credentials 🛑" });
      }
    });
  } catch (error) {
    res.status(http_status.BAD_REQUEST).send({ msg: "something went wrong" });
    console.log(error);
  }
};

const frgtPWDEmail = async (req, res, next) => {
  try {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.AuthEmail,
        pass: process.env.AuthPass,
      },
    });

    if (!Validation.isValid(req.body.email)) {
      return res.status(http_status.BAD_REQUEST).send({
        status: false,
        message: "Please provide Valid Email 🛑",
      });
    }

    let query = `select * from users where email = '${req.body.email}' limit 1;`;
    conn.query(query, async (err, result) => {
      if (err) throw err;
      console.log(query);
      if (result.length > 0) {
        const currentTime = new Date();
        const futureTime = new Date(currentTime.getTime() + 5 * 60000); // Add 5 Minute in Current time Value
        const futureTimeMs = futureTime.valueOf(); //  Convert into MiliSecond
        let data = {
          expiryIn: futureTimeMs,
          EmployeeId: result[0].userID,
        };
        data = JSON.stringify(data);
        const encoder = new TextEncoder();
        const byteArray = encoder.encode(data);
        const base64String = btoa(String.fromCharCode(...byteArray));
        console.log(base64String);
        console.log(atob(base64String));
        var mailOptions = {
          from: process.env.AuthEmail,
          to: req.body.email,
          subject: "Forgot Password for Cogent CRM",
          html: `<body>
            <h1>
             Hello , ${result[0].fullname} 
            </h1>
            Walcome To Our CogentE Servises Noida
            <p>
              <a href ="http://127.0.0.1:5173/reset-password/${base64String}">click here </a> to Reset Your For Cogent.
            </p>
            <P>The above link is valid only for 5 Minute.</p>
                If you did not ask to reset your password, please ignore this message.
            <p><b> Thank You</b></p>
            
            </body>`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(` Email sent failed for due to : `, error);
          } else {
            res
              .status(http_status.OK)
              .send({ msg: `Password Reset link sent ${req.body.email}` });
            console.log("Email sent: " + info.response);
          }
        });
      } else {
        res
          .status(http_status.BAD_REQUEST)
          .send({ status: false, msg: "Email Does't Exist in Our Record" });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const resetPass = async (req, res) => {
  try {
    let urlData = req.body.data;
    
    let isExpire = atob(urlData);
    console.log(isExpire);
    isExpire = JSON.parse(isExpire);
    console.log("expire ", isExpire.expiryIn); //convert String to Object

    let currentTime = new Date();
    currentTime = currentTime.valueOf();
    if (isExpire.expiryIn <= currentTime) {
      return res.status(http_status.NOT_ACCEPTABLE).send({
        status: true,
        msg: "Link is Expired Try Again",
      });
      // Server does not Response Properly Please try again later after
    } else {
      let hashPass = await utils.generateHashPwd(req.body.newPass);
      let query = `UPDATE users SET Password = '${hashPass}'  WHERE userID = '${isExpire.EmployeeId}'`;
      conn.query(query, async (err, result) => {
        if (err) throw err;
        return res.status(http_status.OK).send({
          status: true,
          msg: "Password changed successfully !!",
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  login,
  frgtPWDEmail,
  resetPass,
};
