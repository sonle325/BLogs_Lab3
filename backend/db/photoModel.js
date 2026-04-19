"use strict";
/**
 * db/photoModel.js
 * Định nghĩa schema Mongoose cho collection "Photo"
 *
 * Mỗi Photo document có:
 *  - user_id   : ObjectId tham chiếu đến User (chủ sở hữu ảnh)
 *  - file_name : tên file ảnh (được serve qua /images/)
 *  - date_time : ngày giờ đăng
 *  - comments  : mảng các comment lồng vào (sub-document)
 *
 * Mỗi Comment sub-document có:
 *  - user_id   : ObjectId tham chiếu đến User (người comment)
 *  - comment   : nội dung comment
 *  - date_time : ngày giờ comment
 */

const mongoose = require("mongoose");

// Schema cho comment (lồng bên trong Photo)
const commentSchema = new mongoose.Schema({
  user_id:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment:   { type: String, required: true },
  date_time: { type: Date, default: Date.now },
});

// Schema cho Photo
const photoSchema = new mongoose.Schema({
  user_id:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  file_name: { type: String, required: true },
  date_time: { type: Date, default: Date.now },
  comments:  [commentSchema],
});

module.exports = mongoose.model("Photo", photoSchema);
