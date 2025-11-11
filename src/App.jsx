// App.jsx (updated)
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "./i18n";
import './App.css';
import ScrollToTop from "./ScrollToTop";
import NotFound from "./pages/user/NotFound"; 

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
import OrderDetail from "./pages/user/OrderDetail";
import OrderConfirmation from "./pages/user/OrderConfirmation";
import Returns from "./pages/user/Returns";

import Blog from "./pages/user/Blog";
import BlogDetail from './pages/user/BlogDetail.jsx';
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



import CustomFlyerPage from './pages/user/CustomFlyerPage';
import AllProducts from './pages/user/AllProducts.jsx';

import { AuthProvider } from '../src/context/AuthContext.jsx';
import { TranslateProvider } from './context/TranslateProvider.jsx';

import RequireAuth from '../src/pages/user/components/RequireAuth.jsx'; // <- new

const stripePromise = loadStripe("pk_test_51SBJuxCJSue85a5PyEGb1wMz4IxhMDda5ZtNgcwQeeFf0eb5Y0QS8b0ZDybTQlNlGUH2IKQbC9k3fQ6HGvANnd4600RY0Yju3T");

function App() {
  return (
    <AuthProvider>
      <TranslateProvider>
        <Router>
           <ScrollToTop />  
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
             <Route path="*" element={<NotFound />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/sign-in" element={<Signin />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/emailverification" element={<EmailVerificationPage />} />

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
            <Route path='/allProducts/:categoryId' element={<AllProducts/>}/>

            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/help" element={<HelpAndFaqPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<Aboutus />} />
            <Route path="/terms" element={<TermsAndCondition />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/review" element={<Review />} />

            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/editor/:id" element={<Editor />} />
            <Route path="/design-selector/:id" element={<DesignSelector />} />
            <Route path="/other-design-selector/:id" element={<OtherCardDesigner />} />
            <Route path="/sample" element={<Sample />} />
<Route path="/custom-flyer" element={<CustomFlyerPage />} />
            {/* Protected routes (Require auth) */}
            <Route
              path="/cart"
              element={
                <RequireAuth>
                  <Cart />
                </RequireAuth>
              }
            />
            <Route
              path="/wishlist"
              element={
                <RequireAuth>
                  <Wishlist />
                </RequireAuth>
              }
            />
            <Route
              path="/account"
              element={
                <RequireAuth>
                  <AccountPage />
                </RequireAuth>
              }
            />
            <Route
              path="/orders/:orderId"
              element={
                <RequireAuth>
                  <OrderDetail />
                </RequireAuth>
              }
            />
            <Route
              path="/orderconfirmation"
              element={
                <RequireAuth>
                  <OrderConfirmation />
                </RequireAuth>
              }
            />

            {/* Stripe-wrapped checkout - protected */}
            <Route
              path="/checkout"
              element={
                <RequireAuth>
                  <Elements stripe={stripePromise}>
                    <Checkout />
                  </Elements>
                </RequireAuth>
              }
            />
            <Route
              path="/checkout-form"
              element={
                <RequireAuth>
                  <Elements stripe={stripePromise}>
                    <CheckoutForm />
                  </Elements>
                </RequireAuth>
              }
            />

            <Route
              path="/upload-design"
              element={
                <RequireAuth>
                  <UploadDesign />
                </RequireAuth>
              }
            />
            <Route
              path="/upload-design/:productId"
              element={
                <RequireAuth>
                  <UploadDesign />
                </RequireAuth>
              }
            />

            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/returns" element={<Returns />} />

            {/* Admin */}
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
  );
}

export default App;