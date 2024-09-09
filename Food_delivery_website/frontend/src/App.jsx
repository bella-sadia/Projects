import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import StoreContextProvider from './Context/StoreContext.jsx'; // Import the context provider
import PaymentFail from './pages/Payment/PaymentFail.jsx';
import PaymentSuccess from './pages/Payment/PaymentSuccess.jsx';
import ThankYou from './pages/ThankYou/ThankYou.jsx';
import MyOrders from './pages/MyOrders/MyOrders.jsx';


const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <StoreContextProvider> {/* Wrap the component tree with the context provider */}
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className='app'>
        <NavBar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/fail' element={<PaymentFail/>} />
          <Route path='/verify' element={<PaymentSuccess/>} />
          <Route path='/thankyou' element={<ThankYou/>} />
          <Route path='/myorders' element={<MyOrders/>} />

        </Routes>
      </div>
      <Footer />
    </StoreContextProvider>
  );
};

export default App;
