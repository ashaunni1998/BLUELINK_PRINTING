import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Required for toast styling

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "./i18n";
import 'react-toastify/dist/ReactToastify.css'; // Required for toast styling


import './App.css';

import NotFoundPage from './admin/commonElements/NotFoundPage.jsx';
import LoginPage from './admin/authentication/pages/LoginPage.jsx';
import MainPage from './admin/heroElements/MainPage.jsx';
import AdminVerification from './admin/security/AdminVerification.jsx';
import AdminReDirect from './admin/security/AdminReDirect.jsx';


import Home from "./pages/user/Home";
import Cart from "./pages/user/Cart";
import Wishlist from "./pages/user/Wishlist";
import SignUp from "./pages/user/SignUp";
import Signin from "./pages/user/Signin";
import ForgotPassword from "./pages/user/ForgotPassword";
import ResetPassword from "./pages/user/ResetPassword";
import VerifyOtp from "./pages/user/VerifyOtp";
import EmailVerificationPage from "./pages/user/EmailVerificationPage";

import BusinessCards from "./pages/user/BusinessCard";
import BusinessCardDetails from "./pages/user/BusinessCardDetails";
import SuperBusinessCards from "./pages/user/SuperBusinessCards";

import PostCards from "./pages/user/PostCards";
import PostcardDetails from "./pages/user/PostcardDetails";

import Flyers from "./pages/user/Flyers";
import FlyerDetails from "./pages/user/FlyerDetails";

import Stickers from "./pages/user/Stickers";
import StickerDetails from "./pages/user/StickerDetails";

import GreetingCardDetails from "./pages/user/GreetingCardDetails";
import Stationery from "./pages/user/Stationery";
import PersonalizedGift from "./pages/user/PersonalizedGift";
import PersonalizedGiftDetails from "./pages/user/PersonalizedGiftDetails";

import TShirtPrinting from "./pages/user/TshirtPrinting";
import TShirtPrintingDetail from "./pages/user/TshirtPrintingDetail";

import ButtonBadges from "./pages/user/ButtonBadges";
import ButtonBadgesDetail from "./pages/user/ButtonBadgesDetail"; 

import Checkout from "./pages/user/Checkout";
import CheckoutForm from "./pages/user/CheckoutForm";
import Success from "./pages/user/Success";
import Cancel from "./pages/user/Cancel";
import OrderDetails from "./pages/user/OrderDetails";
import OrderConfirmation from "./pages/user/OrderConfirmation";
import Returns from "./pages/user/Returns";

import Blog from "./pages/user/Blog";
import HelpAndFaqPage from "./pages/user/HelpAndFaqPage";
import Contact from "./pages/user/Contact";
import Aboutus from "./pages/user/Aboutus";
import TermsAndCondition from "./pages/user/TermsAndCondition";
import PrivacyPolicy from "./pages/user/PrivacyPolicy";
import Review from "./pages/user/Review";
import AccountPage from "./pages/user/AccountPage";

import ProductDetail from "./pages/user/ProductDetail";
import Editor from "./pages/user/Editor";
import DesignSelector from "./pages/user/DesignSelector";
import OtherCardDesigner from "./pages/user/OtherCardDesigner";
import Sample from "./pages/user/Sample";
import CropImage from "./pages/user/CropImage.jsx";
import CustomerRequirement from "./pages/user/CustomerRequirement.jsx";
import UploadDesign from "./pages/user/UploadDesign.jsx";
import Failure from './pages/user/Failure.jsx';


import { AuthProvider } from './context/AuthContext.jsx';
import { TranslateProvider } from './context/TranslateProvider.jsx';



const stripePromise = loadStripe("pk_test_51R5K8GKrchCGsgebVJUW17xrLkCcopyHQJ30gKKVYZ5BWInCQYK75hkDuARp5NdudF80FDoEqCQvN823SZ4tBkHQ005FbTzTqS");




function App() {
  return (

    <AuthProvider>
      <TranslateProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/emailverification" element={<EmailVerificationPage />} />

            <Route path="/sign-in" element={<Signin />} />
            <Route path="/businessCard" element={<BusinessCards />} />
          <Route path="/businesscardDetails" element={<BusinessCardDetails />} />
          <Route path="/superbusinessCard" element={<SuperBusinessCards />} />

            <Route path="/postCards" element={<PostCards />} />
          <Route path="/postcarddetails" element={<PostcardDetails />} />

          <Route path="/flyers" element={<Flyers />} />
          <Route path="/flyerdetails" element={<FlyerDetails />} />

          <Route path="/stickers" element={<Stickers />} />
          <Route path="/stickerdetails" element={<StickerDetails />} />

            <Route path="/greetingcardDetails" element={<GreetingCardDetails />} />
          <Route path="/stationery" element={<Stationery />} />

          <Route path="/personalized-gift" element={<PersonalizedGift />} />
          <Route path="/personalizedgiftDetails" element={<PersonalizedGiftDetails />} />

          <Route path="/tshirtprinting" element={<TShirtPrinting />} />
          <Route path="/tshirtprintingdetail" element={<TShirtPrintingDetail />} />

          <Route path="/buttonbadges" element={<ButtonBadges />} />
          <Route path="/buttonbadgesdetails" element={<ButtonBadgesDetail />} />
          <Route path="/cropimage" element={<CropImage />} />
          <Route path="/customer-requirement" element={<CustomerRequirement />} />
          <Route path='/failure' element={<Failure/>}/>



            {/* ✅ Wrap checkout with Stripe Elements */}
            <Route
            path="/checkout"
            element={
              <Elements stripe={stripePromise}>
                <Checkout />
              </Elements>
            }
          />
          <Route 
            path="/checkout-form"
            element={
              <Elements stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            }
          />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/orderconfirmation" element={<OrderConfirmation />} />
          <Route path="/returns" element={<Returns />} />

          <Route path="/blog" element={<Blog />} />
          <Route path="/help" element={<HelpAndFaqPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<Aboutus />} />
          <Route path="/terms" element={<TermsAndCondition />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/review" element={<Review />} />
          <Route path="/account" element={<AccountPage />} />

          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/design-selector/:id" element={<DesignSelector />} />
          <Route path="/other-design-selector/:id" element={<OtherCardDesigner />} />
          <Route path="/sample" element={<Sample />} />
          <Route path="/upload-design/:productId" element={<UploadDesign />} />

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
      </TranslateProvider>
    </AuthProvider>

  )
}

export default App

