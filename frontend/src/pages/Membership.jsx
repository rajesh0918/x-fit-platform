import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import apiFetch from "../services/api";
import CinematicBackground from "../components/futuristic/CinematicBackground";

function Membership() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [paymentScreenshotPreview, setPaymentScreenshotPreview] = useState("");

  useEffect(() => {
    loadMembershipData();
  }, []);

  useEffect(() => {
    if (!paymentScreenshot) {
      setPaymentScreenshotPreview("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(paymentScreenshot);
    setPaymentScreenshotPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [paymentScreenshot]);

  const loadMembershipData = async () => {
    setLoading(true);
    setError("");

    try {
      const [plansResponse, statusResponse, historyResponse] =
        await Promise.all([
          apiFetch("/membership/plans/"),
          apiFetch("/membership/status/"),
          apiFetch("/membership/history/"),
        ]);

      if (!plansResponse || !statusResponse || !historyResponse) {
        return;
      }

      const plansData = await plansResponse.json();
      const statusData = await statusResponse.json();
      const historyData = await historyResponse.json();

      if (!plansResponse.ok) {
        throw new Error(
          plansData.error || "Unable to load membership plans."
        );
      }

      if (!statusResponse.ok) {
        throw new Error(
          statusData.error || "Unable to load membership status."
        );
      }

      if (!historyResponse.ok) {
        throw new Error(
          historyData.error || "Unable to load membership history."
        );
      }

      setPlans(plansData.plans || plansData || []);
      setStatus(statusData);

      setHistory(
        historyData.memberships ||
          historyData.history ||
          historyData ||
          []
      );
    } catch (err) {
      console.error("Membership loading error:", err);
      setError(
        err.message || "Membership system connection failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UPI PAYMENT UI
  // =========================================================

  const upiId = import.meta.env.VITE_XFIT_UPI_ID || "";
  const customQrUrl = import.meta.env.VITE_XFIT_UPI_QR_URL || "";

  const getPlanKey = (plan) =>
    plan?.plan || plan?.id || plan?.name || "";

  const getPaymentAmount = (plan) => {
    const key = String(getPlanKey(plan)).toLowerCase();

    if (key === "monthly") return 100;
    if (key === "quarterly") return 400;
    if (key === "yearly") return 600;

    return Number(plan?.amount || 0);
  };

  const getUpiLink = (plan) => {
    if (!upiId) return "";

    const amount = getPaymentAmount(plan);
    const name = encodeURIComponent("X-FIT Membership");

    return (
      `upi://pay?pa=${encodeURIComponent(upiId)}` +
      `&pn=${name}` +
      `&am=${amount}` +
      "&cu=INR"
    );
  };

  const getQrUrl = (plan) => {
    if (customQrUrl) return customQrUrl;

    const upiLink = getUpiLink(plan);
    if (!upiLink) return "";

    return (
      "https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=" +
      encodeURIComponent(upiLink)
    );
  };

  const openPayment = (plan) => {
    if (isFreeTrial) return;

    setError("");
    setMessage("");
    setSelectedPlan(plan);
  };

  const startPayment = async (plan) => {
    if (processing) return;

    if (!paymentScreenshot) {
      setError("Please upload your payment screenshot first.");
      return;
    }

    setProcessing(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();

      formData.append(
        "plan",
        plan.plan || plan.id || plan.name
      );

      formData.append(
        "payment_screenshot",
        paymentScreenshot
      );

      const response = await apiFetch(
        "/membership/submit-upi/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response) {
        setProcessing(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.detail ||
            "Unable to submit membership payment."
        );
      }

      setMessage(
        `PAYMENT SUBMITTED. ${data.plan_name || "Membership"} IS AWAITING VERIFICATION.`
      );

      setPaymentScreenshot(null);
      setSelectedPlan(null);
      setProcessing(false);

      await loadMembershipData();
    } catch (err) {
      console.error("UPI membership payment error:", err);

      setError(
        err.message ||
          "Membership payment submission failed."
      );

      setProcessing(false);
    }
  };

  const formatPlanName = (plan) => {
    if (!plan) return "Membership";

    const normalized = String(plan).toLowerCase();

    if (normalized === "quarterly") {
      return "Half-Yearly";
    }

    if (normalized === "free_trial") {
      return "Free Trial";
    }

    return String(plan)
      .charAt(0)
      .toUpperCase() +
      String(plan).slice(1);
  };

  const formatAmount = (amount) => {
    const value = Number(amount || 0);

    return `₹${value.toLocaleString("en-IN")}`;
  };

  const getDuration = (plan) => {
    const name = String(
      plan.plan || plan.id || plan.name || ""
    ).toLowerCase();

    if (name.includes("monthly")) return "30 DAYS";
    if (name.includes("quarter") || name.includes("half")) return "180 DAYS";
    if (name.includes("year")) return "365 DAYS";

    return plan.duration_days
      ? `${plan.duration_days} DAYS`
      : "MEMBERSHIP";
  };

  const isActive =
    status?.active === true ||
    status?.is_active === true ||
    status?.membership?.is_active === true;

  const isFreeTrial =
    status?.membership_type === "free_trial" ||
    status?.trial === true;

  const trialExpired =
    status?.trial_expired === true;

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <CinematicBackground />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-5 md:px-10 py-5">
        <div className="max-w-[1500px] mx-auto">
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/55 backdrop-blur-xl px-5 py-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg border border-[#ccff00]/40 bg-[#ccff00]/10 flex items-center justify-center">
                <span className="text-[#ccff00] font-black">
                  X
                </span>
              </div>

              <div>
                <p className="font-black tracking-[0.25em] text-sm">
                  X-FIT
                </p>

                <p className="text-[7px] tracking-[0.2em] text-white/30">
                  ATHLETE PERFORMANCE SYSTEM
                </p>
              </div>
            </button>

            <div className="hidden md:flex items-center gap-7 text-[10px] tracking-[0.16em]">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-white/50 hover:text-[#ccff00] transition"
              >
                TODAY
              </button>

              <button
                onClick={() => navigate("/workouts")}
                className="text-white/50 hover:text-[#ccff00] transition"
              >
                TRAINING
              </button>

              <button
                onClick={() => navigate("/motion-check")}
                className="text-white/50 hover:text-[#ccff00] transition"
              >
                MOTIONCHECK
              </button>

              <button
                onClick={() => navigate("/nutrition")}
                className="text-white/50 hover:text-[#ccff00] transition"
              >
                NUTRITION
              </button>

              <button
                onClick={() => navigate("/progress-dna")}
                className="text-white/50 hover:text-[#ccff00] transition"
              >
                PROGRESS DNA
              </button>

              <button
                className="text-[#ccff00]"
              >
                MEMBERSHIP
              </button>
            </div>

            <button
              onClick={() => navigate("/profile")}
              className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:border-[#ccff00]/50 transition"
            >
              <span className="text-xs">
                ◉
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="relative z-10 pt-36 pb-24 px-5 md:px-10">
        <div className="max-w-[1400px] mx-auto">

          {/* HEADER */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#ccff00] shadow-[0_0_12px_#ccff00]" />

              <span className="text-[10px] tracking-[0.3em] text-[#ccff00]">
                X-FIT MEMBERSHIP SYSTEM
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-none">
              ACCESS
              <br />

              <span className="text-[#ccff00]">
                THE SYSTEM.
              </span>
            </h1>

            <p className="max-w-2xl mt-6 text-sm md:text-base text-white/45 leading-relaxed">
              Activate your X-FIT performance protocol.
              Training, nutrition, MotionCheck and
              performance intelligence in one athlete
              operating system.
            </p>
          </div>

          {/* MEMBERSHIP / FREE TRIAL STATUS */}
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 rounded-2xl border border-[#ccff00]/25 bg-[#ccff00]/[0.04] p-5"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <p className="text-[9px] tracking-[0.25em] text-[#ccff00]">
                    {isFreeTrial
                      ? "30-DAY FREE TRIAL"
                      : "MEMBERSHIP ACTIVE"}
                  </p>

                  <h2 className="text-2xl font-black mt-2">
                    {isFreeTrial
                      ? "PERFORMANCE PROTOCOL ONLINE"
                      : "PERFORMANCE PROTOCOL ONLINE"}
                  </h2>

                  {isFreeTrial && (
                    <p className="text-xs text-white/40 mt-2">
                      {status?.trial_days_remaining || 0} day(s) remaining.
                      After the trial, choose a paid protocol below.
                    </p>
                  )}
                </div>

                <div className="text-left md:text-right">
                  <p className="text-sm font-bold">
                    {status?.membership?.plan_name ||
                      (isFreeTrial
                        ? "X-FIT Free Trial"
                        : "Membership")}
                  </p>

                  {status?.membership?.expires_at && (
                    <p className="text-[10px] text-white/35 mt-1">
                      ACCESS UNTIL{" "}
                      {new Date(
                        status.membership.expires_at
                      ).toLocaleDateString("en-IN")}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {trialExpired && !isActive && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 rounded-2xl border border-[#ccff00]/25 bg-[#ccff00]/[0.04] p-5"
            >
              <p className="text-[9px] tracking-[0.25em] text-[#ccff00]">
                FREE TRIAL COMPLETE
              </p>

              <h2 className="text-2xl font-black mt-2">
                CHOOSE YOUR PERFORMANCE PROTOCOL
              </h2>

              <p className="text-xs text-white/40 mt-2">
                Your 30-day free access has ended. Select a paid
                membership below and submit your X-FIT UPI payment
                for manual verification.
              </p>
            </motion.div>
          )}

          {/* MESSAGES */}
          {error && (
            <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/[0.04] px-5 py-4">
              <p className="text-[10px] tracking-[0.12em] text-red-400">
                {error}
              </p>
            </div>
          )}

          {message && (
            <div className="mb-8 rounded-xl border border-[#ccff00]/20 bg-[#ccff00]/[0.04] px-5 py-4">
              <p className="text-[10px] tracking-[0.12em] text-[#ccff00]">
                {message}
              </p>
            </div>
          )}

          {/* LOADING */}
          {loading ? (
            <div className="min-h-[350px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full border-2 border-[#ccff00]/20 border-t-[#ccff00] animate-spin mx-auto" />

                <p className="mt-5 text-[9px] tracking-[0.25em] text-white/30">
                  LOADING MEMBERSHIP SYSTEM
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* PLANS */}
              {isFreeTrial ? (
                <section className="mb-12">
                  <div className="rounded-3xl border border-[#ccff00]/20 bg-[#ccff00]/[0.03] p-8 text-center">
                    <p className="text-[9px] tracking-[0.3em] text-[#ccff00]">
                      PAYMENT NOT REQUIRED
                    </p>
                    <h2 className="text-3xl font-black mt-3">
                      YOUR 30-DAY FREE ACCESS IS ACTIVE
                    </h2>
                    <p className="text-sm text-white/40 mt-3 max-w-xl mx-auto leading-relaxed">
                      You can use X-FIT free for your first 30 days.
                      No UPI payment is required right now. Paid membership
                      plans will become available after your free trial ends.
                    </p>
                    <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-[#ccff00]/20 bg-black/40 px-5 py-3">
                      <span className="w-2 h-2 rounded-full bg-[#ccff00]" />
                      <span className="text-xs font-bold text-[#ccff00]">
                        {status?.trial_days_remaining ?? status?.remaining_days ?? 0} DAYS REMAINING
                      </span>
                    </div>
                  </div>
                </section>
              ) : (
              <section>
                <div className="mb-6 rounded-2xl border border-[#ccff00]/15 bg-[#ccff00]/[0.025] p-5">
                  <p className="text-[9px] tracking-[0.25em] text-[#ccff00]">
                    X-FIT UPI PAYMENT
                  </p>
                  <p className="text-xs text-white/45 mt-2 leading-relaxed">
                    Pay the selected amount using the X-FIT UPI method,
                    then press the payment button. Your membership stays
                    pending until the payment is manually verified.
                  </p>
                </div>

                <div className="flex items-end justify-between mb-6">
                  <div>
                    <p className="text-[9px] tracking-[0.25em] text-white/30">
                      SELECT PROTOCOL
                    </p>

                    <h2 className="text-2xl md:text-3xl font-black mt-2">
                      MEMBERSHIP PLANS
                    </h2>
                  </div>

                  <span className="hidden md:block text-[8px] tracking-[0.2em] text-[#ccff00]/60">
                    UPI PAYMENT • MANUAL VERIFICATION
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {plans.map((plan, index) => {
                    const planName =
                      plan.plan ||
                      plan.id ||
                      plan.name;

                    return (
                      <motion.div
                        key={planName || index}
                        initial={{
                          opacity: 0,
                          y: 25,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: index * 0.08,
                        }}
                        whileHover={{
                          y: -6,
                        }}
                        className="relative group"
                      >
                        <div className="absolute inset-0 rounded-3xl bg-[#ccff00]/[0.025] blur-xl opacity-0 group-hover:opacity-100 transition" />

                        <div className="relative h-full rounded-3xl border border-white/10 bg-black/65 backdrop-blur-xl p-7 overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ccff00]/50 to-transparent opacity-50" />

                          <div className="flex items-center justify-between">
                            <span className="text-[9px] tracking-[0.25em] text-[#ccff00]">
                              PROTOCOL 0{index + 1}
                            </span>

                            <span className="text-[8px] tracking-[0.15em] text-white/25">
                              {getDuration(plan)}
                            </span>
                          </div>

                          <h3 className="text-3xl font-black mt-7">
                            {formatPlanName(planName)}
                          </h3>

                          <div className="mt-6">
                            <span className="text-5xl font-black text-[#ccff00]">
                              {formatAmount(
                                getPaymentAmount(plan)
                              )}
                            </span>

                            <span className="text-xs text-white/25 ml-2">
                              INR
                            </span>
                          </div>

                          <div className="mt-7 space-y-3 border-t border-white/10 pt-6">
                            <Feature text="Workout performance tracking" />
                            <Feature text="Nutrition protocol access" />
                            <Feature text="MotionCheck analysis" />
                            <Feature text="Progress DNA analytics" />
                          </div>

                          <button
                            onClick={() =>
                              openPayment(plan)
                            }
                            disabled={processing}
                            className="w-full mt-8 py-4 rounded-xl bg-[#ccff00] text-black font-black text-xs tracking-[0.15em] hover:shadow-[0_0_35px_rgba(204,255,0,0.2)] transition disabled:opacity-40"
                          >
                            {processing
                              ? "PROCESSING..."
                              : "PAY USING UPI →"}
                          </button>

                          <p className="text-center text-[7px] tracking-[0.12em] text-white/20 mt-3">
                            PAY USING X-FIT UPI • MANUAL VERIFICATION
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
              )}

              {/* PAYMENT HISTORY */}
              <section className="mt-20">
                <div className="mb-6">
                  <p className="text-[9px] tracking-[0.25em] text-white/30">
                    TRANSACTION ARCHIVE
                  </p>

                  <h2 className="text-2xl md:text-3xl font-black mt-2">
                    PAYMENT HISTORY
                  </h2>
                </div>

                {history.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-black/50 p-8">
                    <p className="text-xs text-white/30">
                      No membership transactions recorded.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-black/55 overflow-hidden">
                    {history.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 md:px-7 py-5 border-b border-white/5 last:border-b-0"
                      >
                        <div>
                          <p className="font-bold text-sm">
                            {formatPlanName(
                              item.plan
                            )}
                          </p>

                          <p className="text-[9px] text-white/25 mt-1 tracking-[0.1em]">
                            {item.created_at
                              ? new Date(
                                  item.created_at
                                ).toLocaleString(
                                  "en-IN"
                                )
                              : "TRANSACTION"}
                          </p>
                        </div>

                        <div className="flex items-center gap-5">
                          <span className="text-sm font-black text-[#ccff00]">
                            {formatAmount(
                              item.amount
                            )}
                          </span>

                          <span
                            className={`text-[8px] tracking-[0.15em] px-3 py-1.5 rounded-full border ${
                              item.status === "paid"
                                ? "border-[#ccff00]/20 text-[#ccff00] bg-[#ccff00]/5"
                                : "border-white/10 text-white/30"
                            }`}
                          >
                            {String(
                              item.status || "UNKNOWN"
                            ).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {/* UPI PAYMENT MODAL */}
          {selectedPlan && !isFreeTrial && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-[#ccff00]/25 bg-[#080808] p-6 md:p-8 shadow-[0_0_80px_rgba(204,255,0,0.08)]"
              >
                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  disabled={processing}
                  className="absolute right-5 top-5 w-9 h-9 rounded-full border border-white/10 text-white/50 hover:text-[#ccff00] hover:border-[#ccff00]/30"
                >
                  ×
                </button>

                <p className="text-[9px] tracking-[0.3em] text-[#ccff00]">
                  X-FIT UPI PAYMENT
                </p>
                <h2 className="text-3xl font-black mt-3">COMPLETE PAYMENT</h2>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[9px] tracking-[0.2em] text-white/30">SELECTED PROTOCOL</p>
                    <p className="text-lg font-black mt-1">
                      {formatPlanName(getPlanKey(selectedPlan))}
                    </p>
                  </div>
                  <p className="text-2xl font-black text-[#ccff00]">
                    {formatAmount(getPaymentAmount(selectedPlan))}
                  </p>
                </div>

                <div className="mt-6 rounded-2xl border border-[#ccff00]/15 bg-white p-5 flex justify-center">
                  {getQrUrl(selectedPlan) ? (
                    <img
                      src={getQrUrl(selectedPlan)}
                      alt="X-FIT UPI payment QR code"
                      className="w-[260px] h-[260px] object-contain rounded-xl"
                    />
                  ) : (
                    <div className="w-[260px] h-[260px] flex items-center justify-center text-center text-black/60 text-sm font-semibold p-5">
                      UPI QR is not configured yet. Add VITE_XFIT_UPI_ID to your frontend environment.
                    </div>
                  )}
                </div>

                <div className="mt-5 text-center">
                  <p className="text-[9px] tracking-[0.25em] text-white/30">SCAN & PAY USING ANY UPI APP</p>
                  {upiId && (
                    <p className="mt-2 text-sm font-bold text-white/70">
                      UPI ID: <span className="text-[#ccff00]">{upiId}</span>
                    </p>
                  )}
                </div>

                {getUpiLink(selectedPlan) && (
                  <a
                    href={getUpiLink(selectedPlan)}
                    className="block w-full mt-5 py-3 rounded-xl border border-[#ccff00]/30 text-center text-[#ccff00] font-black text-xs tracking-[0.12em] hover:bg-[#ccff00]/10"
                  >
                    OPEN UPI APP →
                  </a>
                )}

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[9px] tracking-[0.2em] text-[#ccff00]">
                        PAYMENT PROOF
                      </p>
                      <p className="text-xs text-white/45 mt-2 leading-relaxed">
                        After completing the UPI payment, upload the payment screenshot for manual verification.
                      </p>
                    </div>

                    <label className="shrink-0 cursor-pointer rounded-xl border border-[#ccff00]/30 px-4 py-3 text-[9px] font-black tracking-[0.12em] text-[#ccff00] hover:bg-[#ccff00]/10 transition">
                      {paymentScreenshot ? "CHANGE" : "UPLOAD"}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0];

                          if (!file) return;

                          if (file.size > 5 * 1024 * 1024) {
                            setError("Payment screenshot must be 5 MB or smaller.");
                            event.target.value = "";
                            return;
                          }

                          setError("");
                          setPaymentScreenshot(file);
                        }}
                      />
                    </label>
                  </div>

                  {paymentScreenshot && (
                    <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-3 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/10 bg-white/5 shrink-0">
                        <img
                          src={paymentScreenshotPreview}
                          alt="Payment screenshot preview"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold truncate">
                          {paymentScreenshot.name}
                        </p>
                        <p className="text-[9px] text-white/30 mt-1">
                          {(paymentScreenshot.size / 1024 / 1024).toFixed(2)} MB • READY TO SUBMIT
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPaymentScreenshot(null)}
                        disabled={processing}
                        className="text-[9px] text-red-400 hover:text-red-300"
                      >
                        REMOVE
                      </button>
                    </div>
                  )}
                </div>

                <p className="mt-5 text-[10px] text-white/35 text-center leading-relaxed">
                  Complete the payment, upload the screenshot, then press <b className="text-white/60">I HAVE PAID & SUBMIT</b>.
                  Your membership will remain pending until an X-FIT admin manually verifies the payment.
                </p>

                <button
                  type="button"
                  onClick={() => startPayment(selectedPlan)}
                  disabled={processing || !upiId || !paymentScreenshot}
                  className="w-full mt-6 py-4 rounded-xl bg-[#ccff00] text-black font-black text-xs tracking-[0.15em] hover:shadow-[0_0_35px_rgba(204,255,0,0.2)] transition disabled:opacity-40"
                >
                  {processing ? "SUBMITTING..." : "I HAVE PAID & SUBMIT →"}
                </button>

                {!upiId && (
                  <p className="mt-3 text-center text-[9px] text-red-400">
                    Add VITE_XFIT_UPI_ID in Vercel Environment Variables before deploying.
                  </p>
                )}
              </motion.div>
            </div>
          )}

          {/* FOOTER */}
          <div className="mt-20 pt-7 border-t border-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-[8px] tracking-[0.2em] text-white/20">
              X-FIT // ATHLETE PERFORMANCE OPERATING SYSTEM
            </p>

            <p className="text-[8px] tracking-[0.15em] text-white/15">
              PAYMENT INFRASTRUCTURE
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]" />

      <span className="text-[10px] text-white/45">
        {text}
      </span>
    </div>
  );
}

export default Membership;