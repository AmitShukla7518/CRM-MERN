const express = require("express");
const app = express();
const router = express.Router();
var bodyParser = require("body-parser");
const login = require("../controller/Auth/login");
const { VarifyToken } = require("../utils/utils");
const {
  UploadImg,
  createClient,
  getData,
  getDataByID,
  DLTById,
  updateEMP,
  bulkUpload,
  ChangePass,
  updateProfile,
} = require("../controller/clientManage");

const { addDept } = require("../controller/Comman_controller/dept");
const {
  getAllLob,
  getAllLocation,
  getAllDegination,
} = require("../controller/Comman_controller/commn");
app.use(bodyParser.json());

router.post("/login", login.login);
router.post("/clinet", VarifyToken, UploadImg, createClient);
router.post("/getData", getData);
router.get("/getDataByID/:id", VarifyToken, getDataByID);
router.delete("/deleteDataByID/:id", VarifyToken, DLTById);
router.put("/updateEmp/:id", VarifyToken, updateEMP);
router.get("/getLOB", getAllLob);
router.get("/getLocation", getAllLocation);
router.get("/getAllDegination", getAllDegination);
router.post("/bulkUpload", bulkUpload);
router.put("/changePass/:id", ChangePass);
router.put("/updateProfile/:id", UploadImg, updateProfile);
router.post("/forgotPass", login.frgtPWDEmail);
router.post("/resetPass", login.resetPass);
router.post("/addDept", addDept);
module.exports = router;
