"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const User = require("./db/userModel");
const Photo = require("./db/photoModel");
const SchemaInfo = require("./db/schemaInfo");

const app = express();
const PORT = process.env.PORT || 3001;

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Connect DB error");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("ConnectDB successfully"))
  .catch((err) => { console.error("ConnectDB error:", err.message); process.exit(1); });

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.get("/test/info", async (req, res) => {
  try {
    const info = await SchemaInfo.findOne({});
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/user/list", async (req, res) => {
  try {
    const users = await User.find({}, "_id first_name last_name");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

app.get("/photosOfUser/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ error: `ID '${id}' không hợp lệ` });

  try {
    const userExists = await User.findById(id);
    if (!userExists) return res.status(400).json({ error: `Không tìm thấy user với id '${id}'` });

    const photos = await Photo.find({ user_id: id });

    const result = await Promise.all(
      photos.map(async (photo) => {
        const commentsWithUser = await Promise.all(
          photo.comments.map(async (comment) => {
            const commenter = await User.findById(comment.user_id, "_id first_name last_name");
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

app.use((req, res) => res.status(404).json({ error: "Route không tồn tại" }));

app.listen(PORT, () => {
  console.log(`\nBackend đang chạy tại http://localhost:${PORT}`);
  console.log("   GET /test/info | /user/list | /user/:id | /photosOfUser/:id | /images/:filename\n");
});
