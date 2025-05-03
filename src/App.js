import React, { useEffect } from 'react';
import { messaging } from './firebase';
import { getToken } from 'firebase/messaging';
import { Routes, Route } from 'react-router-dom';
import Home from './views/user/Home';
import PhoneInput from './views/user/phoneAuth/PhoneInput';
import OTPVerification from './views/user/phoneAuth/OTPVerification';
import SelectTable from './views/user/SelectTable';
import PaymentButton from './component/PaymentButton';
import Menu from './views/user/Menu';
import Cart from './views/user/Cart';
import OrderHistory from './views/user/OrderHistory';
import PaymentStatusPage from './views/user/PaymentStatus';
import TrackOrder from './views/user/TrackOrder';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './protection-layer/UserProtectRoute';
import ManagerDashboard from './views/manager/Home';
import ManagerTable from './views/manager/Table';
import ManageMenu from './views/manager/Menu';
import ManagerAnalytics from './views/manager/Analytics';
import ManagerLogin from './views/manager/ManagerLogin';
import ManagerProtectedRoute from './protection-layer/ManagerProtectedRoute';
import { ManagerProvider } from './context/ManagerContext';
import ManagerLayout from './views/manager/ManagerLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log('Notification permission granted.');
        const serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        const token = await getToken(messaging, {
          vapidKey: 'BNnHog6nqFWqzihTsxuJB41f6UMb1uT1GP8qYVrsmU1U2QhxFWNk7ct5lWj6PM-WnTHL7T3XbgUowd-wBsQR-cU',
          serviceWorkerRegistration,
        });
        console.log('FCM Token:', token);
        // Optionally, send this token to the backend to save for later use
      } else {
        alert('You denied notification permission.');
      }
    } catch (error) {
      console.error('Error requesting permission or getting FCM token:', error);
    }
  };

  useEffect(() => {
    requestPermission();
  }, []); // Ensure this runs only once when the component mounts

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />

      {/* User Routes */}
      <UserProvider>
        <Routes>
          <Route path="/u" element={<Home />} />
          <Route path="/u/phone" element={<PhoneInput />} />
          <Route path="/u/verify-otp" element={<OTPVerification />} />
          <Route path="/u/select-table" element={<SelectTable />} />
          <Route path="/u/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
          <Route path="/u/payment" element={<PaymentButton />} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/u/order-history" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
          <Route path="/u/payment-status/:status" element={<PaymentStatusPage />} />
          <Route path="/u/track-order/:order_id" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />
        </Routes>
      </UserProvider>

      {/* Manager Routes */}
      <ManagerProvider>
        <Routes>
          <Route path="/m/login" element={<ManagerLogin />} />
          <Route path="/m/dashboard" element={<ManagerProtectedRoute><ManagerLayout><ManagerDashboard /></ManagerLayout></ManagerProtectedRoute>} />
          <Route path="/m/menu" element={<ManagerProtectedRoute><ManagerLayout><ManageMenu /></ManagerLayout></ManagerProtectedRoute>} />
          <Route path="/m/tables" element={<ManagerProtectedRoute><ManagerLayout><ManagerTable /></ManagerLayout></ManagerProtectedRoute>} />
          <Route path="/m/analytics" element={<ManagerProtectedRoute><ManagerLayout><ManagerAnalytics /></ManagerLayout></ManagerProtectedRoute>} />
        </Routes>
      </ManagerProvider>
    </>
  );
}

export default App;
