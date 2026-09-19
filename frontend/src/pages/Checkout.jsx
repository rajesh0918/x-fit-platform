import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import apiFetch from "../services/api";
import CinematicBackground from "../components/futuristic/CinematicBackground";


/* =========================================================
   CHECKOUT PAGE
========================================================= */

function Checkout() {

  const navigate = useNavigate();


  /* =======================================================
     CART
  ======================================================= */

  const [cart, setCart] = useState([]);


  /* =======================================================
     FORM
  ======================================================= */

  const [form, setForm] = useState({

    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",

  });


  /* =======================================================
     ERRORS
  ======================================================= */

  const [errors, setErrors] = useState({});

  /* =======================================================
     ORDER SUBMISSION
  ======================================================= */

  const [processingOrder, setProcessingOrder] = useState(false);
  const [serverError, setServerError] = useState("");


  /* =======================================================
     LOAD CART
  ======================================================= */

  useEffect(() => {

    const savedCart =
      JSON.parse(
        localStorage.getItem(
          "xfit_cart"
        ) || "[]"
      );


    if (
      !Array.isArray(savedCart) ||
      savedCart.length === 0
    ) {

      navigate("/cart");

      return;

    }


    setCart(savedCart);

  }, [navigate]);


  /* =======================================================
     INPUT HANDLER
  ======================================================= */

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );


    setErrors(
      (previous) => ({
        ...previous,
        [name]: "",
      })
    );

  };


  /* =======================================================
     SUBTOTAL
  ======================================================= */

  const subtotal = useMemo(() => {

    return cart.reduce(
      (
        total,
        item
      ) =>

        total +
        Number(item.price) *
        Number(item.quantity),

      0
    );

  }, [cart]);


  /* =======================================================
     DELIVERY
  ======================================================= */

  const delivery =
    subtotal >= 1999
      ? 0
      : 99;


  /* =======================================================
     TOTAL
  ======================================================= */

  const total =
    subtotal +
    delivery;


  /* =======================================================
     TOTAL ITEMS
  ======================================================= */

  const totalItems =
    cart.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(item.quantity),

      0
    );


  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateForm = () => {

    const newErrors = {};


    if (
      !form.fullName.trim()
    ) {

      newErrors.fullName =
        "Full name is required.";

    }


    if (
      !form.phone.trim()
    ) {

      newErrors.phone =
        "Phone number is required.";

    } else if (
      !/^[6-9]\d{9}$/.test(
        form.phone.trim()
      )
    ) {

      newErrors.phone =
        "Enter a valid 10-digit Indian mobile number.";

    }


    if (
      !form.address.trim()
    ) {

      newErrors.address =
        "Delivery address is required.";

    }


    if (
      !form.city.trim()
    ) {

      newErrors.city =
        "City is required.";

    }


    if (
      !form.state.trim()
    ) {

      newErrors.state =
        "State is required.";

    }


    if (
      !form.pincode.trim()
    ) {

      newErrors.pincode =
        "PIN code is required.";

    } else if (
      !/^\d{6}$/.test(
        form.pincode.trim()
      )
    ) {

      newErrors.pincode =
        "Enter a valid 6-digit PIN code.";

    }


    setErrors(
      newErrors
    );


    return (
      Object.keys(
        newErrors
      ).length === 0
    );

  };


  /* =======================================================
     PLACE ORDER
  ======================================================= */

  const handlePlaceOrder = async (
    event
  ) => {

    event.preventDefault();

    if (processingOrder) {
      return;
    }

    setServerError("");

    if (!validateForm()) {
      return;
    }

    setProcessingOrder(true);

    try {

      /*
        Send the checkout information to Django.

        IMPORTANT:
        The frontend subtotal, delivery and total
        are sent only for display/context.
        Django recalculates the real price from
        the Product database.
      */

      const response = await apiFetch(
        "/shop/orders/create/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            customer: {
              fullName:
                form.fullName.trim(),

              phone:
                form.phone.trim(),

              address:
                form.address.trim(),

              city:
                form.city.trim(),

              state:
                form.state.trim(),

              pincode:
                form.pincode.trim(),
            },

            items: cart,
          }),
        }
      );

      if (!response) {
        return;
      }

      const data = await response.json();

      if (!response.ok) {

        setServerError(
          data.error ||
          data.detail ||
          "Unable to create your order. Please try again."
        );

        return;
      }

      if (!data.order_id) {

        setServerError(
          "Order was created but no order ID was returned. Please contact support."
        );

        return;
      }

      /*
        Store the server-created order information.
        Payment.jsx will use this order ID in the
        next step when we connect payment proof.
      */

      const checkoutData = {

        orderId:
          data.order_id,

        customer: {
          fullName:
            form.fullName.trim(),

          phone:
            form.phone.trim(),

          address:
            form.address.trim(),

          city:
            form.city.trim(),

          state:
            form.state.trim(),

          pincode:
            form.pincode.trim(),
        },

        items: cart,

        /* Use Django's calculated values. */
        subtotal:
          Number(data.subtotal),

        delivery:
          Number(data.delivery),

        total:
          Number(data.total),

        paymentStatus:
          data.payment_status,

        orderStatus:
          data.order_status,

        createdAt:
          data.created_at ||
          new Date().toISOString(),
      };

      localStorage.setItem(
        "xfit_checkout",
        JSON.stringify(checkoutData)
      );

      navigate("/payment");

    } catch (error) {

      console.error(
        "Shop order creation error:",
        error
      );

      setServerError(
        "Could not connect to the X-FIT order server. Make sure Django is running."
      );

    } finally {

      setProcessingOrder(false);

    }

  };


  /* =======================================================
     IF CART IS STILL LOADING
  ======================================================= */

  if (
    cart.length === 0
  ) {

    return null;

  }


  return (

    <div className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden">


      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <CinematicBackground />


      {/* ===================================================
          NAVBAR
      =================================================== */}

      <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-black/60 backdrop-blur-2xl border-b border-white/5">

        <div className="max-w-[1500px] mx-auto h-full px-5 md:px-10 flex items-center justify-between">


          {/* LOGO */}

          <button

            onClick={() =>
              navigate(
                "/shop"
              )
            }

            className="text-[#ccff00] text-4xl font-black tracking-[-0.06em]"

          >

            X-FIT

          </button>


          {/* CHECKOUT STATUS */}

          <div className="hidden sm:flex items-center gap-3 text-[9px] tracking-[0.2em] font-black">

            <span className="text-[#ccff00]">

              01 CART

            </span>


            <span className="text-[#444]">

              →

            </span>


            <span className="text-white">

              02 SHIPPING

            </span>


            <span className="text-[#444]">

              →

            </span>


            <span className="text-[#555]">

              03 PAYMENT

            </span>

          </div>


          {/* PROFILE */}

          <button

            onClick={() =>
              navigate(
                "/profile"
              )
            }

            className="w-10 h-10 rounded-full border border-white/10 text-[#ccff00] hover:bg-[#ccff00] hover:text-black transition"

          >

            ◉

          </button>

        </div>

      </nav>


      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="relative z-20 max-w-[1500px] mx-auto px-5 md:px-10 pt-[115px] pb-24">


        {/* HEADER */}

        <div className="mb-8">

          <p className="text-[#ccff00] text-[9px] tracking-[0.28em] font-black">

            X-FIT // SECURE CHECKOUT

          </p>


          <h1 className="text-5xl md:text-7xl font-black tracking-[-0.06em] mt-2">

            SHIPPING
            <br />

            DETAILS

          </h1>


          <p className="text-[#777e73] mt-3">

            Tell us where to send
            your X-FIT equipment.

          </p>

        </div>


        {/* =================================================
            CHECKOUT GRID
        ================================================= */}

        <div className="grid xl:grid-cols-[1fr_420px] gap-6">


          {/* ===============================================
              SHIPPING FORM
          =============================================== */}

          <form

            onSubmit={
              handlePlaceOrder
            }

            className="rounded-[28px] border border-white/10 bg-black/45 backdrop-blur-xl p-6 md:p-9"

          >


            {/* SECTION HEADER */}

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[#ccff00] text-[9px] tracking-[0.2em]">

                  DELIVERY

                </p>


                <h2 className="text-3xl font-black mt-1">

                  SHIPPING ADDRESS

                </h2>

              </div>


              <div className="text-[#ccff00] text-2xl">

                📦

              </div>

            </div>


            {/* FORM */}

            <div className="grid md:grid-cols-2 gap-5 mt-8">


              {/* FULL NAME */}

              <InputField

                label="FULL NAME"

                name="fullName"

                value={
                  form.fullName
                }

                onChange={
                  handleChange
                }

                placeholder="Enter your full name"

                error={
                  errors.fullName
                }

                fullWidth

              />


              {/* PHONE */}

              <InputField

                label="PHONE NUMBER"

                name="phone"

                value={
                  form.phone
                }

                onChange={
                  handleChange
                }

                placeholder="10-digit mobile number"

                error={
                  errors.phone
                }

                type="tel"

                maxLength={10}

              />


              {/* ADDRESS */}

              <InputField

                label="FULL ADDRESS"

                name="address"

                value={
                  form.address
                }

                onChange={
                  handleChange
                }

                placeholder="House / Flat / Street / Area"

                error={
                  errors.address
                }

                fullWidth

                textarea

              />


              {/* CITY */}

              <InputField

                label="CITY"

                name="city"

                value={
                  form.city
                }

                onChange={
                  handleChange
                }

                placeholder="e.g. Bhubaneswar"

                error={
                  errors.city
                }

              />


              {/* STATE */}

              <InputField

                label="STATE"

                name="state"

                value={
                  form.state
                }

                onChange={
                  handleChange
                }

                placeholder="e.g. Odisha"

                error={
                  errors.state
                }

              />


              {/* PIN */}

              <InputField

                label="PIN CODE"

                name="pincode"

                value={
                  form.pincode
                }

                onChange={
                  handleChange
                }

                placeholder="6-digit PIN code"

                error={
                  errors.pincode
                }

                type="text"

                maxLength={6}

              />

            </div>


            {/* DELIVERY NOTE */}

            <div className="mt-7 rounded-2xl border border-[#ccff00]/15 bg-[#ccff00]/5 p-5">

              <div className="flex gap-3">

                <span className="text-[#ccff00]">

                  ✓

                </span>


                <div>

                  <p className="font-black text-sm">

                    X-FIT DELIVERY

                  </p>


                  <p className="text-[#777e73] text-xs mt-1 leading-relaxed">

                    Your order will be
                    shipped to the address
                    provided above.
                    Delivery charges are
                    calculated automatically
                    based on your cart value.

                  </p>

                </div>

              </div>

            </div>


            {/* SERVER ERROR */}

            {serverError && (

              <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/5 p-4">

                <p className="text-red-400 text-sm leading-relaxed">
                  {serverError}
                </p>

              </div>

            )}


            {/* BUTTONS */}

            <div className="flex flex-col sm:flex-row gap-3 mt-8">


              <button

                type="button"

                onClick={() =>
                  navigate(
                    "/cart"
                  )
                }

                className="px-7 py-4 rounded-xl border border-white/10 text-[#92998c] font-black hover:text-white hover:border-white/20 transition"

              >

                ← BACK TO CART

              </button>


              <button

                type="submit"

                disabled={processingOrder}

                className={`flex-1 py-4 rounded-xl bg-[#ccff00] text-black font-black transition ${
                  processingOrder
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-[#b8e600]"
                }`}

              >

                {processingOrder
                  ? "CREATING ORDER..."
                  : "CONTINUE TO PAYMENT →"}

              </button>

            </div>

          </form>


          {/* ===============================================
              ORDER SUMMARY
          =============================================== */}

          <aside className="xl:sticky xl:top-28 h-fit rounded-[28px] border border-white/10 bg-black/55 backdrop-blur-xl p-7">


            <p className="text-[#ccff00] text-[9px] tracking-[0.25em] font-black">

              ORDER SUMMARY

            </p>


            <h2 className="text-3xl font-black mt-2">

              {totalItems}{" "}

              {totalItems === 1
                ? "ITEM"
                : "ITEMS"}

            </h2>


            {/* ITEMS */}

            <div className="mt-7 space-y-4 max-h-[360px] overflow-y-auto pr-1">

              {cart.map(
                (
                  item,
                  index
                ) => (

                  <div

                    key={`${item.productId}-${item.color}-${item.size}-${index}`}

                    className="flex gap-3 pb-4 border-b border-white/5"

                  >

                    {/* IMAGE */}

                    <div className="w-16 h-16 shrink-0 rounded-xl bg-gradient-to-b from-[#202020] to-[#080808] border border-white/10 flex items-center justify-center">

                      <span className="text-[#ccff00] text-[10px] font-black">

                        X-FIT

                      </span>

                    </div>


                    {/* INFO */}

                    <div className="min-w-0 flex-1">

                      <p className="font-bold text-sm truncate">

                        {item.name}

                      </p>


                      <p className="text-[#62695f] text-[10px] mt-1">

                        {item.color}
                        {" • "}
                        Size{" "}
                        {item.size}

                      </p>


                      <p className="text-[#777e73] text-[10px] mt-1">

                        Qty:{" "}
                        {item.quantity}

                      </p>

                    </div>


                    {/* PRICE */}

                    <p className="text-[#ccff00] font-black text-sm whitespace-nowrap">

                      ₹
                      {(
                        Number(
                          item.price
                        ) *
                        Number(
                          item.quantity
                        )
                      ).toLocaleString(
                        "en-IN"
                      )}

                    </p>

                  </div>

                )
              )}

            </div>


            {/* PRICE */}

            <div className="space-y-4 mt-6">

              <SummaryRow

                label="Subtotal"

                value={`₹${subtotal.toLocaleString(
                  "en-IN"
                )}`}

              />


              <SummaryRow

                label="Delivery"

                value={
                  delivery ===
                  0

                    ? "FREE"

                    : `₹${delivery}`
                }

                lime={
                  delivery ===
                  0
                }

              />

            </div>


            {/* TOTAL */}

            <div className="border-t border-white/10 mt-6 pt-6 flex justify-between items-end">

              <div>

                <p className="text-[#5f665c] text-[9px] tracking-[0.18em]">

                  PAYABLE

                </p>


                <p className="text-[#777e73] text-xs mt-1">

                  Final order amount

                </p>

              </div>


              <p className="text-4xl font-black text-[#ccff00]">

                ₹
                {total.toLocaleString(
                  "en-IN"
                )}

              </p>

            </div>


            {/* SECURE */}

            <div className="grid grid-cols-3 gap-2 mt-6">

              <MiniInfo
                icon="🔒"
                text="SECURE"
              />

              <MiniInfo
                icon="📦"
                text="TRACKABLE"
              />

              <MiniInfo
                icon="✓"
                text="X-FIT"
              />

            </div>


            <p className="text-[#555c52] text-[10px] text-center mt-5 leading-relaxed">

              You will review your
              payment details on the
              next step before the
              order is submitted.

            </p>

          </aside>

        </div>

      </main>

    </div>

  );

}


