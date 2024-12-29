const express = require("express");
const routes = express();
const { uploadCsvFile} = require("../middleware/multer");
const { CreateNewAlumni,sendInvations } = require("../controller/createAccountController");
const {adminSignup,adminLogin}=require("../controller/adminAuthControllers");
const {auth,isAllAdmin,isAdmin}=require("../middleware/adminAuth")
// const createNewsController = require('../controller/createNews')
// const {createNews, getAllNews} = require('../controller/createNews')
const { deleteAlumni } = require('../controller/adminController')
const { selectAlumni, getAllStartAlumni } = require('../controller/startAlumni')



// Upload Email File API.
routes.post('/upload', uploadCsvFile.single("details"), CreateNewAlumni);
//  Send Email API
// routes.post('/sendInvitaion',auth,isAllAdmin,sendInvations);
routes.post('/sendInvitaion',sendInvations);


// routes.post('/createAdmin',auth,isAdmin,adminSignup);
routes.post('/createAdmin',adminSignup);

routes.post('/loginAdmin',adminLogin);

// -----------Delete the Alumni--------------
routes.delete('/:id',deleteAlumni)


// ----------- Start Alumni --------------
routes.patch('/startalumni', selectAlumni)


/*  Strar alumni */
routes.get('/allstaralumni',getAllStartAlumni)

module.exports = routes
