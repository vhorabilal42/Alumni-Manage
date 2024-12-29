const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const alumniModel = require("../model/alumniModel");
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
      req.user = decode;
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

const isAlumni = async (req, res, next) => {
  try {
    const userDetails = await alumniModel.findOne({ email: req.user.email });

    if (userDetails.role !== "Alumni") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Alumni",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` });
  }
};
module.exports = { auth, isAlumni };
