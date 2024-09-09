import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [authMode, setAuthMode] = useState("Login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    const endpoint = authMode === "Login" ? "/api/user/login" : "/api/user/register";
    const newUrl = `${url}${endpoint}`;

    try {
      const response = await axios.post(newUrl, formData);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message || "An error occurred. Please try again.");
      } else {
        alert("A network error occurred. Please try again.");
      }
    }
  };

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className='login-popup-container'>
        <div className='login-popup-title'>
          <h2>{authMode}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
        </div>
        <div className='login-popup-inputs'>
          {authMode === 'Sign Up' && (
            <input
              name='name'
              onChange={onChangeHandler}
              value={formData.name}
              type='text'
              placeholder='Your Name'
              required
            />
          )}
          <input
            name='email'
            onChange={onChangeHandler}
            value={formData.email}
            type='email'
            placeholder='Your Email'
            required
          />
          <input
            name='password'
            onChange={onChangeHandler}
            value={formData.password}
            type='password'
            placeholder='Password'
            required
          />
        </div>
        <button type='submit'>
          {authMode === "Sign Up" ? "Create account" : "Login"}
        </button>
        <div className='login-popup-condition'>
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        {authMode === "Login" ? (
          <p>Create a new account? <span onClick={() => setAuthMode("Sign Up")}>Click here</span></p>
        ) : (
          <p>Already have an account? <span onClick={() => setAuthMode("Login")}>Login here</span></p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
