const mongoose = require("mongoose");
const moment = require('moment');
const formatDate = moment().format('DD/MM/YYYY');

const newsDetailSchema = new mongoose.Schema({
    newsTitle: {
        type: String,
        required: true,
    },
    newsContent: {
        type: String,
        required: true     
    },
    publishedDate: {
        type: String,
        default: formatDate
    },
    newsImage: {
        type: String,
        required: false
    },
    adminID: {
        /*
        type: mongoose.Schema.Types.ObjectId,
        ref: 'adminModel',
        required: true
        */
       type: String,
       required: true
    },
    dueDate:{
        type: String,
        default: formatDate
    },
    newsBatch: {
        type: Number   
    }
});

const NewsDetail = mongoose.model("NewsDetail", newsDetailSchema);
module.exports = NewsDetail;

