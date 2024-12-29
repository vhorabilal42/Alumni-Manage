const alumniModel = require("../model/alumniModel");
const tokenModel = require("../model/tokenModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const random = require("randomstring");
const mailFile = require("../utils/mailSender");
const { resetPasswordMail } = require("../mail/templates/resetPasswordMail");
require("dotenv").config();

const login = async (req, res) => {
  try {
    const { enrollementNumber, password } = req.body;
    if (!enrollementNumber || !password) {
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }
    const user = await alumniModel.findOne({ enrollementNumber });
    console.log(user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "not exist user please cheack a credentials",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);

    if (isMatch) {
      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      user.token = token;
      user.password = undefined;
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        password,
        message: `User Login Success`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Enrollment OR Password is Incorrect",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
      error: console.log(error),
    });
  }
};

const forgotPassword = async (req, res) => {
  console.log("forgotPassword")
  const alumniData = await alumniModel.findOne({ email: req.body.email });

  if (!alumniData) {
    res.status(400).json({
      status: false,
      message: "Email is not exit please try a valid email",
    });
  }
  const enrollementNumber = alumniData.enrollementNumber;
  const resetToken = random.generate();
  const resetTokenExpires = new Date(Date.now() + 2 * 60 * 60 * 1000);

  const addToken = new tokenModel({
    enrollementNumber,
    resetToken,
    resetTokenExpires,
  });
  await addToken.save();

  await mailFile.mailSender(
    alumniData.email,
    "resetPassword",
    resetPasswordMail(resetToken, alumniData.firstName)
  );
  res.status(200).json({
    status: true,
    message: "Check your Email",
  });
}

const resetPassword = async (req, res) => {
  try {
    const resetToken = req.params.resetToken
    const tokenData = await tokenModel.findOne({ resetToken: resetToken });
    if (!tokenData) {
      res.status(400).json({
        status: false,
        message: "Link is Expire please try again",
      });
    }
    const password = req.body.password;
    const hash_password = await bcrypt.hash(password, 10);
    const userInfo = await alumniModel.findOneAndUpdate(
      { enrollementNumber: tokenData.enrollementNumber },
      { $set: { password: hash_password } },
      { new: true }
    );
    await tokenModel.findByIdAndDelete({ _id: tokenData._id }, { new: true });
    res.status(200).json({
      status: true,
      userInfo: {
        info: userInfo,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error });
  }
}

module.exports = { login, forgotPassword, resetPassword };

