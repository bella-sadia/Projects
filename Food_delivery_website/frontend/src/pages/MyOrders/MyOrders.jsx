import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './MyOrders.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const { url, token, user } = useContext(StoreContext); // Ensure user is also retrieved from context
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        try {
            console.log("Fetching orders for user ID:", user._id); // Log user ID for debugging
            const response = await axios.post(
                `${url}/api/order/userorders`, 
                { userId: user._id },  // Ensure userId is sent in the payload
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Ensure correct token format
                    }
                }
            );
            if (response.data.success) {
                setData(response.data.data);
                console.log(response.data.data);
            } else {
                console.error('Failed to fetch orders:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching orders:', error.message);
        }
    };

    useEffect(() => {
        if (token && user && user._id) {
            fetchOrders();
        }
    }, [token, user]); // Ensure fetchOrders is called only when token and user are available

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className='container'>
                {data.map((order,index)=>{
                    return (
                        <div key={index} className='my-orders-order'>
                            <img src={assets.parcel_icon} alt=''/>
                            <p>{order.items.map((item,index)=>{
                                if(index === order.items.length-1) {
                                    return item.name+" x "+item.quantity
                                }
                                else{
                                    return item.name+" x "+item.quantity+", "
                                }
                            })}</p>
                            <p>Tk{order.amount}.00</p>
                            <p>Items: {order.items.length}</p>
                            <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                            <button onClick={fetchOrders}>Track Order</button>

                        </div>
                    )
                })}
            </div>
           
        </div>
    );
};

export default MyOrders;
