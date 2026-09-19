import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import CinematicBackground from "../components/futuristic/CinematicBackground";


/* =========================================================
   PAYMENT PAGE
========================================================= */

function Payment() {

  const navigate = useNavigate();


  /* =======================================================
     STATE
  ======================================================= */

  const [checkout, setCheckout] =
    useState(null);

  const [paymentScreenshot, setPaymentScreenshot] =
    useState(null);

  const [utr, setUtr] =
    useState("");

  const [error, setError] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);


  /* =======================================================
     LOAD CHECKOUT
  ======================================================= */

  useEffect(() => {

    const savedCheckout =
      JSON.parse(
        localStorage.getItem(
          "xfit_checkout"
        ) || "null"
      );


    if (
      !savedCheckout ||
      !savedCheckout.items ||
      savedCheckout.items.length === 0
    ) {

      navigate("/cart");

      return;

    }


    setCheckout(
      savedCheckout
    );

  }, [navigate]);


  /* =======================================================
     TOTAL ITEMS
  ======================================================= */

  const totalItems = useMemo(() => {

    if (!checkout?.items) {
      return 0;
    }

    return checkout.items.reduce(
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

  }, [checkout]);


  /* =======================================================
     FILE HANDLER
  ======================================================= */

  const handleFileChange = (
    event
  ) => {

    const file =
      event.target.files?.[0];


    if (!file) {
      return;
    }


    setError("");


    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];


    if (
      !allowedTypes.includes(
        file.type
      )
    ) {

      setError(
        "Please upload a JPG, PNG or WEBP image."
      );

      event.target.value = "";

      return;

    }


    /*
      Keep the frontend limit reasonable.
      Django will validate the uploaded file
      again when the real backend endpoint
      is connected.
    */

    if (
      file.size >
      5 * 1024 * 1024
    ) {

      setError(
        "Payment screenshot must be smaller than 5 MB."
      );

      event.target.value = "";

      return;

    }


    setPaymentScreenshot(
      file
    );

  };


  /* =======================================================
     SUBMIT PAYMENT
  ======================================================= */

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();


    setError("");


    if (
      !paymentScreenshot
    ) {

      setError(
        "Please upload your payment screenshot."
      );

      return;

    }


    if (
      !utr.trim()
    ) {

      setError(
        "Please enter your UTR / transaction ID."
      );

      return;

    }


    if (
      utr.trim().length < 6
    ) {

      setError(
        "Please enter a valid UTR / transaction ID."
      );

      return;

    }


    setSubmitting(
      true
    );


    /*
      IMPORTANT:
      For this stage we save the payment
      submission locally.

      The actual Django payment/order
      endpoint will be connected after
      the backend Order model is created.

      We do NOT mark the payment as
      automatically verified.
    */

    const paymentData = {

      checkout:
        checkout,

      utr:
        utr.trim(),

      screenshotName:
        paymentScreenshot.name,

      screenshotSize:
        paymentScreenshot.size,

      submittedAt:
        new Date().toISOString(),

      status:
        "pending_verification",

    };


    localStorage.setItem(
      "xfit_payment_submission",
      JSON.stringify(
        paymentData
      )
    );


    /*
      Give the user a moment of feedback.
    */

    setTimeout(() => {

      setSubmitting(
        false
      );

      navigate(
        "/order-success"
      );

    }, 700);

  };


  /* =======================================================
     LOADING
  ======================================================= */

  if (!checkout) {

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


          {/* CHECKOUT PROGRESS */}

          <div className="hidden sm:flex items-center gap-3 text-[9px] tracking-[0.2em] font-black">

            <span className="text-[#777e73]">

              01 CART

            </span>


            <span className="text-[#444]">

              →

            </span>


            <span className="text-[#777e73]">

              02 SHIPPING

            </span>


            <span className="text-[#444]">

              →

            </span>


            <span className="text-[#ccff00]">

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

            X-FIT // PAYMENT TERMINAL

          </p>


          <h1 className="text-5xl md:text-7xl font-black tracking-[-0.06em] mt-2">

            COMPLETE
            <br />

            PAYMENT

          </h1>


          <p className="text-[#777e73] mt-3 max-w-xl">

            Pay using UPI and submit
            your payment details for
            verification.

          </p>

        </div>


        {/* =================================================
            PAYMENT GRID
        ================================================= */}

        <div className="grid xl:grid-cols-[1fr_420px] gap-6">


          {/* ===============================================
              PAYMENT TERMINAL
          =============================================== */}

          <form

            onSubmit={
              handleSubmit
            }

            className="rounded-[28px] border border-white/10 bg-black/45 backdrop-blur-xl p-6 md:p-9"

          >


            {/* PAYMENT AMOUNT */}

            <div className="rounded-2xl border border-[#ccff00]/20 bg-[#ccff00]/5 p-6">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                  <p className="text-[#777e73] text-[9px] tracking-[0.2em]">

                    AMOUNT TO PAY

                  </p>


                  <p className="text-4xl md:text-5xl font-black text-[#ccff00] mt-2">

                    ₹
                    {Number(
                      checkout.total
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </p>

                </div>


                <div className="text-left sm:text-right">

                  <p className="text-[#777e73] text-xs">

                    {totalItems}

                    {" "}

                    {totalItems === 1
                      ? "ITEM"
                      : "ITEMS"}

                  </p>


                  <p className="text-[#555c52] text-[10px] mt-1">

                    X-FIT ORDER

                  </p>

                </div>

              </div>

            </div>


            {/* =============================================
                UPI SECTION
            ============================================= */}

            <div className="mt-8">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[#ccff00] text-[9px] tracking-[0.2em]">

                    PAYMENT METHOD

                  </p>


                  <h2 className="text-3xl font-black mt-1">

                    UPI PAYMENT

                  </h2>

                </div>


                <div className="text-2xl">

                  📱

                </div>

              </div>


              <div className="grid md:grid-cols-2 gap-6 mt-6">


                {/* QR */}

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">

                  <p className="text-[#777e73] text-[9px] tracking-[0.18em]">

                    SCAN & PAY

                  </p>


                  <div className="mt-5 w-[230px] h-[230px] max-w-full mx-auto rounded-2xl bg-white flex items-center justify-center overflow-hidden">

                    <img

                      src="/images/xfit-upi-qr.png"

                      alt="X-FIT UPI QR Code"

                      className="w-full h-full object-contain p-3"

                    />

                  </div>


                  <p className="text-[#ccff00] font-black text-sm mt-5">

                    X-FIT UPI

                  </p>


                  <p className="text-[#777e73] text-xs mt-1">

                    Scan the QR code
                    using your UPI app.

                  </p>

                </div>


                {/* INSTRUCTIONS */}

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">

                  <p className="text-[#ccff00] text-[9px] tracking-[0.18em]">

                    PAYMENT STEPS

                  </p>


                  <div className="space-y-5 mt-5">

                    <Step

                      number="01"

                      title="SCAN QR"

                      text="Open your UPI app and scan the X-FIT QR code."

                    />


                    <Step

                      number="02"

                      title="PAY AMOUNT"

                      text={`Pay exactly ₹${Number(
                        checkout.total
                      ).toLocaleString(
                        "en-IN"
                      )}.`}

                    />


                    <Step

                      number="03"

                      title="SAVE UTR"

                      text="After payment, copy the UTR or transaction ID."

                    />


                    <Step

                      number="04"

                      title="UPLOAD PROOF"

                      text="Upload a screenshot showing the successful payment."

                    />

                  </div>

                </div>

              </div>

            </div>


            {/* =============================================
                UTR
            ============================================= */}

            <div className="mt-8">

              <label>

                <span className="text-[#777e73] text-[9px] tracking-[0.18em] font-black">

                  UTR / TRANSACTION ID

                </span>


                <input

                  type="text"

                  value={utr}

                  onChange={(event) => {

                    setUtr(
                      event.target.value
                    );

                    setError("");

                  }}

                  placeholder="Enter your UTR / transaction ID"

                  className="w-full mt-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 text-white placeholder:text-[#4f554c] outline-none focus:border-[#ccff00]/60 transition"

                />

              </label>

            </div>


            {/* =============================================
                SCREENSHOT
            ============================================= */}

            <div className="mt-6">

              <label>

                <span className="text-[#777e73] text-[9px] tracking-[0.18em] font-black">

                  PAYMENT SCREENSHOT

                </span>


                <div className="relative mt-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] hover:border-[#ccff00]/40 transition p-6">

                  <input

                    type="file"

                    accept="image/png,image/jpeg,image/webp"

                    onChange={
                      handleFileChange
                    }

                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"

                  />


                  <div className="text-center pointer-events-none">

                    <div className="text-3xl">

                      📷

                    </div>


                    {paymentScreenshot ? (

                      <>

                        <p className="text-[#ccff00] font-bold text-sm mt-3">

                          {paymentScreenshot.name}

                        </p>


                        <p className="text-[#777e73] text-xs mt-1">

                          Screenshot selected

                        </p>

                      </>

                    ) : (

                      <>

                        <p className="font-bold text-sm mt-3">

                          UPLOAD PAYMENT SCREENSHOT

                        </p>


                        <p className="text-[#777e73] text-xs mt-1">

                          JPG, PNG or WEBP • Max 5 MB

                        </p>

                      </>

                    )}

                  </div>

                </div>

              </label>

            </div>


            {/* ERROR */}

            {error && (

              <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3">

                <p className="text-red-400 text-sm">

                  {error}

                </p>

              </div>

            )}


            {/* =============================================
                VERIFICATION NOTICE
            ============================================= */}

            <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">

              <div className="flex gap-3">

                <span className="text-yellow-400">

                  ⚠

                </span>


                <div>

                  <p className="font-black text-sm">

                    PAYMENT VERIFICATION

                  </p>


                  <p className="text-[#777e73] text-xs mt-2 leading-relaxed">

                    Uploading a screenshot does
                    not automatically confirm
                    your payment. Your payment
                    proof will be reviewed before
                    the order is marked as paid.

                  </p>

                </div>

              </div>

            </div>


            {/* SUBMIT */}

            <button

              type="submit"

              disabled={
                submitting
              }

              className={`w-full mt-7 py-4 rounded-xl font-black transition ${
                submitting

                  ? "bg-[#718000] text-black cursor-wait"

                  : "bg-[#ccff00] text-black hover:bg-[#b8e600]"
              }`}

            >

              {submitting

                ? "SUBMITTING PAYMENT..."

                : "SUBMIT PAYMENT PROOF →"}

            </button>


            {/* BACK */}

            <button

              type="button"

              onClick={() =>
                navigate(
                  "/checkout"
                )
              }

              className="w-full mt-3 py-3 text-[#777e73] text-sm hover:text-white transition"

            >

              ← BACK TO SHIPPING

            </button>

          </form>


          {/* ===============================================
              ORDER SUMMARY
          =============================================== */}

          <aside className="xl:sticky xl:top-28 h-fit rounded-[28px] border border-white/10 bg-black/55 backdrop-blur-xl p-7">


            <p className="text-[#ccff00] text-[9px] tracking-[0.25em] font-black">

              ORDER

            </p>


            <h2 className="text-3xl font-black mt-2">

              SUMMARY

            </h2>


            {/* ITEMS */}

            <div className="mt-7 space-y-4">

              {checkout.items.map(
                (
                  item,
                  index
                ) => (

                  <div

                    key={`${item.productId}-${item.color}-${item.size}-${index}`}

                    className="flex gap-3 pb-4 border-b border-white/5"

                  >

                    <div className="w-14 h-14 shrink-0 rounded-xl bg-gradient-to-b from-[#202020] to-[#080808] border border-white/10 flex items-center justify-center">

                      <span className="text-[#ccff00] text-[8px] font-black">

                        X-FIT

                      </span>

                    </div>


                    <div className="flex-1 min-w-0">

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

                        Qty{" "}
                        {item.quantity}

                      </p>

                    </div>


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


            {/* TOTALS */}

            <div className="space-y-4 mt-6">

              <SummaryRow

                label="Subtotal"

                value={`₹${Number(
                  checkout.subtotal
                ).toLocaleString(
                  "en-IN"
                )}`}

              />


              <SummaryRow

                label="Delivery"

                value={
                  Number(
                    checkout.delivery
                  ) === 0

                    ? "FREE"

                    : `₹${Number(
                        checkout.delivery
                      ).toLocaleString(
                        "en-IN"
                      )}`
                }

                lime={
                  Number(
                    checkout.delivery
                  ) === 0
                }

              />

            </div>


            {/* TOTAL */}

            <div className="border-t border-white/10 mt-6 pt-6 flex justify-between items-end">

              <div>

                <p className="text-[#5f665c] text-[9px] tracking-[0.18em]">

                  TOTAL

                </p>


                <p className="text-[#777e73] text-xs mt-1">

                  UPI payable amount

                </p>

              </div>


              <p className="text-3xl font-black text-[#ccff00]">

                ₹
                {Number(
                  checkout.total
                ).toLocaleString(
                  "en-IN"
                )}

              </p>

            </div>


            {/* SHIPPING ADDRESS */}

            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">

              <p className="text-[#ccff00] text-[8px] tracking-[0.18em]">

                DELIVERY TO

              </p>


              <p className="font-bold text-sm mt-2">

                {
                  checkout.customer
                    ?.fullName
                }

              </p>


              <p className="text-[#777e73] text-xs mt-1 leading-relaxed">

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

                {" - "}

                {
                  checkout.customer
                    ?.pincode
                }

              </p>

            </div>

          </aside>

        </div>

      </main>

    </div>

  );

}


/* =========================================================
   STEP COMPONENT
========================================================= */

function Step({
  number,
  title,
  text,
}) {

  return (

    <div className="flex gap-3">

      <div className="w-8 h-8 shrink-0 rounded-lg border border-[#ccff00]/20 bg-[#ccff00]/5 flex items-center justify-center">

        <span className="text-[#ccff00] text-[9px] font-black">

          {number}

        </span>

      </div>


      <div>

        <p className="font-black text-xs">

          {title}

        </p>


        <p className="text-[#777e73] text-xs mt-1 leading-relaxed">

          {text}

        </p>

      </div>

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


export default Payment;