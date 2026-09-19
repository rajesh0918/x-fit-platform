import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import CinematicBackground from "../components/futuristic/CinematicBackground";


/* =========================================================
   ORDER SUCCESS PAGE
========================================================= */

function OrderSuccess() {

  const navigate = useNavigate();


  /* =======================================================
     LOAD PAYMENT SUBMISSION
  ======================================================= */

  const paymentData = useMemo(() => {

    try {

      return JSON.parse(
        localStorage.getItem(
          "xfit_payment_submission"
        ) || "null"
      );

    } catch {

      return null;

    }

  }, []);


  /* =======================================================
     LOAD CHECKOUT
  ======================================================= */

  const checkout = useMemo(() => {

    if (
      paymentData?.checkout
    ) {

      return paymentData.checkout;

    }


    try {

      return JSON.parse(
        localStorage.getItem(
          "xfit_checkout"
        ) || "null"
      );

    } catch {

      return null;

    }

  }, [paymentData]);


  /* =======================================================
     ORDER ID
  ======================================================= */

  const orderId = useMemo(() => {

    const existing =
      localStorage.getItem(
        "xfit_pending_order_id"
      );


    if (existing) {

      return existing;

    }


    const generated =
      `XF-${Date.now()
        .toString()
        .slice(-8)}`;


    localStorage.setItem(
      "xfit_pending_order_id",
      generated
    );


    return generated;

  }, []);


  /* =======================================================
     PAYMENT STATUS
  ======================================================= */

  const paymentStatus =
    paymentData?.status ||
    "pending_verification";


  /* =======================================================
     NO ORDER DATA
  ======================================================= */

  if (!checkout) {

    return (

      <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden">

        <CinematicBackground />


        <main className="relative z-20 min-h-screen flex items-center justify-center px-5">

          <div className="text-center">

            <p className="text-[#ccff00] text-[10px] tracking-[0.25em] font-black">

              X-FIT

            </p>


            <h1 className="text-5xl font-black mt-3">

              NO ORDER FOUND

            </h1>


            <button

              onClick={() =>
                navigate(
                  "/shop"
                )
              }

              className="mt-7 px-7 py-4 rounded-xl bg-[#ccff00] text-black font-black"

            >

              GO TO SHOP →

            </button>

          </div>

        </main>

      </div>

    );

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


          {/* STATUS */}

          <div className="hidden sm:flex items-center gap-3 text-[9px] tracking-[0.2em] font-black">

            <span className="text-[#777e73]">

              CART

            </span>


            <span className="text-[#444]">

              →

            </span>


            <span className="text-[#777e73]">

              SHIPPING

            </span>


            <span className="text-[#444]">

              →

            </span>


            <span className="text-[#777e73]">

              PAYMENT

            </span>


            <span className="text-[#444]">

              →

            </span>


            <span className="text-[#ccff00]">

              ORDER

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

      <main className="relative z-20 max-w-[1100px] mx-auto px-5 md:px-10 pt-[120px] pb-24">


        {/* =================================================
            SUCCESS HEADER
        ================================================= */}

        <motion.section

          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          className="text-center"

        >

          {/* CHECK ICON */}

          <div className="mx-auto w-24 h-24 rounded-full border border-[#ccff00]/40 bg-[#ccff00]/10 flex items-center justify-center">

            <div className="w-16 h-16 rounded-full bg-[#ccff00] text-black flex items-center justify-center text-3xl font-black">

              ✓

            </div>

          </div>


          <p className="text-[#ccff00] text-[10px] tracking-[0.3em] font-black mt-7">

            PAYMENT PROOF RECEIVED

          </p>


          <h1 className="text-5xl md:text-7xl font-black tracking-[-0.06em] mt-3">

            ORDER
            <br />

            SUBMITTED.

          </h1>


          <p className="text-[#777e73] max-w-2xl mx-auto mt-5 leading-relaxed">

            Your payment details and
            payment proof have been
            submitted for verification.
            Your order will be processed
            after the payment is reviewed.

          </p>

        </motion.section>


        {/* =================================================
            STATUS CARD
        ================================================= */}

        <motion.section

          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            delay: 0.15,
          }}

          className="mt-10 rounded-[28px] border border-[#ccff00]/20 bg-[#ccff00]/5 p-6 md:p-8"

        >

          <div className="grid md:grid-cols-3 gap-5">


            {/* ORDER ID */}

            <StatusCard

              label="ORDER ID"

              value={
                orderId
              }

            />


            {/* AMOUNT */}

            <StatusCard

              label="AMOUNT"

              value={`₹${Number(
                checkout.total
              ).toLocaleString(
                "en-IN"
              )}`}

            />


            {/* STATUS */}

            <StatusCard

              label="PAYMENT STATUS"

              value="PENDING VERIFICATION"

              lime

            />

          </div>

        </motion.section>


        {/* =================================================
            ORDER DETAILS
        ================================================= */}

        <div className="grid lg:grid-cols-2 gap-6 mt-6">


          {/* ===============================================
              ITEMS
          =============================================== */}

          <section className="rounded-[28px] border border-white/10 bg-black/45 backdrop-blur-xl p-6 md:p-8">


            <p className="text-[#ccff00] text-[9px] tracking-[0.22em] font-black">

              ORDER CONTENTS

            </p>


            <h2 className="text-3xl font-black mt-2">

              YOUR ITEMS

            </h2>


            <div className="space-y-4 mt-7">

              {checkout.items.map(
                (
                  item,
                  index
                ) => (

                  <div

                    key={`${item.productId}-${item.color}-${item.size}-${index}`}

                    className="flex gap-4 pb-4 border-b border-white/5"

                  >

                    {/* VISUAL */}

                    <div className="w-20 h-20 shrink-0 rounded-xl bg-gradient-to-b from-[#202020] to-[#080808] border border-white/10 flex items-center justify-center">

                      <span className="text-[#ccff00] text-[10px] font-black">

                        X-FIT

                      </span>

                    </div>


                    {/* INFO */}

                    <div className="flex-1 min-w-0">

                      <p className="font-black">

                        {item.name}

                      </p>


                      <p className="text-[#777e73] text-xs mt-1">

                        Color:{" "}

                        {item.color}

                      </p>


                      <p className="text-[#777e73] text-xs mt-1">

                        Size:{" "}

                        {item.size}

                        {" • "}

                        Qty:{" "}

                        {item.quantity}

                      </p>

                    </div>


                    <p className="text-[#ccff00] font-black">

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


            {/* TOTAL */}

            <div className="flex justify-between items-center mt-6">

              <span className="text-[#777e73]">

                TOTAL

              </span>


              <span className="text-2xl font-black text-[#ccff00]">

                ₹
                {Number(
                  checkout.total
                ).toLocaleString(
                  "en-IN"
                )}

              </span>

            </div>

          </section>


          {/* ===============================================
              DELIVERY
          =============================================== */}

          <section className="rounded-[28px] border border-white/10 bg-black/45 backdrop-blur-xl p-6 md:p-8">


            <p className="text-[#ccff00] text-[9px] tracking-[0.22em] font-black">

              DELIVERY SYSTEM

            </p>


            <h2 className="text-3xl font-black mt-2">

              SHIPPING TO

            </h2>


            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 mt-7">


              <p className="font-black">

                {
                  checkout.customer
                    ?.fullName
                }

              </p>


              <p className="text-[#777e73] text-sm mt-3 leading-relaxed">

                {
                  checkout.customer
                    ?.address
                }

                <br />

                {
                  checkout.customer
                    ?.city
                }

                ,{" "}

                {
                  checkout.customer
                    ?.state
                }

                <br />

                PIN:{" "}

                {
                  checkout.customer
                    ?.pincode
                }

              </p>


              <div className="h-px bg-white/10 my-5" />


              <p className="text-[#777e73] text-xs">

                PHONE

              </p>


              <p className="font-bold mt-1">

                {
                  checkout.customer
                    ?.phone
                }

              </p>

            </div>


            {/* DELIVERY STATUS */}

            <div className="mt-5 rounded-2xl border border-white/10 p-5">

              <div className="flex items-center gap-3">

                <div className="w-3 h-3 rounded-full bg-[#ccff00] shadow-[0_0_12px_rgba(204,255,0,.6)]" />


                <p className="font-black">

                  PAYMENT REVIEW

                </p>

              </div>


              <p className="text-[#777e73] text-xs mt-3 leading-relaxed">

                Your order is waiting
                for payment verification.
                Tracking information will
                become available after the
                order is confirmed.

              </p>

            </div>

          </section>

        </div>


        {/* =================================================
            PAYMENT PROOF
        ================================================= */}

        <section className="mt-6 rounded-[28px] border border-white/10 bg-black/45 backdrop-blur-xl p-6 md:p-8">


          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">


            <div>

              <p className="text-[#ccff00] text-[9px] tracking-[0.22em] font-black">

                PAYMENT RECORD

              </p>


              <h2 className="text-3xl font-black mt-2">

                PROOF SUBMITTED

              </h2>


              <p className="text-[#777e73] text-sm mt-2">

                UTR:

                {" "}

                <span className="text-white font-bold">

                  {paymentData?.utr ||
                    "Submitted"}

                </span>

              </p>

            </div>


            <div className="px-5 py-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5">

              <p className="text-yellow-400 text-xs font-black">

                ⏳ PENDING VERIFICATION

              </p>

            </div>

          </div>


          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">

            <p className="text-[#777e73] text-xs leading-relaxed">

              Payment verification is
              performed separately.
              The uploaded screenshot is
              retained as payment proof
              and does not by itself mark
              the order as paid.

            </p>

          </div>

        </section>


        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">


          <button

            onClick={() =>
              navigate(
                "/shop"
              )
            }

            className="px-8 py-4 rounded-xl border border-white/10 text-[#92998c] font-black hover:text-white hover:border-white/20 transition"

          >

            CONTINUE SHOPPING

          </button>


          <button

            onClick={() =>
              navigate(
                "/dashboard"
              )
            }

            className="px-8 py-4 rounded-xl bg-[#ccff00] text-black font-black hover:bg-[#b8e600] transition"

          >

            GO TO X-FIT DASHBOARD →

          </button>

        </div>


        {/* =================================================
            FUTURE TRACKING
        ================================================= */}

        <div className="text-center mt-8">

          <p className="text-[#555c52] text-[10px] tracking-[0.14em]">

            ORDER TRACKING WILL APPEAR
            HERE AFTER VERIFICATION

          </p>

        </div>

      </main>

    </div>

  );

}


/* =========================================================
   STATUS CARD
========================================================= */

function StatusCard({
  label,
  value,
  lime = false,
}) {

  return (

    <div className="rounded-2xl border border-white/10 bg-black/30 p-5">

      <p className="text-[#5f665c] text-[8px] tracking-[0.18em]">

        {label}

      </p>


      <p
        className={`font-black mt-2 ${
          lime
            ? "text-[#ccff00]"
            : "text-white"
        }`}
      >

        {value}

      </p>

    </div>

  );

}


export default OrderSuccess;