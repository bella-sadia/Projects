import React, { useEffect, useState } from 'react';
import './DeliveryManagement.css';

const DeliveryManagement = () => {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [selectedPartner, setSelectedPartner] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/order/list');
        const data = await response.json();
        console.log("Fetched orders:", data);
  
        if (data.success && Array.isArray(data.data)) {
          setOrders(data.data); // Correctly set orders
        } else {
          console.error('Expected an array but got:', data);
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]); // Fallback to empty array on error
      }
    };
  
    const fetchPartners = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/delivery/available');
        const data = await response.json();
        console.log("Fetched partners:", data);
  
        if (data.success && Array.isArray(data.data)) {
          setPartners(data.data); // Correctly set partners
        } else {
          console.error('Expected an array but got:', data);
          setPartners([]);
        }
      } catch (error) {
        console.error('Error fetching delivery partners:', error);
        setPartners([]);
      }
    };
  
    fetchOrders();
    fetchPartners();
  }, []);
  

  const handleAssignPartner = async () => {
    if (!selectedOrder || !selectedPartner) {
      setMessage('Please select both an order and a delivery partner.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/delivery/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: selectedOrder, partnerId: selectedPartner }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(result.message || 'Delivery partner assigned successfully!');
      } else {
        setMessage(result.message || 'Error assigning delivery partner');
      }
    } catch (error) {
      console.error('Error assigning partner:', error);
      setMessage('Error assigning delivery partner');
    }
  };

  return (
    <div className="delivery-management-container">
      <h2>Delivery Management</h2>
      <div className="assign-section">
        <label htmlFor="order-select">Select Order:</label>
        <select
          id="order-select"
          value={selectedOrder}
          onChange={(e) => setSelectedOrder(e.target.value)}
        >
          <option value="">Select an order</option>
          {Array.isArray(orders) &&
            orders.map((order) => (
              <option key={order._id} value={order._id}>
                {order.items.map((item) => item.name).join(', ')} - {order.amount}
              </option>
            ))}
        </select>

        <label htmlFor="partner-select">Select Delivery Partner:</label>
        <select
          id="partner-select"
          value={selectedPartner}
          onChange={(e) => setSelectedPartner(e.target.value)}
        >
          <option value="">Select a partner</option>
  {partners.length > 0 &&
    partners.map((partner) => (
      <option key={partner._id} value={partner._id}>
        {partner.name} - {partner.phone_number}
      </option>
    ))}
        </select>

        <button id="assign-btn" onClick={handleAssignPartner}>
          Assign Partner
        </button>
      </div>

      <div id="message" className="message">
        {message}
      </div>
    </div>
  );
};

export default DeliveryManagement;