/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  maxLength,
  fullWidth = false,
  textarea = false,
}) {

  const commonClasses =
    "w-full rounded-xl border bg-white/[0.03] px-4 py-4 text-white placeholder:text-[#4f554c] outline-none transition focus:border-[#ccff00]/60 focus:bg-[#ccff00]/[0.03]";


  return (

    <div
      className={
        fullWidth
          ? "md:col-span-2"
          : ""
      }
    >

      <label className="block">

        <span className="text-[#777e73] text-[9px] tracking-[0.18em] font-black">

          {label}

        </span>


        {textarea ? (

          <textarea

            name={name}

            value={value}

            onChange={onChange}

            placeholder={
              placeholder
            }

            rows={4}

            className={`${commonClasses} resize-none mt-2 ${
              error
                ? "border-red-500/70"
                : "border-white/10"
            }`}

          />

        ) : (

          <input

            type={type}

            name={name}

            value={value}

            onChange={onChange}

            placeholder={
              placeholder
            }

            maxLength={
              maxLength
            }

            className={`${commonClasses} mt-2 ${
              error
                ? "border-red-500/70"
                : "border-white/10"
            }`}

          />

        )}

      </label>


      {error && (

        <p className="text-red-400 text-xs mt-2">

          {error}

        </p>

      )}

    </div>

  );

}


/* =========================================================
   SUMMARY ROW
========================================================= */

function SummaryRow({
  label,
  value,
  lime = false,
}) {

  return (

    <div className="flex justify-between items-center">

      <span className="text-[#777e73]">

        {label}

      </span>


      <span
        className={
          lime
            ? "text-[#ccff00] font-black"
            : "font-bold"
        }
      >

        {value}

      </span>

    </div>

  );

}


/* =========================================================
   MINI INFO
========================================================= */

function MiniInfo({
  icon,
  text,
}) {

  return (

    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-center">

      <p className="text-[#ccff00] text-sm">

        {icon}

      </p>


      <p className="text-[#555c52] text-[7px] tracking-[0.14em] mt-1">

        {text}

      </p>

    </div>

  );

}


export default Checkout;