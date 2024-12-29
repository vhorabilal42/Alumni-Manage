const alumniModel = require("../model/alumniModel");
const companyDetailsModel = require("../model/companyDetailsModel");
const multerImage = require("../middleware/multer");
const bcrypt = require("bcryptjs");

const addProfileDetails = async (req, res) => {
  try {
    const imagePath = req.file ? req.file.path : null;
    const {
      enrollementNumber,
      lastName,
      firstName,
      userName,
      email,
      phoneNo,
      technologies,
      description1,
      description2,
      linkedinLink,
      githubLink,
      twitterLink,
      confirmPassword,
      password,
      companies,
    } = req.body;
    if (
      !enrollementNumber ||
      !lastName ||
      !firstName ||
      !email ||
      !phoneNo ||
      !confirmPassword ||
      !password
    ) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match. Please try again.",
      });
    }

    const userDetails = await alumniModel.findOne({
      enrollementNumber: enrollementNumber,
    });
    // console.log(`1 -- ${userDetails}`);

    const existingUser = await alumniModel.findOne({ email: email });

    if (userDetails.email == email || !existingUser) {
      // console.log(`2 -- ${userDetails}`);

      const hashePassword = await bcrypt.hash(password, 10);
      const alumni = await alumniModel.findOneAndUpdate(
        { enrollementNumber },
        {
          lastName,
          firstName,
          userName,
          email,
          phoneNo,
          technologies,
          description1,
          description2,
          linkedinLink,
          githubLink,
          twitterLink,
          password: hashePassword,
          image: imagePath,
          login: true,
        },
        { new: true }
      );
      if (companies && companies.trim() !== "") {
        try {
          const dataArray = JSON.parse(companies); // Handle JSON parse errors
          for (const item of dataArray) {
            // Use for...of instead of forEach for async
            // console.log(item);

            const companyData = new companyDetailsModel(item);

            const addCompanyData = await companyData.save(); // Save company details
            // console.log("ID ::"+addCompanyData._id);  // Log the saved company ID

            // Push company ID to the Alumni model
            const updateCompanyArray = await alumniModel.findOneAndUpdate(
              { enrollementNumber: enrollementNumber },
              { $push: { companies: addCompanyData._id } }, // Push the new company ID
              { new: true } // Return the updated document
            );

            // console.log("UPDATE :: "+updateCompanyArray);
          }
        } catch (error) {
          console.error(
            "Error while parsing or saving company details:",
            error
          );
          return res.status(500).json({
            success: false,
            message: "Failed to save company details.",
          });
        }
      }

      console.log("User Register Succesfully");
      return res.status(200).json({
        success: true,
        data: alumni,
        message: "User registered successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: console.log(error),
      success: false,
      message: "Alumni details cannot be added. Please try again.",
    });
  }
};

const updateProfile = async (req, res) => {
  const id = req.params.id;
  console.log(id);

  const {
    email,
    technologies,
    description1,
    description2,
    firstName,
    githubLink,
    lastName,
    linkedinLink,
    phoneNo,
    twitterLink,
    userName,
  } = req.body;

  const updateFields = {
    email,
    technologies,
    description1,
    description2,
    firstName,
    githubLink,
    lastName,
    linkedinLink,
    phoneNo,
    twitterLink,
    userName,
  };

  if (req.file) {
    updateFields.image = req.file.path;
  }

  try {
  
    const updatedProfile = await alumniModel.findOneAndUpdate(
      {enrollementNumber: id},
      { $set: updateFields },
      { new: true, runValidators: true } 
    );

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "Alumni details not found or not updated.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Alumni updated successfully.",
      data: updatedProfile, 
    });
  } catch (error) {
    console.error("Error updating alumni profile:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the profile.",
      error: error.message, 
    });
  }
};

module.exports = {
  addProfileDetails,
  updateProfile,
};
