import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import LoginPage from './assets/Pages/LoginPage';
import CreateAccountPage from './assets/Pages/CreateAccountPage';
import DashboardPage from './assets/Pages/DashboardPage';
import AdminLoginPage from './assets/Pages/AdminLoginPage';
import HomePage from './assets/Pages/HomePage';
import ServicesPage from './assets/Pages/ServicesPage';
import AboutPage from './assets/Pages/AboutPage';
import VehicleSearchPage from './assets/Pages/VehicleSearchPage';
import VehicleDetailsPage from './assets/Pages/VehicleDetailsPage';
import AdminDashboardPage from './assets/Pages/AdminDashboardPage';
import AccountSettingsPage from './assets/Pages/AccountSettingsPage';
import BookingsPage from './assets/Pages/BookingsPage';
import CheckoutPage from './assets/Pages/CheckoutPage';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Success from './assets/Pages/Success';
import Failure from './assets/Pages/Failure';
import PaymentComponent from './assets/Pages/Payment';


const AppLayout = () => {
  return (
    <AuthProvider>
      <AdminProvider>
        <div className="app-container">
          <Outlet />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </AdminProvider>
    </AuthProvider>
  );
};

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: <HomePage />
        },
        {
          path: "login",
          element: <LoginPage />
        },
        {
          path: "register",
          element: <CreateAccountPage />
        },
        {
          path: "admin/login",
          element: <AdminLoginPage />
        },
        {
          path: "dashboard",
          element: <ProtectedRoute><DashboardPage /></ProtectedRoute>
        },
        {
          path: "services",
          element: <ServicesPage />
        },
        {
          path: "about",
          element: <AboutPage />
        },
        {
          path: "vehicles/:type",
          element: <ProtectedRoute><VehicleSearchPage /></ProtectedRoute>
        },
        {
          path: "vehicles/:type/:id",
          element: <ProtectedRoute><VehicleDetailsPage /></ProtectedRoute>
        },
        {
          path: "admin/dashboard",
          element: <ProtectedRoute><AdminDashboardPage /></ProtectedRoute>
        },
        {
          path: "account/settings",
          element: <ProtectedRoute><AccountSettingsPage /></ProtectedRoute>
        },
        {
          path: "bookings",
          element: <ProtectedRoute><BookingsPage /></ProtectedRoute>
        },
        {
          path: "checkout/:type/:id",
          element: <ProtectedRoute><CheckoutPage /></ProtectedRoute>
        },
{
  path: "/",
  element: <PaymentComponent />

},


        {
          path: "/payment-success",
          element: <Success />
        },
        {
          path: "/payment-failure",
          element: <Failure />
        }
      ]
    }
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_normalizeFormMethod: true
    }
  }
);

const App = () => {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
};

export default App;
