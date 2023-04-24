// var request = require('request');
const utils = require("../../utils/utils");

exports.createAccountOpning = async function (data) {
  let accessToken = utils.generateRandomText(10);
  let insertQuery =
    "insert into users(userID,lob_Name,Location,fullname,phone,Email,Password,designation,Token) values";
  for (const item of data) {
    let hashPass = await utils.generateHashPwd(item.Password); //Genrate hash Password
    let uniqeNumber = await utils.generateOTP(8); //Genrate Employee Number
    let EmployeeID = "CE" + uniqeNumber;

    insertQuery += `('${EmployeeID}','${item.LOB_Name}','${item.location}','${item.Name}','${item.Phone}','${item.Email}','${hashPass}','${item.Degination}','${accessToken}'),`;
  }
  insertQuery = insertQuery.replace(/,$/, ";");

  return [insertQuery, accessToken];
};

/**
 * @function checkDuplicacy
 * @param {*} Array_of_Object
 * @returns Remove Duplicate Entry and Return Unique Elements
 */

exports.checkDuplicacy = async (data) => {
  var arrOfObj = data;
  var dataArr = arrOfObj.map((item) => {
    return [item.Phone, item];
  }); // creates array of array
  var maparr = new Map(dataArr); // create key value pair from array of array
  var result = [...maparr.values()]; //converting back to array from mapobject
  return result;
};

/**
 * @function checkDuplicacyByFields
 * @param {*} Array_of_Object_&_Fields_Name,
 * @returns  Duplicate and Unique Data Field
 */
exports.checkDuplicacyByFields = (data, f1, f2) => {
  const { uniqueData, duplicateData } = data.reduce(
    (acc, obj) => {
      const emailExists = acc.emails.has(f1);
      const phoneExists = acc.phones.has(f2);

      if (emailExists || phoneExists) {
        acc.duplicateData.push(obj);
      } else {
        acc.uniqueData.push(obj);
      }

      acc.emails.add(f1);
      acc.phones.add(f2);

      return acc;
    },
    { uniqueData: [], duplicateData: [], emails: new Set(), phones: new Set() }
  );
  return [uniqueData, duplicateData];
};

//just fo executing http requests
exports.runRequest = function (options) {
  return new Promise(async function (resolve, reject) {
    try {
      await request(options, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

exports.validationExcelFile = (name) => {
  const ext = [".xlsx", ".xlsm", ".xlsb", ".xls", ".csv"];
  return ext.some((el) => name.endsWith(el));
};
