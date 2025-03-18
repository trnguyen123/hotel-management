// PaymentSuccess.js
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const order_id = urlParams.get("token"); // PayPal trả về token là order_id
    const booking_id = localStorage.getItem("booking_id"); // Lấy booking_id từ localStorage

    const capturePayment = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id, booking_id }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data.message);
          localStorage.removeItem("booking_id"); // Xóa booking_id sau khi xử lý
          // Có thể redirect hoặc hiển thị thông báo thành công
          alert("Thanh toán thành công!");
          window.location.href = "/calendar"; 
        } else {
          console.error("Failed to capture payment:", await response.json());
        }
      } catch (error) {
        console.error("Error capturing payment:", error);
      }
    };

    if (order_id && booking_id) {
      capturePayment();
    }
  }, [location]);

  return <div>Đang xử lý thanh toán...</div>;
};

export default PaymentSuccess;