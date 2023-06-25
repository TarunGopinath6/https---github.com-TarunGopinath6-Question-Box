import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../API/axios";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const getTokens = async () => {
    try {
      const accessToken = await localStorage.getItem("accessToken");
      const refreshToken = await localStorage.getItem("refreshToken");
      console.log("Tokens retrieved successfully.");
      return { accessToken, refreshToken };
    } catch (error) {
      console.log("Error retrieving tokens:", error);
      return { accessToken: null, refreshToken: null };
    }
  };

  const storeTokens = async (accessToken, refreshToken, email) => {
    try {
      await localStorage.setItem("accessToken", accessToken);
      await localStorage.setItem("refreshToken", refreshToken);
      await localStorage.setItem("email", email);
      console.log("Tokens stored successfully.");
    } catch (error) {
      console.log("Error storing tokens:", error);
    }
  };

  const clearTokens = async () => {
    try {
      await localStorage.removeItem("accessToken");
      await localStorage.removeItem("refreshToken");
      console.log("Tokens cleared successfully.");
    } catch (error) {
      console.log("Error clearing tokens:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearTokens();
    console.log(email, password);
    const body = { email, password };
    try {
      const response = await axiosInstance.post(
        "http://localhost:3000/check_user",
        body
      );
      if (response.status === 200) {
        storeTokens(
          response.data["accessToken"],
          response.data["refreshToken"],
          response.data["email"]
        );
        navigate("/home");
      } else {
        console.log("Login failed");
        console.log(response);
      }
    } catch (error) {
      // Handle error from the Axios request
      console.log("Error:", error);
    }

    // Reset the form fields
    setEmail("");
    setPassword("");
  };

  useEffect(() => {
    clearTokens(); // Clear tokens when the component mounts
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "4px",
          width: "300px",
        }}
      >
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              marginBottom: "10px",
              marginRight: "50px",
            }}
          >
            <label htmlFor="email" style={{ marginBottom: "5px" }}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                height: "40px",
                border: "1px solid #ccc",
                marginBottom: "10px",
                padding: "10px",
                width: "100%",
              }}
            />
          </div>
          <div
            style={{
              marginBottom: "10px",
              marginRight: "50px",
            }}
          >
            <label htmlFor="password" style={{ marginBottom: "5px" }}>
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                height: "40px",
                border: "1px solid #ccc",
                marginBottom: "10px",
                padding: "10px",
                width: "100%",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
