import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalTest = () => {
  const paypalClientId = "AUP6hSzBWmOpehYd4TWMEk5V-uHsJJ1CI7dEbOx0StiPU53L_BlSN25azE2Ph5HeZ82nSzZ1DJi2hw08"; // Thay bằng client ID của bạn

  return (
    <PayPalScriptProvider options={{ "client-id": paypalClientId }}>
      <div>
        <h2>Test PayPal</h2>
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [{ amount: { value: "10.00" } }]
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then((details) => {
              alert("Giao dịch thành công: " + details.payer.name.given_name);
            });
          }}
          onError={(err) => {
            console.error("Lỗi PayPal:", err);
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalTest;
