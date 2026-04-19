"use strict";
/**
 * db/dbLoad.js
 * Script nạp dữ liệu mẫu từ data/models.js vào MongoDB
 *
 * Cách chạy:  node ./db/dbLoad.js
 *
 * Script sẽ:
 *  1. Xóa toàn bộ dữ liệu cũ (users, photos, schemaInfo)
 *  2. Chèn lại dữ liệu mẫu từ models.js
 *
 * Lưu ý: chỉ cần chạy 1 lần (hoặc khi muốn reset data)
 */

const mongoose = require("mongoose");
const User       = require("./userModel");
const Photo      = require("./photoModel");
const SchemaInfo = require("./schemaInfo");

// ⚠️  THAY CONNECTION STRING BẰNG URL MONGODB ATLAS CỦA BẠN
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://sonle325:son123456@cluster0.skzkpow.mongodb.net/photo_app?retryWrites=true&w=majority&appName=Cluster0";

async function loadDatabase() {
  try {
    // 1. Kết nối MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Đã kết nối MongoDB");

    // 2. Xóa dữ liệu cũ
    await Promise.all([
      User.deleteMany({}),
      Photo.deleteMany({}),
      SchemaInfo.deleteMany({}),
    ]);
    console.log("🗑️  Đã xóa dữ liệu cũ");

    // 3. Tạo Users
    const users = await User.insertMany([
      { _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4bd7"), first_name: "Ian",      last_name: "Malcolm",    location: "Austin, TX",   description: "Should've stayed in the car.", occupation: "Mathematician" },
      { _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4bd8"), first_name: "Ellen",    last_name: "Ripley",     location: "Nostromo",     description: "Lvl 6 rating. Pilot.",         occupation: "Warrant Officer" },
      { _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4bd9"), first_name: "Peregrin", last_name: "Took",       location: "Gondor",       description: "Home is behind, the world ahead...", occupation: "Thain" },
      { _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4bda"), first_name: "Rey",      last_name: "Kenobi",     location: "D'Qar",        description: "Excited to be here!",         occupation: "Rebel" },
      { _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4bdb"), first_name: "April",    last_name: "Ludgate",    location: "Pawnee, IN",   description: "Witch",                       occupation: "Animal Control" },
      { _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4bdc"), first_name: "John",     last_name: "Ousterhout", location: "Stanford, CA", description: "CS142!",                      occupation: "Professor" },
    ]);
    console.log(`👤 Đã thêm ${users.length} users`);

    // Helper: lấy ObjectId của user theo first_name
    const uid = (first) => users.find((u) => u.first_name === first)._id;

    // 4. Tạo Photos kèm Comments
    const photosData = [
      {
        _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4bdd"),
        file_name: "ouster.jpg",
        date_time: new Date("2012-08-30T10:44:23"),
        user_id: uid("John"),
        comments: [
          { _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4be9"), user_id: uid("John"), date_time: new Date("2012-09-02T14:01:00"), comment: "Learning new programming languages is hard... it's so easy to forget a </div>!" },
          { _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4bea"), user_id: uid("John"), date_time: new Date("2013-09-06T14:02:00"), comment: "This is another comment, with a bit more text; if the text gets long enough, does it wrap properly from line to line?" },
          { _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4beb"), user_id: uid("John"), date_time: new Date("2013-09-08T14:06:00"), comment: "If you see this text in boldface then HTML escaping isn't working properly." },
        ],
      },
      {
        _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4bde"),
        file_name: "malcolm2.jpg",
        date_time: new Date("2009-09-13T20:00:00"),
        user_id: uid("Ian"),
        comments: [
          { _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4bec"), user_id: uid("Ian"), date_time: new Date("2009-09-14T18:07:00"), comment: "If there is one thing the history of evolution has taught us it's that life will not be contained. Life breaks free, it expands to new territories..." },
        ],
      },
      {
        _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4bdf"),
        file_name: "malcolm1.jpg",
        date_time: new Date("2009-09-13T20:05:03"),
        user_id: uid("Ian"),
        comments: [],
      },
      {
        _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4be0"),
        file_name: "ripley1.jpg",
        date_time: new Date("2013-11-18T18:02:00"),
        user_id: uid("Ellen"),
        comments: [],
      },
      {
        _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4be1"),
        file_name: "ripley2.jpg",
        date_time: new Date("2013-09-20T17:30:00"),
        user_id: uid("Ellen"),
        comments: [
          { _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4bed"), user_id: uid("Ellen"), date_time: new Date("2013-11-28T17:45:13"), comment: "Back from my trip. Did IQs just... drop sharply while I was away?" },
        ],
      },
      {
        _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4be2"),
        file_name: "kenobi1.jpg",
        date_time: new Date("2009-07-10T16:02:49"),
        user_id: uid("Rey"),
        comments: [],
      },
      {
        _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4be3"),
        file_name: "kenobi2.jpg",
        date_time: new Date("2010-03-18T23:48:00"),
        user_id: uid("Rey"),
        comments: [
          { _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4bee"), user_id: uid("Ellen"), date_time: new Date("2013-11-02T14:07:00"), comment: "Hey Rey, great form. Love what you do with the scavenged tech, got any tips?" },
          { _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4bef"), user_id: uid("Rey"),   date_time: new Date("2013-11-02T14:09:15"), comment: "Definitely! I love your work! I'm away on a trip at the moment, but let's meet up when I get back! :)" },
        ],
      },
      {
        _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4be4"),
        file_name: "kenobi3.jpg",
        date_time: new Date("2010-08-30T14:26:00"),
        user_id: uid("Rey"),
        comments: [
          { _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4bf0"), user_id: uid("Rey"), date_time: new Date("2010-09-06T13:59:33"), comment: "Made a new friend today! Well, they followed me home, anyway." },
        ],
      },
      {
        _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4be5"),
        file_name: "took1.jpg",
        date_time: new Date("2013-12-03T09:02:00"),
        user_id: uid("Peregrin"),
        comments: [
          { _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4bf3"), user_id: uid("April"),    date_time: new Date("2016-01-04T02:00:01"), comment: "Which one are you?" },
          { _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4bf4"), user_id: uid("Peregrin"), date_time: new Date("2016-01-04T02:04:01"), comment: "The tall one." },
        ],
      },
      {
        _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4be6"),
        file_name: "took2.jpg",
        date_time: new Date("2013-12-03T09:03:00"),
        user_id: uid("Peregrin"),
        comments: [
          { _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4bf2"), user_id: uid("Peregrin"), date_time: new Date("2013-12-04T13:12:00"), comment: "What do you mean you haven't heard of second breakfast?" },
        ],
      },
      {
        _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4be7"),
        file_name: "ludgate1.jpg",
        date_time: new Date("2013-09-04T09:16:32"),
        user_id: uid("April"),
        comments: [
          { _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4bf3"), user_id: uid("April"), date_time: new Date("2013-09-04T10:14:32"), comment: "Beautiful yet cold and aloof. Loner. Does not obey, occasionally chooses to cooperate." },
        ],
      },
      {
        _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4be8"),
        file_name: "kenobi4.jpg",
        date_time: new Date("2008-10-16T17:12:28"),
        user_id: uid("Rey"),
        comments: [
          { _id: new mongoose.Types.ObjectId("57231f1a30e4351f4e9f4bf5"), user_id: uid("Rey"), date_time: new Date("2008-10-16T18:04:55"), comment: "Wouldn't get anywhere without this beauty! Completely built from scraps by hand, but she goes at top speeds that'll rival any First Order piece of junk." },
        ],
      },
    ];

    await Photo.insertMany(photosData);
    console.log(`📷 Đã thêm ${photosData.length} photos`);

    // 5. Tạo SchemaInfo
    await SchemaInfo.create({ load_date_time: new Date() });
    console.log("ℹ️  Đã tạo SchemaInfo");

    console.log("\n🎉 Load database thành công!");
  } catch (err) {
    console.error("❌ Lỗi:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Đã ngắt kết nối MongoDB");
  }
}

loadDatabase();
