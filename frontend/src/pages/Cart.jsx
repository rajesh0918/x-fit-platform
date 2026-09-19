import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import CinematicBackground from "../components/futuristic/CinematicBackground";


/* =========================================================
   CART PAGE
========================================================= */

function Cart() {

  const navigate = useNavigate();


  /* =======================================================
     CART STATE
  ======================================================= */

  const [cart, setCart] = useState([]);


  /* =======================================================
     LOAD CART
  ======================================================= */

  useEffect(() => {

    loadCart();

    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener(
      "xfit-cart-updated",
      handleCartUpdate
    );

    window.addEventListener(
      "storage",
      handleCartUpdate
    );

    return () => {

      window.removeEventListener(
        "xfit-cart-updated",
        handleCartUpdate
      );

      window.removeEventListener(
        "storage",
        handleCartUpdate
      );

    };

  }, []);


  /* =======================================================
     LOAD CART FUNCTION
  ======================================================= */

  const loadCart = () => {

    const savedCart =
      JSON.parse(
        localStorage.getItem(
          "xfit_cart"
        ) || "[]"
      );

    setCart(
      Array.isArray(savedCart)
        ? savedCart
        : []
    );

  };


  /* =======================================================
     SAVE CART
  ======================================================= */

  const saveCart = (newCart) => {

    localStorage.setItem(
      "xfit_cart",
      JSON.stringify(
        newCart
      )
    );

    setCart(newCart);

    window.dispatchEvent(
      new Event(
        "xfit-cart-updated"
      )
    );

  };


  /* =======================================================
     INCREASE QUANTITY
  ======================================================= */

  const increaseQuantity = (
    index
  ) => {

    const newCart = [
      ...cart
    ];

    newCart[index].quantity += 1;

    saveCart(newCart);

  };


  /* =======================================================
     DECREASE QUANTITY
  ======================================================= */

  const decreaseQuantity = (
    index
  ) => {

    const newCart = [
      ...cart
    ];


    if (
      newCart[index].quantity > 1
    ) {

      newCart[index].quantity -= 1;

    } else {

      newCart.splice(
        index,
        1
      );

    }


    saveCart(newCart);

  };


  /* =======================================================
     REMOVE ITEM
  ======================================================= */

  const removeItem = (
    index
  ) => {

    const newCart = [
      ...cart
    ];

    newCart.splice(
      index,
      1
    );

    saveCart(newCart);

  };


  /* =======================================================
     CLEAR CART
  ======================================================= */

  const clearCart = () => {

    localStorage.removeItem(
      "xfit_cart"
    );

    setCart([]);

    window.dispatchEvent(
      new Event(
        "xfit-cart-updated"
      )
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
        Number(
          item.price
        ) *
        Number(
          item.quantity
        ),
      0
    );

  }, [cart]);


  /* =======================================================
     DELIVERY
  ======================================================= */

  const delivery =
    subtotal === 0
      ? 0
      : subtotal >= 1999
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
        Number(
          item.quantity
        ),
      0
    );


  /* =======================================================
     EMPTY CART
  ======================================================= */

  if (
    cart.length === 0
  ) {

    return (

      <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden">

        <CinematicBackground />


        {/* NAVBAR */}

        <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-black/60 backdrop-blur-2xl border-b border-white/5">

          <div className="max-w-[1500px] mx-auto h-full px-5 md:px-10 flex items-center justify-between">

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


            <div className="flex items-center gap-3">

              <button

                onClick={() =>
                  navigate(
                    "/shop"
                  )
                }

                className="px-5 py-2.5 rounded-lg border border-white/10 text-sm font-bold text-[#92998c] hover:text-white hover:border-[#ccff00]/40 transition"

              >

                SHOP

              </button>


              <button

                onClick={() =>
                  navigate(
                    "/profile"
                  )
                }

                className="w-10 h-10 rounded-full border border-white/10 text-[#ccff00]"

              >

                ◉

              </button>

            </div>

          </div>

        </nav>


        {/* EMPTY STATE */}

        <main className="relative z-20 min-h-screen flex items-center justify-center px-5 pt-20">

          <motion.div

            initial={{
              opacity: 0,
              y: 20,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            className="text-center max-w-xl"

          >

            <div className="text-7xl mb-6">

              🛒

            </div>


            <p className="text-[#ccff00] text-[10px] tracking-[0.3em] font-black">

              X-FIT SHOP

            </p>


            <h1 className="text-5xl md:text-7xl font-black tracking-[-0.06em] mt-3">

              YOUR CART
              <br />

              IS EMPTY.

            </h1>


            <p className="text-[#777e73] mt-5">

              Your next training
              essential is waiting.

            </p>


            <button

              onClick={() =>
                navigate(
                  "/shop"
                )
              }

              className="mt-8 px-8 py-4 rounded-xl bg-[#ccff00] text-black font-black hover:bg-[#b8e600] transition"

            >

              EXPLORE X-FIT SHOP →

            </button>

          </motion.div>

        </main>

      </div>

    );

  }


  /* =======================================================
     MAIN CART
  ======================================================= */

  return (

    <div className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden">

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


          {/* NAV */}

          <div className="hidden lg:flex items-center gap-7">

            <NavButton
              text="Training"
              onClick={() =>
                navigate(
                  "/workout-plan"
                )
              }
            />

            <NavButton
              text="MotionCheck"
              onClick={() =>
                navigate(
                  "/motioncheck"
                )
              }
            />

            <NavButton
              text="Nutrition"
              onClick={() =>
                navigate(
                  "/diet-plan"
                )
              }
            />

            <NavButton
              text="Progress DNA"
              onClick={() =>
                navigate(
                  "/progress-dna"
                )
              }
            />

            <NavButton
              text="Membership"
              onClick={() =>
                navigate(
                  "/membership"
                )
              }
            />

            <NavButton
              text="Shop"
              active
              onClick={() =>
                navigate(
                  "/shop"
                )
              }
            />

          </div>


          {/* RIGHT */}

          <div className="flex items-center gap-3">

            <div className="relative w-10 h-10 rounded-full border border-[#ccff00]/40 bg-[#ccff00]/10 flex items-center justify-center">

              🛒

              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#ccff00] text-black text-[9px] font-black flex items-center justify-center">

                {totalItems}

              </span>

            </div>


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

        </div>

      </nav>


      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="relative z-20 max-w-[1500px] mx-auto px-5 md:px-10 pt-[115px] pb-24">


        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">

          <div>

            <p className="text-[#ccff00] text-[9px] tracking-[0.28em] font-black">

              X-FIT // CHECKOUT SYSTEM

            </p>


            <h1 className="text-5xl md:text-7xl font-black tracking-[-0.06em] mt-2">

              YOUR CART

            </h1>


            <p className="text-[#777e73] mt-3">

              {totalItems}{" "}

              {totalItems === 1
                ? "ITEM"
                : "ITEMS"}{" "}

              READY FOR YOUR
              NEXT SESSION.

            </p>

          </div>


          <button

            onClick={() =>
              navigate(
                "/shop"
              )
            }

            className="text-[#ccff00] text-sm font-black"

          >

            ← CONTINUE SHOPPING

          </button>

        </div>


        {/* =================================================
            CART + SUMMARY
        ================================================= */}

        <div className="grid xl:grid-cols-[1fr_420px] gap-6">


          {/* ===============================================
              CART ITEMS
          =============================================== */}

          <section className="space-y-4">

            {cart.map(
              (
                item,
                index
              ) => (

                <motion.div

                  key={`${item.productId}-${item.color}-${item.size}`}

                  initial={{
                    opacity: 0,
                    y: 15,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  className="rounded-[24px] border border-white/10 bg-black/45 backdrop-blur-xl p-5"

                >

                  <div className="flex flex-col md:flex-row gap-5">


                    {/* PRODUCT VISUAL */}

                    <div className="w-full md:w-[190px] h-[190px] shrink-0 rounded-2xl bg-gradient-to-b from-[#1b1b1b] to-[#080808] border border-white/10 flex items-center justify-center overflow-hidden relative">

                      <div className="absolute w-32 h-32 rounded-full bg-[#ccff00]/10 blur-[60px]" />


                      <div className="relative">

                        <div className="w-[95px] h-[125px] rounded-b-[22px] bg-gradient-to-b from-[#292929] to-[#080808] border border-white/10 flex items-center justify-center">

                          <span className="text-[#ccff00] text-xl font-black tracking-[-0.08em]">

                            X-FIT

                          </span>

                        </div>


                        <div className="absolute -left-9 top-2 w-12 h-16 bg-[#151515] rounded-l-xl rotate-[20deg] border border-white/10" />

                        <div className="absolute -right-9 top-2 w-12 h-16 bg-[#151515] rounded-r-xl rotate-[-20deg] border border-white/10" />

                      </div>

                    </div>


                    {/* PRODUCT INFO */}

                    <div className="flex-1 flex flex-col">


                      <div className="flex justify-between gap-4">

                        <div>

                          <p className="text-[#5f665c] text-[9px] tracking-[0.2em]">

                            X-FIT PERFORMANCE

                          </p>


                          <h2 className="text-2xl md:text-3xl font-black mt-1">

                            {item.name}

                          </h2>

                        </div>


                        <button

                          onClick={() =>
                            removeItem(
                              index
                            )
                          }

                          className="text-[#777e73] hover:text-red-400 text-sm"

                        >

                          REMOVE

                        </button>

                      </div>


                      {/* OPTIONS */}

                      <div className="flex flex-wrap gap-3 mt-5">

                        <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10">

                          <span className="text-[#5f665c] text-[8px] tracking-[0.12em]">

                            COLOR

                          </span>

                          <p className="font-bold text-sm">

                            {item.color}

                          </p>

                        </div>


                        <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10">

                          <span className="text-[#5f665c] text-[8px] tracking-[0.12em]">

                            SIZE

                          </span>

                          <p className="font-bold text-sm">

                            {item.size}

                          </p>

                        </div>

                      </div>


                      {/* BOTTOM */}

                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mt-auto pt-6">


                        {/* QUANTITY */}

                        <div>

                          <p className="text-[#5f665c] text-[8px] tracking-[0.16em] mb-2">

                            QUANTITY

                          </p>


                          <div className="flex items-center border border-white/10 rounded-xl overflow-hidden">

                            <button

                              onClick={() =>
                                decreaseQuantity(
                                  index
                                )
                              }

                              className="w-10 h-10 hover:bg-white/5"

                            >

                              −

                            </button>


                            <span className="w-12 text-center font-black">

                              {
                                item.quantity
                              }

                            </span>


                            <button

                              onClick={() =>
                                increaseQuantity(
                                  index
                                )
                              }

                              className="w-10 h-10 hover:bg-white/5"

                            >

                              +

                            </button>

                          </div>

                        </div>


                        {/* PRICE */}

                        <div className="text-left sm:text-right">

                          <p className="text-[#777e73] text-xs">

                            ₹
                            {Number(
                              item.price
                            ).toLocaleString(
                              "en-IN"
                            )}{" "}

                            ×{" "}

                            {
                              item.quantity
                            }

                          </p>


                          <p className="text-3xl font-black text-[#ccff00]">

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

                      </div>

                    </div>

                  </div>

                </motion.div>

              )
            )}


            {/* CLEAR CART */}

            <button

              onClick={
                clearCart
              }

              className="text-[#666d62] text-xs hover:text-red-400 transition"

            >

              CLEAR ENTIRE CART

            </button>

          </section>


          {/* ===============================================
              ORDER SUMMARY
          =============================================== */}

          <aside className="xl:sticky xl:top-28 h-fit rounded-[28px] border border-white/10 bg-black/55 backdrop-blur-xl p-7">


            <p className="text-[#ccff00] text-[9px] tracking-[0.25em] font-black">

              ORDER SUMMARY

            </p>


            <h2 className="text-3xl font-black mt-2">

              READY TO
              CHECK OUT?

            </h2>


            {/* PRICE ROWS */}

            <div className="space-y-4 mt-8">

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


            {/* FREE DELIVERY MESSAGE */}

            {subtotal >
              0 &&
              subtotal <
                1999 && (

                <div className="mt-5 rounded-xl border border-[#ccff00]/15 bg-[#ccff00]/5 p-4">

                  <p className="text-[#ccff00] text-xs font-black">

                    FREE DELIVERY

                  </p>


                  <p className="text-[#777e73] text-xs mt-1">

                    Add ₹
                    {(
                      1999 -
                      subtotal
                    ).toLocaleString(
                      "en-IN"
                    )}{" "}

                    more to unlock
                    free delivery.

                  </p>

                </div>

              )}


            {/* TOTAL */}

            <div className="border-t border-white/10 mt-7 pt-6 flex items-end justify-between">

              <div>

                <p className="text-[#5f665c] text-[9px] tracking-[0.18em]">

                  TOTAL

                </p>

                <p className="text-[#777e73] text-xs mt-1">

                  Inclusive of listed
                  product prices

                </p>

              </div>


              <p className="text-4xl font-black text-[#ccff00]">

                ₹
                {total.toLocaleString(
                  "en-IN"
                )}

              </p>

            </div>


            {/* CHECKOUT */}

            <button

              onClick={() =>
                navigate(
                  "/checkout"
                )
              }

              className="w-full mt-7 py-4 rounded-xl bg-[#ccff00] text-black font-black hover:bg-[#b8e600] transition"

            >

              PROCEED TO CHECKOUT →

            </button>


            {/* PAYMENT INFO */}

            <div className="grid grid-cols-3 gap-2 mt-5">

              <MiniInfo
                icon="🔒"
                text="SECURE"
              />

              <MiniInfo
                icon="⚡"
                text="FAST"
              />

              <MiniInfo
                icon="✓"
                text="X-FIT"
              />

            </div>


            {/* TRUST */}

            <p className="text-[#555c52] text-[10px] text-center mt-6 leading-relaxed">

              Secure checkout.
              Shipping details and
              UPI payment will be
              handled in the next
              X-FIT checkout stage.

            </p>

          </aside>

        </div>

      </main>

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


/* =========================================================
   NAV BUTTON
========================================================= */

function NavButton({
  text,
  onClick,
  active = false,
}) {

  return (

    <button

      onClick={onClick}

      className={`text-sm transition ${
        active
          ? "text-white font-bold"
          : "text-[#92998c] hover:text-white"
      }`}

    >

      {text}

    </button>

  );

}


export default Cart;