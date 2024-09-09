import React from 'react';
import { useLocation } from 'react-router-dom';

const PaymentFail = () => {
    const location = useLocation();
    const message = new URLSearchParams(location.search).get('message') || "Your payment failed. Please try again.";

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Payment Failed</h1>
            <p>{message}</p>
            <a href="/">Go Back to Home</a>
        </div>
    );
};

export default PaymentFail;
