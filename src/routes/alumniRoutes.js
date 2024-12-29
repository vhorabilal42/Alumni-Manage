const express = require("express");
const routes = express();
const { postUpload, profileUpload } = require("../middleware/multer");
const alumni_function = require("../controller/adminAuthControllers");
const {
  login,
  forgotPassword,
  resetPassword,
} = require("../controller/alumniAuthControllers");
const { addProfileDetails, updateProfile } = require("../controller/profileControllers");

const {
  getallAlumni,
  getDetailsById,
  getOwnUserDetails
} = require("../controller/getDetailsControllers");
const { alumniPost } = require("../controller/alumniPostControllers");
const { auth, isAlumni } = require("../middleware/alumniAuth");

//-------authControllers-----------
//  Alumni Login Routes.
routes.post("/login", login);
//  Forgot Password API
// routes.post("/forgotPassword", auth, forgotPassword);
routes.post("/forgotPassword", forgotPassword);

// Reset Password
routes.put("/resetpassword/:resetToken", resetPassword);

//-------profileControllers---------------
//  Alumni SignUp Routes.
routes.post("/addDetails", profileUpload.single("image"), addProfileDetails);

//  Alumni Post there image and Discription of image.
// routes.post("/alumnipost",auth,isAlumni, postUpload.single("alumnipost"), alumniPost);
routes.post("/alumnipost/:id", postUpload.single("alumnipost"), alumniPost);


//-----------getDetailsControllers---------------
//  Get all Alumni Information(permanent)
// routes.get("/getAllDetails", auth, isAlumni, getallAlumni);
routes.get("/getAllDetails", getallAlumni);

//  Get alumni by ID
// routes.get("/getFullDetails/:id", auth, isAlumni, getDetailsById);
routes.get("/getFullDetails/:id", getDetailsById);


// get own details
// routes.get("/profile",auth,isAlumni,getOwnUserDetails);
routes.get("/profile", getOwnUserDetails);

/*  Update Alumni */
routes.patch('/alumniupdate/:id', profileUpload.single("image"), updateProfile);


module.exports = routes;
