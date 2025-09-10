import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Required for toast styling

import './App.css';

import NotFoundPage from './admin/commonElements/NotFoundPage.jsx';
import LoginPage from './admin/authentication/pages/LoginPage.jsx';
import MainPage from './admin/heroElements/MainPage.jsx';
import AdminVerification from './admin/security/AdminVerification.jsx';
import AdminReDirect from './admin/security/AdminReDirect.jsx';


// import TestingPayment from './Tsing/TestingPayment.jsx';

// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
// import TestingPayment from './TestingPayment';

// const stripePromise = loadStripe('pk_test_51R5K8GKrchCGsgebVJUW17xrLkCcopyHQJ30gKKVYZ5BWInCQYK75hkDuARp5NdudF80FDoEqCQvN823SZ4tBkHQ005FbTzTqS');


function App() {
  return (

    // <Elements stripe={stripePromise}>
    //   <TestingPayment orderDetails={
    //     {
    //       amount: 92*100, // $29.99
    //       currency: "usd",
    //       orderId: "689488a736a501cdd142f801",
    //       description: "Test Order"
    //     }
    //   } />
    // </Elements> 
    
    <>
      <Router>
        <Routes>
          
          {/* <Route path='crop/' element={CropImageDemo}/> */}
          <Route path='admin/' element={<AdminVerification><MainPage /></AdminVerification>} />
          <Route path="admin/login" element={<AdminReDirect> <LoginPage /></AdminReDirect>} />
          <Route path="admin/*" element={<NotFoundPage />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </>
  )
}

export default App

