import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext.jsx';
import axios from 'axios';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, user } = useContext(StoreContext);
  const navigate = useNavigate();  // Initialize navigate

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    zipCode: '',
    country: '',
    phone: ''
  });

  useEffect(() => {
    if (!token) {
      navigate('/cart');  // Redirect to cart if not logged in
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart');  // Redirect to cart if no items in the cart
    }
  }, [token, navigate, getTotalCartAmount]);  // Include dependencies

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      console.error('User not logged in or user ID missing');
      alert('User not logged in or user ID missing');
      return;
    }

    const orderItems = food_list
      .filter(item => cartItems[item._id] > 0)
      .map(item => ({
        ...item,
        quantity: cartItems[item._id],
      }));

    const orderData = {
      userId: user._id,
      address: formData,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers:{
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
      });

      console.log('Payment response:', response.data);

      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url); // Redirect to payment gateway
      } else {
        alert('Error during payment initialization. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error.message);
      alert('An error occurred during payment. Please try again.');
    }
  };

  return (
    <form className='place-order' onSubmit={handleSubmit}>
      <div className='place-order-left'>
        <p className='title'>Delivery Information</p>
        <div className='multi-fields'>
          <input 
            type='text' 
            name='firstName' 
            placeholder='First name' 
            value={formData.firstName} 
            onChange={handleInputChange} 
            required 
          />
          <input 
            type='text' 
            name='lastName' 
            placeholder='Last name' 
            value={formData.lastName} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <input 
          type='email' 
          name='email' 
          placeholder='Email address' 
          value={formData.email} 
          onChange={handleInputChange} 
          required 
        />
        <input 
          type='text' 
          name='street' 
          placeholder='Street' 
          value={formData.street} 
          onChange={handleInputChange} 
          required 
        />
        <div className='multi-fields'>
          <input 
            type='text' 
            name='city' 
            placeholder='City' 
            value={formData.city} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <div className='multi-fields'>
          <input 
            type='text' 
            name='zipCode' 
            placeholder='Zip code' 
            value={formData.zipCode} 
            onChange={handleInputChange} 
            required 
          />
          <input 
            type='text' 
            name='country' 
            placeholder='Country' 
            value={formData.country} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <input 
          type='text' 
          name='phone' 
          placeholder='Phone' 
          value={formData.phone} 
          onChange={handleInputChange} 
          required 
        />
      </div>
      <div className='place-order-right'>
        <div className='cart-total'>
          <h2>Cart Totals</h2>
          <div>
            <div className='cart-total-details'>
              <p>Subtotal</p>
              <p>Tk.{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className='cart-total-details'>
              <p>Delivery Fee</p>
              <p>Tk.{getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className='cart-total-details'>
              <b>Total</b>
              <b>Tk.{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
