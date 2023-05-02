const conn = require("../config/config");
const http_status = require("../constants/http_status");
const Validation = require("../utils/validation/validation");
const utils = require("../utils/utils");
var multer = require("multer");
const excelUtils = require("./excelUtilty/utilty");
fs = require("fs");
const reader = require("xlsx");

var Image;
const UploadImg = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/logo");
    },
    filename: async function (req, file, cb) {
      let Imgname = await utils.generateRandomText(10);
      cb(null, file.fieldname + Imgname + ".jpg");
      Image = file.fieldname + "" + Imgname + ".jpg";
    },
  }),
}).single("logo_file");
const createClient = async (req, res) => {
  try {
    if (!Validation.isValid(req.body.lob_Name)) {
      return res
        .status(http_status.BAD_REQUEST)
        .send({ status: false, message: "Please provide Valid LOB Name 🛑" });
    }
    if (!Validation.isValid(req.body.full_name)) {
      return res
        .status(http_status.BAD_REQUEST)
        .send({ status: false, message: "Please provide Valid Name 🛑" });
    }
    if (!Validation.isValidEmail(req.body.email)) {
      return res.status(http_status.BAD_REQUEST).send({
        status: false,
        message: "Please provide Valid Email Address 🛑",
      });
    }
    if (!Validation.isValidmob(req.body.phone)) {
      return res.status(http_status.BAD_REQUEST).send({
        status: false,
        message: "Please provide Valid Phone Number 🛑",
      });
    }

    if (!Validation.isValid(req.body.password)) {
      return res
        .status(http_status.BAD_REQUEST)
        .send({ status: false, message: "Please provide Valid Password 🛑" });
    }
    if (req.body.password != req.body.confrm_pass) {
      return res.status(http_status.BAD_REQUEST).send({
        status: false,
        message: "Password and Conform Password mismatch",
      });
    }
    if (!Validation.isValid(req.body.des)) {
      return res.status(http_status.BAD_REQUEST).send({
        status: false,
        message: "Please provide Valid Designation 🛑",
      });
    }
    if (!Validation.isValid(req.body.location)) {
      return res
        .status(http_status.BAD_REQUEST)
        .send({ status: false, message: "Please provide Valid Location 🛑" });
    }
    if (!Validation.isValid(req.body.address)) {
      return res
        .status(http_status.BAD_REQUEST)
        .send({ status: false, message: "Please provide Valid Address 🛑" });
    }
    if (!Validation.isValid(req.body.social_Media)) {
      return res.status(http_status.BAD_REQUEST).send({
        status: false,
        message: "Please provide Valid Social Media Link 🛑",
      });
    }

    /*if Find image than Save it Directiry and Path save in DB  */
    let hashPass = await utils.generateHashPwd(req.body.password); //Genrate hash Password
    let uniqeNumber = utils.generateOTP(8); //Genrate Employee Number
    let EmployeeID = "CE" + uniqeNumber;
    if (Image === "") {
      Image = "Null";
    }
    let Data = [
      EmployeeID,
      req.body.lob_Name,
      req.body.location,
      req.body.full_name,
      req.body.phone,
      req.body.email,
      hashPass,
      req.body.des,
      req.body.social_Media,
      Image,
      EmployeeID,
    ];
    // check Phone Number In DB
    let checkMob = `select *from users where phone = ${req.body.phone};`;
    await conn.query(checkMob, async (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        return res.status(http_status.BAD_REQUEST).send({
          msg: "Phone Number already Exist in DB !! Choose Another one  🛑",
          status: "failed",
        });
      }

      // check Email In DB
      let checkMob = `select *from users where Email = '${req.body.email}';`;
      await conn.query(checkMob, async (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
          return res.status(http_status.BAD_REQUEST).send({
            msg: "Email ID already Exist in DB !! Choose Another one  🛑",
            status: "failed",
          });
        }

        let query =
          "insert into users(userID,lob_Name,Location,fullname,phone,Email,Password,designation,Socialurl,imgPath,created_by) values(?,?,?,?,?,?,?,?,?,?,?)";
        let interData = await conn.query(query, Data, (err, result) => {
          if (err)
            return res
              .status(http_status.BAD_REQUEST)
              .send({ status: http_status.BAD_REQUEST, error: err });
          return res
            .status(http_status.OK)
            .send({ status: http_status.OK, msg: "User Created successfully" });
        });
      });
      // res.send(Data);
    });
  } catch (error) {
    res
      .status(http_status.BAD_REQUEST)
      .send({ status: http_status.BAD_REQUEST, error: error });
    throw error;
  }
};

let getData = async (req, res) => {
  try {
    let letestEntry = req.body.letestEntry;
    console.log(req.body);
    if (letestEntry == "yes") {
      var date = new Date();
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      // 2008-11-11
      let fullDate = "" + year + "-" + month + "-" + day;
      let query = `SELECT * FROM users WHERE created_at between('${fullDate} 09:24:08') and ('${fullDate} 19:24:08');`;
      conn.query(query, (err, result) => {
        if (err) throw err;
        res.status(http_status.OK).send({
          status: http_status.OK,
          data: result,
        });
      });
    } else {
      let query =
        "select userID,lob_Name ,fullname,designation,userType,imgPath,ActiveStatus,Email,userID as ID from users;";
      conn.query(query, (err, result) => {
        if (err) throw err;
        res.status(http_status.OK).send({
          status: http_status.OK,
          data: result,
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
};

let getDataByID = (req, res) => {
  try {
    let EmployeeID = req.params.id;
    let query = `select userID,lob_Name,fullname,Email,Location,designation,imgPath,phone from users where userID ='${EmployeeID}'`;
    conn.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(http_status.BAD_REQUEST).send({ msg: err });
      } else {
        res.status(http_status.OK).send({ msg: "success", data: result });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

let updateEMP = (req, res) => {
  try {
    let EmployeeID = req.params.id;
    let data = req.body;
    if (Object.keys(data).indexOf("ActiveStatus") > -1) {
      let query = `UPDATE users SET ActiveStatus = ${data.ActiveStatus}  WHERE userID = '${EmployeeID}'`;
      conn.query(query, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(http_status.BAD_REQUEST).send({ msg: err });
        } else {
          res
            .status(http_status.OK)
            .send({ msg: "Active Status updated successfully " });
        }
      });
    } else {
      // console.log(data);
      let query = `UPDATE users SET Location = '${data.Location}',Email='${data.Email}',fullname='${data.fullname}',lob_Name="${data.lob_Name}"  WHERE userID = '${EmployeeID}'`;
      conn.query(query, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(http_status.BAD_REQUEST).send({ msg: err });
        } else {
          res
            .status(http_status.OK)
            .send({ msg: " Record updated successfully " });
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

let DLTById = (req, res) => {
  try {
    let EmployeeID = req.params.id;
    console.log(EmployeeID);

    let user = `select imgPath from users where userID ='${EmployeeID}'`;
    conn.query(user, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(http_status.BAD_REQUEST).send({ msg: err });
      }
      try {
        let imgPath = JSON.stringify(result[0].imgPath);
        imgPath = imgPath.replace(/^"(.*)"$/, "$1");
        fs.unlinkSync(`public/logo/${imgPath}`);
      } catch (error) {
        console.log(error);
      }
    });
    let query = `delete from users where userID ='${EmployeeID}'`;
    conn.query(query, (err, result) => {
      if (err) {
        return res.status(http_status.BAD_REQUEST).send({ msg: err });
      }
      res.status(http_status.OK).send({ msg: "Successfully deleted Employee" });
    });
  } catch (error) {
    console.log(error);
  }
};

const bulkUpload = async (req, res) => {
  try {
    console.log(req.files.excelFile.name);
    if (!excelUtils.validationExcelFile(req.files.excelFile.name)) {
      return res
        .status(http_status.NOT_ACCEPTABLE)
        .send({ msg: "Please Upload .csv,.xls,.xlsx file" });
    }
    if (req.files.excelFile.size > 5000000) {
      return res
        .status(http_status.NOT_ACCEPTABLE)
        .send({ msg: "Please Upload File less than 5 MB" });
    }
    let exlFile = req.files.excelFile;
    const file = reader.read(exlFile.data);
    let data = [];
    let jsonData = [];
    const sheets = file.Sheets["Sheet1"];
    data = reader.utils.sheet_to_json(sheets);
    let headers = data.map((item) => Object.keys(item));
    for (let i = 0; i < 1; i++) {
      headers = headers[i];
    }

    data.map((item) => {
      jsonData.push(item);
    });

    let checkDup = await excelUtils.checkDuplicacyByFields(
      jsonData,
      "Email",
      "Phone"
    );

    let insertQuery = await excelUtils.createAccountOpning(checkDup[0]);
    let interData = await conn.query(insertQuery[0], (err, result) => {
      if (err)
        return res
          .status(http_status.BAD_REQUEST)
          .send({ status: http_status.BAD_REQUEST, error: err });
      let insertedData = `select userID,lob_Name,fullname,phone,Email from users where token  = '${insertQuery[1]}'`;
      conn.query(insertedData, (err, data) => {
        if (err)
          return res
            .status(http_status.BAD_REQUEST)
            .send({ status: http_status.BAD_REQUEST, error: err });

        let response = {
          msg: `${checkDup[0].length} Entry Successfully Added in DB`,
          err: `${checkDup[1].length} Duplicate Entry Found`,
          uniqueData: data,
          duplicateData: checkDup[1],
        };
        res.status(http_status.OK).send(response);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const ChangePass = async (req, res) => {
  try {
    let empID = req.params.id;
    let oldPass = req.body.oldPass;
    let newPass = req.body.newPass;
    let cnfrmPass = req.body.cnfrmPass;
    console.log(oldPass);
    if (!Validation.isValid(oldPass)) {
      return res
        .status(http_status.BAD_REQUEST)
        .send({ status: false, msg: "Please provide Old Password 🛑" });
    }
    if (newPass === oldPass) {
      return res.status(http_status.BAD_REQUEST).send({
        status: false,
        msg: "Old Password and New Password Can't be Same 🛑",
      });
    }
    if (!Validation.isValid(newPass)) {
      return res
        .status(http_status.BAD_REQUEST)
        .send({ status: false, msg: "Please provide New Password 🛑" });
    }
    if (newPass != cnfrmPass) {
      return res.status(http_status.BAD_REQUEST).send({
        status: false,
        msg: "New Password and Confirm Password must be Same 🛑",
      });
    }
    let query = `select Password from users where userID ='${empID}'`;
    conn.query(query, async (err, result) => {
      if (err) throw err;
      let checkPass = await utils.comparePwd(oldPass, result[0].Password);
      if (checkPass === true) {
        let hashPass = await utils.generateHashPwd(newPass);
        let query = `UPDATE users SET Password = '${hashPass}'  WHERE userID = '${empID}'`;
        conn.query(query, async (err, result) => {
          if (err) throw err;
          return res.status(http_status.OK).send({
            status: true,
            msg: "Password changed successfully !!",
          });
        });
      } else {
        return res.status(http_status.BAD_REQUEST).send({
          status: false,
          msg: "Old Password is incorrect",
        });
      }
    });
  } catch (error) {}
};

const updateProfile = (req, res) => {
  if (!Validation.isValid(req.body.name)) {
    return res
      .status(http_status.BAD_REQUEST)
      .send({ status: false, msg: "Please provide Name 🛑" });
  }
  if (!Validation.isValidEmail(req.body.email)) {
    return res.status(http_status.BAD_REQUEST).send({
      status: false,
      message: "Please provide Valid Email Address 🛑",
    });
  }
  if (!Validation.isValidmob(req.body.phone)) {
    return res.status(http_status.BAD_REQUEST).send({
      status: false,
      message: "Please provide Valid Phone Number 🛑",
    });
  }
  let empID = req.params.id;
  let query = `UPDATE users SET fullname = '${req.body.name}',Email='${req.body.email}',imgPath='${Image}',phone="${req.body.phone}"  WHERE userID = '${empID}'`;
  if (Image === undefined) {
    query = `UPDATE users SET fullname = '${req.body.name}',Email='${req.body.email}',phone="${req.body.phone}"  WHERE userID = '${empID}'`;
  }
  console.log(query);
  conn.query(query, (err, result) => {
    if (err) throw err;

    return res.status(http_status.OK).send({
      status: true,
      msg: "Profile Updated successfully !!",
      ImgPath: Image,
    });
  });
};

module.exports = {
  createClient,
  UploadImg,
  getData,
  getDataByID,
  DLTById,
  updateEMP,
  bulkUpload,
  ChangePass,
  updateProfile,
};
