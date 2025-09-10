import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Required for toast styling

import './App.css';

import NotFoundPage from './admin/commonElements/NotFoundPage.jsx';
import LoginPage from './admin/authentication/pages/LoginPage.jsx';
import MainPage from './admin/heroElements/MainPage.jsx';
import AdminVerification from './admin/security/AdminVerification.jsx';
import AdminReDirect from './admin/security/AdminReDirect.jsx';



function App() {
  return (

    
      <Router>
        <Routes>

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
    
  )
}

export default App

