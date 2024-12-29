const mongoose = require("mongoose");

const companyDetailsSchema = new mongoose.Schema({
  companyName: {
    type: String,
  },
  position: {
    type: String,
  },
  workingExperience: {
    type: String,
  },
  currentCompany: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("companydetails", companyDetailsSchema);
