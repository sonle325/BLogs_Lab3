# Photo Sharing App — Full Stack (FE + BE tách biệt)

Dự án được tách thành **hai ứng dụng độc lập**:

| Thư mục    | Công nghệ             | Cổng mặc định |
| ---------- | --------------------- | ------------- |
| `backend/` | Node.js + Express.js  | **3001**      |
| `frontend/`| React 18 + MUI v5     | **3000**      |

---

## Cấu trúc dự án

```
photo-sharing-fullstack/
├── backend/
│   ├── server.js          ← Express server + REST API
│   ├── package.json
│   ├── data/
│   │   └── models.js      ← Dữ liệu mẫu (CommonJS)
│   └── images/            ← Ảnh tĩnh được serve qua /images/:filename
│
└── frontend/
    ├── package.json        ← "proxy": "http://localhost:3001"
    └── src/
        ├── App.js                          ← Router + Context Provider
        ├── context/AppContext.js           ← Shared state (topBarText, advancedMode)
        ├── lib/fetchModelData.js           ← fetch() wrapper → gọi REST API
        └── components/
            ├── TopBar/      ← Tên app | Context text | Checkbox nâng cao
            ├── UserList/    ← Danh sách user (sidebar)
            ├── UserDetail/  ← Thông tin chi tiết user
            └── UserPhotos/  ← Ảnh + Comments (+ stepper ở advanced mode)
```

---

## Cài đặt & Chạy

### Bước 1 – Backend

```bash
cd backend
npm install
npm start
# ✅ Backend running on http://localhost:3001
```

### Bước 2 – Frontend (terminal mới)

```bash
cd frontend
npm install
npm start
# ✅ React app running on http://localhost:3000
```

Mở trình duyệt tại **http://localhost:3000**

---

## REST API (Backend)

| Method | URL                   | Mô tả                              |
| ------ | --------------------- | ---------------------------------- |
| GET    | `/test/info`          | Trả về SchemaInfo (test)           |
| GET    | `/user/list`          | Danh sách tất cả user              |
| GET    | `/user/:id`           | Thông tin chi tiết user            |
| GET    | `/photosOfUser/:id`   | Tất cả ảnh + comments của user     |
| GET    | `/images/:filename`   | Serve file ảnh tĩnh               |

---

## Tính năng đã hoàn thành

### Bài toán 1 — React Components (40đ)
- ✅ **UserList** — danh sách user dạng sidebar, click → UserDetail
- ✅ **UserDetail** — hiển thị đầy đủ thông tin (tên, vị trí, nghề nghiệp, mô tả), nút "Xem ảnh"
- ✅ **UserPhotos** — tất cả ảnh + ngày giờ + comments (author có link → UserDetail)
- ✅ **TopBar** — bên trái: tên app; bên phải: ngữ cảnh view hiện tại

### Bài toán 2 — Fetch từ server (20đ)
- ✅ `fetchModel(url)` trong `lib/fetchModelData.js` sử dụng `fetch()` native
- ✅ Tất cả components gọi API thực (không dùng data tĩnh)
- ✅ Deep linking hoạt động — refresh trình duyệt vẫn giữ đúng view

### Điểm thưởng — Advanced Mode (5đ)
- ✅ Checkbox "Bật tính năng nâng cao" trên TopBar
- ✅ Khi bật: UserPhotos chuyển sang chế độ stepper (1 ảnh / lần)
- ✅ Nút Prev/Next bị disabled đúng khi ở ảnh đầu/cuối
- ✅ Index ảnh lưu trong URL query param `?idx=N` → bookmark được, back/forward hoạt động
- ✅ Khi tắt: trở lại chế độ xem tất cả ảnh

---

## Ghi chú kỹ thuật

- Frontend dùng `"proxy": "http://localhost:3001"` trong `package.json` → fetch với đường dẫn tương đối `/user/list` sẽ tự forward đến backend trong development.
- Backend bật **CORS** cho `http://localhost:3000`.
- Images được serve từ `backend/images/` qua Express static middleware.

# BLogs_Lab3
