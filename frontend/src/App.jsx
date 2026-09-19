import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";


/* =========================================================
   PUBLIC PAGES
========================================================= */

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";


/* =========================================================
   X-FIT PERFORMANCE PAGES
========================================================= */

import Profile from "./pages/Profile";
import Assessment from "./pages/Assessment";
import Dashboard from "./pages/Dashboard";

import WorkoutPlan from "./pages/WorkoutPlan";

import MotionCheck from "./pages/MotionCheck";
import MotionCheckHistory from "./pages/MotionCheckHistory";

import ProgressDNA from "./pages/ProgressDNA";

import SafeMode from "./pages/SafeMode";

import DietPlan from "./pages/DietPlan";


/* =========================================================
   MEMBERSHIP
========================================================= */

import Membership from "./pages/Membership";


/* =========================================================
   X-FIT SHOP
========================================================= */

import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";


/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({ children }) {

  const accessToken =
    localStorage.getItem("access");


  if (!accessToken) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  return children;

}


/* =========================================================
   APP
========================================================= */

function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* =================================================
            PUBLIC ROUTES
        ================================================= */}

        <Route
          path="/"
          element={
            <Landing />
          }
        />


        <Route
          path="/register"
          element={
            <Register />
          }
        />


        <Route
          path="/login"
          element={
            <Login />
          }
        />


        {/* =================================================
            PROFILE
        ================================================= */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            ASSESSMENT
        ================================================= */}

        <Route
          path="/assessment"
          element={
            <ProtectedRoute>
              <Assessment />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            DASHBOARD
        ================================================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            WORKOUT PLAN
        ================================================= */}

        <Route
          path="/workout-plan"
          element={
            <ProtectedRoute>
              <WorkoutPlan />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            MOTIONCHECK
        ================================================= */}

        <Route
          path="/motioncheck"
          element={
            <ProtectedRoute>
              <MotionCheck />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            MOTIONCHECK HISTORY
        ================================================= */}

        <Route
          path="/motioncheck-history"
          element={
            <ProtectedRoute>
              <MotionCheckHistory />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            PROGRESS DNA
        ================================================= */}

        <Route
          path="/progress-dna"
          element={
            <ProtectedRoute>
              <ProgressDNA />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            SAFE MODE
        ================================================= */}

        <Route
          path="/safe-mode"
          element={
            <ProtectedRoute>
              <SafeMode />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            DIET PLAN
        ================================================= */}

        <Route
          path="/diet-plan"
          element={
            <ProtectedRoute>
              <DietPlan />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            MEMBERSHIP
        ================================================= */}

        <Route
          path="/membership"
          element={
            <ProtectedRoute>
              <Membership />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            X-FIT SHOP
        ================================================= */}

        <Route
          path="/shop"
          element={
            <ProtectedRoute>
              <Shop />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            PRODUCT DETAILS
        ================================================= */}

        <Route
          path="/shop/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            CART
        ================================================= */}

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            CHECKOUT / SHIPPING
        ================================================= */}

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            UPI PAYMENT
        ================================================= */}

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            ORDER SUCCESS
        ================================================= */}

        <Route
          path="/order-success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            FALLBACK
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />


      </Routes>

    </BrowserRouter>

  );

}


export default App;