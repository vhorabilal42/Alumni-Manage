const alumniModel = require("../model/alumniModel");

const getallAlumni = async (req, res) => {
  const queryObject = { ...req.query, login: true };

  if (req.query.userName) {
    queryObject.userName = { $regex: req.query.userName, $options: "i" };
  }
  if (req.query.batch) {
    queryObject.batch = req.query.batch;
  }

  try {
    const loggedInAlumni = await alumniModel
      .find(queryObject)
      .populate("companies")
      .populate("posts")
      .exec();

    return res.status(200).json({
      success: true,
      TotalData: loggedInAlumni.length,
      data: loggedInAlumni,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Alumni is Not Registered",
      error: error.message,
    });
  }
};


const getDetailsById = async (req, res) => {
  try {
    const enrollementNumber = req.params.id;
    const alumniDetails = await alumniModel
      .findOne({
        enrollementNumber: enrollementNumber,
      })
      .populate("companies")
      .populate("posts")
      .exec();
    if (!alumniDetails) {
      return res.status(404).json({
        success: false,
        massage: "user details not found",
      });
    }
    if (alumniDetails.login != true) {
      return res.status(404).json({
        message: "First Sign up Your Account",
        success: false,
      });
    }

    return res.status(200).json({
      Details: alumniDetails,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getOwnUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    // const userId = '672cd985a1af9f67190aa0bc'
  
    console.log(userId);
    const alumniDetails = await alumniModel
      .findById(userId)
      .populate("companies")
      .populate("posts")
      .exec();
    if (!alumniDetails) {
      return res.status(404).json({
        success: false,
        massage: "user details not found",
      });
    }
    if (alumniDetails.login != true) {
      return res.status(404).json({
        message: "First Sign up Your Account",
        success: false,
      });
    }

    return res.status(200).json({
      Details: alumniDetails,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getallAlumni, getDetailsById, getOwnUserDetails };
