const alumniModel = require("../model/alumniModel");
const postModel = require("../model/postModel");

const alumniPost = async (req, res) => {
  const alumniID = req.params.id;
  console.log(alumniID);
  const alumniPost = req.file ? req.file.path : null;
  const postDescription = req.body.postDescription;
  console.log(postDescription);
  console.log(alumniPost);
  

  try {
    const newPost = new postModel({
      alumniPost,
      postDescription,
    });
    const addPost = await newPost.save();
    const updatedUser = await alumniModel.findOneAndUpdate({enrollementNumber: alumniID},
      {
        $push: {
          posts: addPost._id,
        },
      },
      { new: true }
    );
    console.log(addPost)
    console.log(updatedUser);
    return res.status(200).json({
      message: "Post added successfully",
      success: true,
      userInfo: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "post is not Upload Succesfully",
      error: console.log(error),
    });
  }
};

module.exports = { alumniPost };

