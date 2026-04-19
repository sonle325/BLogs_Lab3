"use strict";
/**
 * db/userModel.js
 * Định nghĩa schema Mongoose cho collection "User"
 *
 * Mỗi User document có các trường:
 *  - first_name, last_name : tên
 *  - location              : địa điểm
 *  - description           : giới thiệu bản thân
 *  - occupation            : nghề nghiệp
 */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name:  { type: String, required: true },
  location:   String,
  description: String,
  occupation:  String,
});

// Xuất model "User" tương ứng với collection "users" trong MongoDB
module.exports = mongoose.model("User", userSchema);
