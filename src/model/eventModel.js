const mongoose = require("mongoose");
const moment = require('moment');
const formatDate = moment().format('MM/DD/YYYY');

const eventSchem = new mongoose.Schema({
  eventTitle: {
    type: String,
    required: true,
  },
  eventContent: {
    type: String,
    required: true,
  },
  publishedDate: {
    type: String,
    default: formatDate,
  },
  eventImage: {
    type: String,
    required: false,
  },
  adminID: {
    /*
        type: mongoose.Schema.Types.ObjectId,
        ref: 'adminModel',
        required: true
        */
    type: String,
    required: true,
  },
  dueDate: {
    type: String,
    default: formatDate,
  },
  eventBatch: {
    type: Number,
  },
  listOfAlumniForEvents: [

    {
      alumniEnrollmentNo: {
        type: Number,
      },
    },
  ]
});

const eventModel = mongoose.model('eventdetails', eventSchem)


module.exports = eventModel