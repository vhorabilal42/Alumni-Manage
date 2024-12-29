const NewsDetail = require("../model/newsModel");
const moment = require("moment");
const formatDate = moment().format("DD/MM/YYYY");


const createNews = async (req, res) => {
console.log(Date.now());

  try {
    const newsImagePath = req.file ? req.file.path : null;
    const { newsTitle, newsContent, adminID, dueDate, newsBatch } = req.body;

    // Validate required fields
    if (!newsTitle || !newsContent || !adminID) {
      return res.status(400).json({
        success: false,
        message: "News title, content, and admin ID are required.",
      });
    }

    if (dueDate <= formatDate) {
      return res.status(400).json({
        success: false,
        message: "Used the Another Date",
      });
    }
    const news = new NewsDetail({
      newsTitle,
      newsContent,
      newsImage: newsImagePath,
      adminID,
      dueDate,
      newsBatch
    });
    await news.save();
    console.log("News API is called succesfully.");
    return res.status(200).json({
      success: true,
      message: "News is Create Succesfully.",
      data: news,
    });
  } catch (error) {
    return res.status(500).json({
      error: console.log(error),
      success: false,
      message: "An error occurred while adding the news.",
    });
  }
};

const getAllNews = async (req, res) => {
  let objectFilter = {};
    if (req.query.batch) {
      objectFilter.newsBatch = req.query.batch;
    }

  try {
    await NewsDetail.deleteMany({ dueDate: { $lte: formatDate } });

    const news = await NewsDetail.find(objectFilter);
    return res.status(200).json({
      success: true,
      totalNews: news.length,
      message: "All News are Here",
      data: news,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occurs to Fetch the news",
    });
  }
};

const deleteNews = async (req, res) => {
  const id = req.params.id;
  try {
    const isIdAvailable = await NewsDetail.findById(id);
    if (!isIdAvailable) {
      return res.status(400).json({
        success: false,
        message: "Id is Not Correct.",
      });
    }
    await NewsDetail.findByIdAndDelete(isIdAvailable._id);
    return res.status(200).json({
      success: true,
      message: "News is Delete Successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occurs to Fetch the news",
    });
  }
};

const updateNews = async (req, res) => {
  console.log(req.body);
  
  try {
    const updateNews = {...req.body}
    if(req.file){
      updateNews.newsImage = req.file.path
    }

    const tour = await NewsDetail.findByIdAndUpdate(req.params.id, updateNews, {
      new: true, // show the update record
    });
    res.status(200).json({
      status: true,
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

module.exports = {
  createNews,
  getAllNews,
  deleteNews,
  updateNews
};
