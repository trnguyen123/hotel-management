// PayPalWrapper.js
import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalWrapper = ({ totalPriceUSD, handlePayPalSuccess, paypalClientId }) => {
  if (!paypalClientId) {
    return <p>Lỗi: Không tìm thấy PayPal Client ID. Vui lòng kiểm tra cấu hình.</p>;
  }

  return (
    <PayPalScriptProvider options={{ "client-id": paypalClientId }}>
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          console.log("Tạo đơn hàng với số tiền:", totalPriceUSD.toFixed(2));
          return actions.order.create({
            purchase_units: [{
              amount: { value: totalPriceUSD.toFixed(2) }
            }]
          });
        }}
        onApprove={(data, actions) => {
          console.log("Đơn hàng được phê duyệt:", data);
          return actions.order.capture().then(handlePayPalSuccess);
        }}
        onError={(err) => {
          console.error("Lỗi PayPal:", err);
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalWrapper;