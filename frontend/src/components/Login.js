import React, { useState } from "react";
import "../Style/Login.css";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Đăng nhập thành công!");
        window.location.href = "/"; // Chuyển hướng sau đăng nhập
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Lỗi kết nối đến server!");
    }
  };

  return (
    <div className='login-container'>
      <div className='login-box'>
        <div className='login-header'>
          <h1>Little Hotelier</h1>
          <p>Front desk management system</p>
        </div>

        {error && <p className='error-message'>{error}</p>}

        <form onSubmit={handleSubmit} className='login-form'>
          <div className='form-group'>
            <input
              type='text'
              id='email'
              name='email'
              value={loginData.email}
              onChange={handleChange}
              placeholder='Nhập email'
              required
            />
          </div>

          <div className='form-group'>
            <input
              type='password'
              id='password'
              name='password'
              value={loginData.password}
              onChange={handleChange}
              placeholder='Nhập mật khẩu'
              required
            />
          </div>

          <div className='form-footer'>
            <div className='remember-me'>
              <input type='checkbox' id='remember' />
              <label htmlFor='remember'>Ghi nhớ đăng nhập</label>
            </div>
            <a href='#' className='forgot-password'>
              Quên mật khẩu?
            </a>
          </div>

          <button type='submit' className='login-button'>
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
