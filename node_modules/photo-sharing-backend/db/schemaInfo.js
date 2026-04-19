"use strict";
/**
 * db/schemaInfo.js
 * Định nghĩa schema Mongoose cho collection "SchemaInfo"
 *
 * Lưu thông tin phiên bản schema của database
 */

const mongoose = require("mongoose");

const schemaInfoSchema = new mongoose.Schema({
  load_date_time: { type: Date, default: Date.now },
  __v: { type: Number, default: 0 },
});

module.exports = mongoose.model("SchemaInfo", schemaInfoSchema);
