"use strict";
/**
 * server.js — Backend Express + MongoDB (Mongoose)
 *
 * API Routes:
 *   GET /test/info           → SchemaInfo (kiểm tra kết nối)
 *   GET /user/list           → Danh sách users (_id, first_name, last_name)
 *   GET /user/:id            → Chi tiết 1 user
 *   GET /photosOfUser/:id    → Ảnh + comments của user
 *   GET /images/:filename    → Serve ảnh tĩnh
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const User = require("./db/userModel");
const Photo = require("./db/photoModel");
const SchemaInfo = require("./db/schemaInfo");

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Kết nối MongoDB Atlas 

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://sonle325:son123456@cluster0.skzkpow.mongodb.net/photo_app?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB"))
  .catch((err) => { console.error("❌ Lỗi kết nối:", err.message); process.exit(1); });

// ─── Middleware ────────────────────────────────────────────────
app.use(cors()); // Cho phép tất cả các origin trên CodeSandbox
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

// ─── Routes ───────────────────────────────────────────────────

// GET /test/info — kiểm tra server
app.get("/test/info", async (req, res) => {
  try {
    const info = await SchemaInfo.findOne({});
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /user/list — danh sách users (chỉ 3 trường cho sidebar)
app.get("/user/list", async (req, res) => {
  try {
    const users = await User.find({}, "_id first_name last_name");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /user/:id — chi tiết 1 user
app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ error: `ID '${id}' không hợp lệ` });

  try {
    const user = await User.findById(id, "_id first_name last_name location description occupation");
    if (!user) return res.status(400).json({ error: `Không tìm thấy user với id '${id}'` });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /photosOfUser/:id — ảnh + comments của user
app.get("/photosOfUser/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ error: `ID '${id}' không hợp lệ` });

  try {
    // Kiểm tra user tồn tại
    const userExists = await User.findById(id);
    if (!userExists) return res.status(400).json({ error: `Không tìm thấy user với id '${id}'` });

    // Lấy ảnh của user
    const photos = await Photo.find({ user_id: id });

    // Lắp ráp thông tin user cho từng comment — dùng Promise.all để chạy đồng thời
    const result = await Promise.all(
      photos.map(async (photo) => {
        const commentsWithUser = await Promise.all(
          photo.comments.map(async (comment) => {
            const commenter = await User.findById(comment.user_id, "_id first_name last_name");
            // Tạo plain object mới — KHÔNG dùng Mongoose model trực tiếp
            // vì Mongoose sẽ tự xóa trường không có trong schema
            return {
              _id: comment._id,
              comment: comment.comment,
              date_time: comment.date_time,
              user: commenter,
            };
          })
        );
        return {
          _id: photo._id,
          user_id: photo.user_id,
          file_name: photo.file_name,
          date_time: photo.date_time,
          comments: commentsWithUser,
        };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 404
app.use((req, res) => res.status(404).json({ error: "Route không tồn tại" }));

// Start
app.listen(PORT, () => {
  console.log(`\n🚀 Backend đang chạy tại http://localhost:${PORT}`);
  console.log("   GET /test/info | /user/list | /user/:id | /photosOfUser/:id | /images/:filename\n");
});
