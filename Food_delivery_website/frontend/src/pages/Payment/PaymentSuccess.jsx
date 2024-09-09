import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext.jsx';  // Adjust the path if necessary
import './PaymentSuccess.css';  // Import the CSS file

const PaymentSuccess = () => {
    const location = useLocation();
    const { url } = useContext(StoreContext);  // Get the URL from StoreContext

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const success = params.get('success');
        const orderId = params.get('orderId');

        if (success && orderId) {
            fetch(`${url}/api/order/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId, success }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Verification response:', data);
                if (data.success) {
                    alert('Payment Successful!');
                    setTimeout(() => {
                        window.location.replace('/thankyou'); // Redirect to the thank you page
                    }, 1000);  // Small delay to ensure the request is processed
                } else {
                    alert('Payment Failed or Order Not Found!');
                    window.location.replace('/fail'); // Redirect to a failure page
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred during payment verification.');
                window.location.replace('/fail'); // Redirect to a failure page
            });
        } else {
            alert('Invalid verification parameters.');
            window.location.replace('/'); // Redirect to the homepage
        }
    }, [location, url]);

    return (
        <div className='verify'>
            <div className='spinner'></div>
        </div>
    );
};

export default PaymentSuccess;
