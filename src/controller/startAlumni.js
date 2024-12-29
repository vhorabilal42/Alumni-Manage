const alumniModel = require("../model/alumniModel");

const selectAlumni = async (req, res) => {
  console.log("Start Alumni API ...");

  const id = req.body.id;
  const isStar = req.body.isStar;

  try {
    const createStarAlumni = await alumniModel.findOneAndUpdate(
      { _id: id },
      { $set: { startAlumni: isStar } },
      { new: true }
    );
    if (!createStarAlumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Alumni startAlumni status updated to ${isStar}.`,
      data: createStarAlumni,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Star Alumni is not selected.",
    });
  }
};

const getAllStartAlumni = async (req, res) => {
  try {
    const allStartAlumni = await alumniModel
      .find({ startAlumni: true })
      .populate("companies")
      .populate("posts")
      .exec();
    if (!allStartAlumni) {
      return res.status(200).json({
        success: true,
        message: "No star Alumni is Present.",
      });
    }
    return res.status(200).json({
      success: true,
      totalStarAlumni: allStartAlumni.length,
      allStartAlumni,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};

module.exports = {
  selectAlumni,
  getAllStartAlumni,
};
