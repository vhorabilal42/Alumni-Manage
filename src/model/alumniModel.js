const mongoose = require("mongoose");

const AlumniDetailsSchema = new mongoose.Schema({
  enrollementNumber: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  description1: {
    type: String,
  },
  description2: {
    type: String,
  },
  batch: {
    type: Number,
  },
  role: {
    type: String,
    enum: ["Admin", "Alumni"],
  },
  login: {
    type: Boolean,
    required: true, 
  },
  lastName: {
    type: String,
  },
  firstName: {
    type: String,
  },
  userName: {
    type: String,
  },
  phoneNo: {
    type: Number,
  },
  gender: {
    type: String,
  },
  DOB: {
    type: Date,
  },
  technologies: {
    type: [String],
  },
  linkedinLink: { 
    type: String,
  },
  githubLink: {
    type: String,
  },
  twitterLink: {
    type: String,
  },
  image: {
    type: String,
  },
  startAlumni: {
    type: String,
    default: false,
    enum:['false', 'true']
  },
  posts: [ 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "postmodel", 
    },
  ],
  companies: [ 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "companydetails", 
    },
  ],
});

module.exports = mongoose.model("Alumnidetailsmodel", AlumniDetailsSchema);
