const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const adminModel = require("../model/adminModel");
dotenv.config();

const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ success: false, message: `Token Missing` });
    }
    try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      //console.log(decode);
      req.admin = decode;
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "token is invalid" });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `Something Went Wrong While Validating the Token`,
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const adminDetails = await adminModel.findOne({ email: req.admin.email });

    if (adminDetails.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Admin",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` });
  }
};
const isAllAdmin = async (req, res, next) => {
  try {
    const adminDetails = await adminModel.findOne({ email: req.admin.email });

    if (adminDetails.role === "Sub-Admin" || adminDetails.role === "Admin") {
      next()
    }else{
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Admin and Sub-Admin",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` });
  }
};
module.exports = { auth, isAdmin, isAllAdmin };
