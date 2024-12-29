const adminModel = require("../model/adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const adminSignup = async (req, res) => {
  try {
    const { adminName, password, role, email } = req.body;

    if (!adminName || !password || !role || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields (adminName, password, role, email) are required",
      });
    }

    // Check if the admin already exists
    const existingUser = await adminModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists. Please sign in with a different email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await adminModel.create({
      adminName,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(200).json({
      success: true,
      user,
      message: "Admin registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Admin cannot be registered. Please try again.",
    });
  }
};

// Login controller for authenticating users
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    // Find user with provided email
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      });
    }

    // Generate JWT token and Compare Password
    if (await bcrypt.compare(password, admin.password)) {
      const token = jwt.sign(
        { email: admin.email, id: admin._id, role: admin.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      // Save token to user document in database
      admin.token = token;
      admin.password = undefined;
      // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        admin,
        message: `User Login Success`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    });
  }
};

module.exports = { adminSignup, adminLogin };
