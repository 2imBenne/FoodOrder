## FoodOrder – ứng dụng đặt món online

Monorepo gồm hai phần: `server` (Node/Express + Prisma + MySQL) và `client` (React + Chakra UI). Người dùng có thể xem menu, thêm vào giỏ, đặt đơn và theo dõi trạng thái. Khu vực quản trị hỗ trợ CRUD danh mục/món ăn, quản lý đơn, người dùng và báo cáo doanh thu.

### Tính năng
- **Người dùng**: duyệt danh mục, lọc/ tìm kiếm món, xem món nổi bật; giỏ hàng với đổi số lượng, tính phí giao theo khu vực, áp voucher; đặt hàng kèm địa chỉ/SĐT/ghi chú; theo dõi trạng thái (Pending → Preparing → Delivering → Completed/Cancelled); hủy đơn khi còn chờ; nhận thông báo realtime (Socket.io).
- **Quản trị**: đăng nhập phân quyền (ADMIN); CRUD danh mục, món, khu vực giao, voucher; duyệt/cập nhật trạng thái đơn; phân quyền người dùng; báo cáo doanh thu, trạng thái đơn, top món bán; xuất hóa đơn PDF qua API.

### Công nghệ
- **Backend**: Node.js 18, Express 5, Prisma ORM, MySQL, JWT Auth, Socket.io, PDFKit, Multer (chuẩn bị upload ảnh).
- **Frontend**: React 18 + Vite, Chakra UI, React Router, React Query, React Hook Form, Recharts, Framer Motion, Zustand.

### Cấu trúc thư mục
```
FoodOrder/
├─ server/   # API Express + Prisma
└─ client/   # React frontend
```

### Chuẩn bị môi trường
1. Cài Node.js 18+ và MySQL.
2. Tạo file `.env` từ `.env.example` ở cả `server/` và `client/`.

**server/.env ví dụ**
```
DATABASE_URL="mysql://root:password@localhost:3306/foodorder"
PORT=5000
CLIENT_URL=http://localhost:5173        # có thể truyền nhiều origin, phân tách bằng dấu phẩy
JWT_SECRET=change-me
REFRESH_SECRET=change-me-too
NODE_ENV=development
```

**client/.env ví dụ**
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Cài đặt & chạy
**Backend (`server/`):**
```bash
npm install
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

**Frontend (`client/`):**
```bash
npm install
npm run dev
```

### Lệnh hữu ích
- Server: `npm run build`, `npm run dev`, `npm run prisma:generate`, `npm run prisma:migrate`, `npm run prisma:seed`.
- Client: `npm run build`, `npm run lint`, `npm run preview`.

### Tài khoản mẫu (seed)
- Admin: `admin@foodorder.dev / Admin@123`
- User: `user@foodorder.dev / User@123`

### Ghi chú
- API mặc định: `http://localhost:5000/api`; frontend: `http://localhost:5173`.
- Có thể chỉnh Socket origin qua `VITE_SOCKET_URL` nếu khác `VITE_API_URL`.
