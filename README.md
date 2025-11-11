## FoodOrder – Ứng dụng đặt món ăn online

Mono repo gồm hai phần `server` (Node/Express + Prisma + MySQL) và `client` (React + Chakra UI). Người dùng có thể xem menu, thêm vào giỏ, đặt đơn và theo dõi trạng thái. Khu vực quản trị hỗ trợ CRUD danh mục/món ăn, quản lý đơn, người dùng và báo cáo doanh thu.

### Tính năng chính
- **Người dùng**
  - Xem danh mục, món nổi bật, bộ lọc theo giá/danh mục.
  - Giỏ hàng với cập nhật số lượng, áp dụng voucher, tính phí giao hàng theo khu vực.
  - Đặt hàng với địa chỉ, số điện thoại, ghi chú; theo dõi trạng thái (Pending → Preparing → Delivering → Completed).
  - Nhận thông báo thời gian thực (Socket.io) khi trạng thái thay đổi.
- **Quản trị**
  - Đăng nhập phân quyền, bảng điều khiển KPI + biểu đồ doanh thu.
  - CRUD danh mục, món ăn, khu vực giao hàng, mã giảm giá.
  - Duyệt và cập nhật đơn, phân quyền người dùng, xuất báo cáo.

### Công nghệ
- **Backend:** Node.js, Express 5, Prisma ORM, MySQL, JWT Auth, Multer (chuẩn bị upload hình), PDFKit (in hóa đơn), Socket.io.
- **Frontend:** React 18 + Vite, Chakra UI, React Router, React Query, React Hook Form, Recharts.

### Chuẩn bị môi trường
1. Cài đặt Node.js ≥ 18 và MySQL.
2. Tạo file `.env` từ `.env.example` trong 2 thư mục `server/` và `client/`.
   ```bash
   # server/.env
   DATABASE_URL="mysql://root:password@localhost:3306/foodorder"
   PORT=5000
   CLIENT_URL=http://localhost:5173
   JWT_SECRET=supersecretjwt
   REFRESH_SECRET=supersecretrefresh
   ```
3. Tại thư mục `server/`:
   ```bash
   npm install
   npx prisma migrate dev --name init
   npm run prisma:seed
   npm run dev
   ```
4. Tại thư mục `client/`:
   ```bash
   npm install
   npm run dev
   ```

### Tài khoản mẫu (seed)
- Admin: `admin@foodorder.dev / Admin@123`
- User: `user@foodorder.dev / User@123`

### Cấu trúc thư mục
```
FoodOrder/
├── server/            # API Express + Prisma
└── client/            # React frontend
```

### Kiểm thử & build
- Server: `npm run build` (biên dịch TypeScript) & `npm run dev`.
- Client: `npm run build` dùng Vite.

### Ghi chú
- API mặc định chạy ở `http://localhost:5000/api`, frontend ở `http://localhost:5173`.
- Có thể tùy chỉnh đường dẫn Socket qua `VITE_SOCKET_URL`.
