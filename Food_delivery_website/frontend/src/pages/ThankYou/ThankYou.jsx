import React from 'react';
import { Link } from 'react-router-dom';

const ThankYou = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Thank You for Your Purchase!</h1>
            <p>Your order has been successfully placed.</p>
            <p>
                Return to <Link to="/">Home</Link> or view your <Link to="/myorders">Order History</Link>.
            </p>
        </div>
    );
};

export default ThankYou;
