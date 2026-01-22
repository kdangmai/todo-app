# To-Do Management App

Ứng dụng quản lý công việc (To-Do List) với tính năng phân quyền người dùng (RBAC).

## 🚀 Tính năng chính

- **Authentication:** Đăng nhập, xác thực bằng JWT.
- **Phân quyền (Roles):**
  - **Manager:** Quản lý người dùng (User Management), xem và quản lý task.
  - **Staff:** Chỉ quản lý task cá nhân.
- **Task Management:** Tạo, sửa, xóa, đánh dấu hoàn thành công việc.
- **Dockerized:** Dễ dàng triển khai với Docker Compose.

## 🛠 Công nghệ sử dụng

- **Frontend:** React.js, React Router.
- **Backend:** Node.js, Express.js.
- **Database:** MySQL 8.0 (Sử dụng Sequelize ORM).
- **DevOps:** Docker, Docker Compose.

## ⚙️ Cài đặt và Chạy dự án

### Cách 1: Sử dụng Docker (Khuyên dùng)

Yêu cầu: Đã cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop).

1. Clone dự án và di chuyển vào thư mục gốc.
2. Chạy lệnh sau để build và khởi động toàn bộ hệ thống:

```bash
docker-compose up --build
```

Sau khi chạy xong, truy cập:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Database:** Port 3307 (User: `todo_user`, Pass: `todo_pass`)

### Cách 2: Chạy thủ công (Development)

#### 1. Database
Bạn cần có MySQL server chạy ở port 3306 và tạo database tên `todo_app`.

#### 2. Backend
```bash
cd backend
npm install
# Tạo file .env dựa trên cấu hình bên dưới
npm start
```

#### 3. Frontend
```bash
cd frontend
npm install
npm start
```

## 🔑 Biến môi trường (.env)

Các biến môi trường mặc định đã được cấu hình trong `docker-compose.yml`. Nếu chạy thủ công, bạn cần tạo file `.env` trong thư mục `backend`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=todo_app
JWT_SECRET=123123az
```

## 📂 Cấu trúc dự án

```text
todo-app/
├── backend/            # Source code Node.js API
│   ├── controllers/    # Logic xử lý
│   ├── models/         # Sequelize Models (Database schema)
│   ├── routes/         # API Endpoints
│   └── server.js       # Entry point
├── frontend/           # Source code React App
│   ├── src/
│   │   ├── components/ # Các React Components
│   └── App.js
└── docker-compose.yml  # Cấu hình Docker
```