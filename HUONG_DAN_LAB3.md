# 🗄️ Hướng dẫn Lab 3 — Backend + MongoDB

## Những thứ đã thay đổi so với version cũ

| File | Thay đổi |
|------|----------|
| `backend/server.js` | Dùng Mongoose thay vì dữ liệu tĩnh |
| `backend/package.json` | Thêm dependency `mongoose` |
| `backend/db/userModel.js` | **MỚI** — Mongoose schema cho User |
| `backend/db/photoModel.js` | **MỚI** — Mongoose schema cho Photo + Comment |
| `backend/db/schemaInfo.js` | **MỚI** — Mongoose schema cho SchemaInfo |
| `backend/db/dbLoad.js` | **MỚI** — Script load dữ liệu mẫu vào MongoDB |

Frontend **KHÔNG thay đổi gì** — vì đã hoàn chỉnh từ trước.

---

## Bước 1: Tạo MongoDB Atlas account

1. Vào https://www.mongodb.com/atlas → **Try Free**
2. Tạo cluster (chọn Free tier M0)
3. Tạo database user: Database Access → Add New User
4. Mở kết nối từ mọi nơi: Network Access → Add IP Address → **Allow Access from Anywhere**
5. Lấy connection string: Clusters → Connect → Drivers → Copy string

Connection string có dạng:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/photo_app
```

---

## Bước 2: Cài đặt

```bash
# Terminal 1 — Backend
cd backend
npm install          # Cài express, cors, mongoose
```

---

## Bước 3: Điền connection string

Mở `backend/server.js`, tìm dòng:
```js
"mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/photo_app..."
```
Thay bằng connection string thực của bạn.

Tương tự trong `backend/db/dbLoad.js`.

---

## Bước 4: Load dữ liệu mẫu vào MongoDB

```bash
cd backend
npm run load-db
# Hoặc: node ./db/dbLoad.js
```

Output mong đợi:
```
✅ Đã kết nối MongoDB
🗑️  Đã xóa dữ liệu cũ
👤 Đã thêm 6 users
📷 Đã thêm 12 photos
ℹ️  Đã tạo SchemaInfo
🎉 Load database thành công!
🔌 Đã ngắt kết nối MongoDB
```

---

## Bước 5: Chạy ứng dụng

```bash
# Terminal 1 — Backend
cd backend
npm start
# ✅ Backend running on http://localhost:3001

# Terminal 2 — Frontend
cd frontend
npm install
npm start
# ✅ React app on http://localhost:3000
```

---

## Test API

```bash
curl http://localhost:3001/user/list
curl http://localhost:3001/user/57231f1a30e4351f4e9f4bd7
curl http://localhost:3001/photosOfUser/57231f1a30e4351f4e9f4bd7
```
