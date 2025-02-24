const express = require("express");
const router = express.Router();
const db = require("../config/db"); 

// Lấy danh sách dịch vụ từ db
router.get("/getAll", async (req, res) => {
    try {
        const [results] = await db.query("SELECT service_id, service_name FROM services");
        res.json(results);
    } catch (error) {
      console.error("Lỗi truy vấn DB:", error);
      res.status(500).json({ error: "Lỗi khi lấy dữ liệu từ DB" });
    }
});
// Tạo dịch vụ mới
router.post("/use", async (req, res) => {
    const { service_name, quantity, room_number, customer_name } = req.body;

    if (!service_name || !quantity || !room_number || !customer_name) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
    }

    try {
        let customerId, serviceId, price, totalPrice, bookingId;

        // Kiểm tra xem khách hàng đã tồn tại chưa
        const [existingCustomer] = await db.execute(
            "SELECT customer_id FROM customers WHERE full_name = ?",
            [customer_name]
        );

        if (existingCustomer.length > 0) {
            customerId = existingCustomer[0].customer_id;
        } else {
            // Thêm khách hàng mới nếu chưa có
            const [newCustomer] = await db.execute(
                "INSERT INTO customers (full_name) VALUES (?)",
                [customer_name]
            );
            customerId = newCustomer.insertId;
        }

        // Lấy booking_id bằng customer_id từ bảng bookings
        const [booking] = await db.execute(
            "SELECT booking_id FROM bookings WHERE customer_id = ? ",
            [customerId]
        );

        bookingId = booking[0].booking_id; // Lấy đúng giá trị booking_id

        // Lấy thông tin dịch vụ từ bảng services
        const [service] = await db.execute(
            "SELECT service_id, price FROM services WHERE service_name = ?",
            [service_name]
        );

        if (service.length === 0) {
            return res.status(400).json({ message: "Dịch vụ không tồn tại!" });
        }

        serviceId = service[0].service_id;
        price = service[0].price;
        totalPrice = quantity * price;

        console.log("customerId:", customerId);
        console.log("bookingId:", bookingId);
        console.log("serviceId:", serviceId);
        console.log("quantity:", quantity);
        console.log("totalPrice:", totalPrice);

        // Lưu vào bảng used_services
        await db.execute(
            "INSERT INTO used_services (booking_id, service_id, quantity, total_price) VALUES (?, ?, ?, ?)",
            [bookingId, serviceId, quantity, totalPrice]
        );

        res.json({ message: "Dịch vụ đã được sử dụng thành công!" });
    } catch (error) {
        console.error("Lỗi khi lưu dịch vụ:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

  
module.exports = router;
