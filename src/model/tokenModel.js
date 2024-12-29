const mongoose = require("mongoose");

// Define the schema
const tokenSchema = new mongoose.Schema({
  enrollementNumber: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpires: {
    type: Date,
  },
});

// Create a TTL index that will expire documents after the `resetTokenExpires` time is reached
tokenSchema.index({ resetTokenExpires: 1 }, { expireAfterSeconds: 0 });

// Compile the model
const tokenModel = mongoose.model("tokenmodel", tokenSchema);

module.exports =  tokenModel;
