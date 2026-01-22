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

## 📋 Yêu cầu hệ thống

- **Node.js:** v14.0 trở lên (cho development)
- **Docker & Docker Compose:** (khuyến cáo cho production)
- **MySQL:** v8.0 (nếu chạy thủ công)
- **npm:** v6.0+

## ⚙️ Cài đặt và Chạy dự án

### Cách 1: Sử dụng Docker (Khuyên dùng) 🐳

Yêu cầu: Đã cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop).

**Bước 1:** Clone và di chuyển vào thư mục gốc
```bash
git clone https://github.com/kdangmai/todo-app.git
cd todo-app
```

**Bước 2:** Build và chạy ứng dụng
```bash
docker-compose up --build
```

**Bước 3:** Truy cập ứng dụng
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Database:** localhost:3307 (User: `todo_user`, Pass: `todo_pass`)

**Tài khoản mặc định:**
- **Username:** manager / staff
- **Password:** 123123az

### Cách 2: Chạy thủ công (Development) 💻

#### Yêu cầu:
- MySQL server chạy trên port 3306
- Node.js v14+

#### Bước 1: Cài đặt Backend
```bash
cd backend
npm install
```

#### Bước 2: Cấu hình Database
Tạo file `.env` trong thư mục `backend`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=todo_app
DB_DIALECT=mysql
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

#### Bước 3: Chạy Backend
```bash
npm start
```

Backend sẽ chạy tại: **http://localhost:5000**

#### Bước 4: Cài đặt Frontend
```bash
cd frontend
npm install
npm start
```

Frontend sẽ chạy tại: **http://localhost:3000**

## 🔧 Cấu hình chi tiết

### Biến môi trường Backend (.env)

| Biến | Mô tả | Mặc định |
|------|-------|---------|
| PORT | Cổng chạy Backend | 5000 |
| DB_HOST | Host MySQL | localhost |
| DB_USER | User MySQL | root |
| DB_PASSWORD | Password MySQL | password |
| DB_NAME | Tên Database | todo_app |
| JWT_SECRET | Secret key JWT | 123123az |
| NODE_ENV | Môi trường (development/production) | development |

### Docker Compose Services

```yaml
Services:
  - todo-mysql: MySQL Database (Port: 3307)
  - todo-backend: Express API (Port: 5000)
  - todo-frontend: React App (Port: 3000)
```

## 📂 Cấu trúc dự án

```text
todo-app/
├── backend/
│   ├── controllers/     # Business logic
│   ├── models/          # Sequelize ORM Models
│   ├── routes/          # API Routes
│   ├── middleware/      # Authentication & Authorization
│   ├── config/          # Database configuration
│   ├── scripts/         # Database setup scripts
│   ├── package.json
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React Components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── docker-compose.yml   # Docker Compose Config
├── .gitignore
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký người dùng
- `POST /api/auth/login` - Đăng nhập

### Tasks
- `GET /api/tasks` - Lấy danh sách task
- `POST /api/tasks` - Tạo task mới
- `PUT /api/tasks/:id` - Cập nhật task
- `DELETE /api/tasks/:id` - Xóa task

### User Management (Manager only)
- `GET /api/users` - Lấy danh sách user
- `POST /api/users` - Tạo user mới
- `PUT /api/users/:id` - Cập nhật user
- `DELETE /api/users/:id` - Xóa user

## 🧪 Testing

Chạy test script để kiểm tra API:
```bash
node test_login.js
```

## 🚀 Deployment

### Deploy với Docker
```bash
docker-compose -f docker-compose.yml up -d
```

### Deploy frontend (Production)
```bash
cd frontend
npm run build
# Kết quả trong thư mục 'build'
```

## 📝 Logging

Backend sẽ log các requests, errors tới console. Có thể cấu hình logging level trong file `.env`.

## 🐛 Troubleshooting

### Port đã được sử dụng
```bash
# Thay đổi port trong docker-compose.yml hoặc .env
```

### Database connection error
- Kiểm tra MySQL server đang chạy
- Kiểm tra credentials (.env)
- Kiểm tra DB_NAME đã được tạo

### Frontend không kết nối được Backend
- Kiểm tra Backend đã chạy (localhost:5000)
- Kiểm tra CORS configuration trong Backend

## 📞 Support

Nếu gặp vấn đề, vui lòng tạo issue trên [GitHub Issues](https://github.com/kdangmai/todo-app/issues).

## 📄 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.