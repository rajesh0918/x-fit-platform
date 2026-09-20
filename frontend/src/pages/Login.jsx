import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import CinematicBackground from "../components/futuristic/CinematicBackground";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ==================================================
  // INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  // ==================================================
  // LOGIN
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
    "https://x-fit-api.vercel.app/api/login/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: formData.username.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError("Invalid username or password.");
        return;
      }

      // ==================================================
      // SAVE JWT
      // ==================================================

      localStorage.setItem(
        "access",
        data.access
      );

      localStorage.setItem(
        "refresh",
        data.refresh
      );

      const headers = {
        Authorization: `Bearer ${data.access}`,
      };

      // ==================================================
      // CHECK PROFILE
      // ==================================================

      const profileResponse = await fetch(
        "http://127.0.0.1:8000/api/profile/",
        {
          headers,
        }
      );

      let profile = null;

      if (profileResponse.ok) {
        profile = await profileResponse.json();
      }

      const profileComplete =
        profile?.age &&
        profile?.height &&
        profile?.weight &&
        profile?.training_experience &&
        profile?.fitness_goal &&
        profile?.workout_days_per_week &&
        profile?.dietary_preference;

      if (!profileComplete) {
        navigate(
          "/profile",
          {
            replace: true,
          }
        );

        return;
      }

      // ==================================================
      // CHECK ACTIVE WORKOUT
      // ==================================================

      const workoutResponse = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/workouts/active/`,
        {
          headers,
        }
      );

      if (workoutResponse.ok) {
        navigate(
          "/dashboard",
          {
            replace: true,
          }
        );

        return;
      }

      if (workoutResponse.status === 404) {
        navigate(
          "/assessment",
          {
            replace: true,
          }
        );

        return;
      }

      setError(
        "Could not load your X-Fit account."
      );

    } catch (err) {
      console.error(err);

      setError(
        "Could not connect to the X-Fit server."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">

      <CinematicBackground />


      {/* ==================================================
          TOP BAR
      ================================================== */}

      <div className="absolute top-0 left-0 right-0 z-40 px-6 md:px-10 py-6 flex items-center justify-between">

        <button
          onClick={() =>
            navigate("/")
          }
          className="text-[#ccff00] text-3xl md:text-4xl font-black tracking-[-0.06em]"
        >
          X-FIT
        </button>


        <button
          onClick={() =>
            navigate("/register")
          }
          className="text-sm text-[#a6ab9e] hover:text-[#ccff00] transition"
        >
          New Athlete?
          <span className="text-[#ccff00] ml-2">
            Create Account →
          </span>
        </button>

      </div>


      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="relative z-20 min-h-screen grid xl:grid-cols-2">


        {/* ==================================================
            LEFT SIDE
        ================================================== */}

        <section className="hidden xl:flex relative items-center px-14 2xl:px-20">

          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.9,
            }}
            className="max-w-[620px]"
          >

            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#ccff00]/20 bg-black/20 backdrop-blur">

              <span className="w-2 h-2 rounded-full bg-[#ccff00] shadow-[0_0_10px_#ccff00]" />

              <span className="text-[#ccff00] text-[10px] tracking-[0.25em]">
                ATHLETE ACCESS TERMINAL
              </span>

            </div>


            <h1 className="text-[90px] 2xl:text-[110px] leading-[0.88] font-black tracking-[-0.06em] mt-8">

              ENTER

              <br />

              YOUR

              <br />

              <span className="text-[#ccff00]">
                SYSTEM.
              </span>

            </h1>


            <p className="text-[#9da394] text-lg leading-relaxed mt-8 max-w-lg">

              Access your training protocol, MotionCheck,
              nutrition engine and athlete intelligence
              from one synchronized X-Fit environment.

            </p>


            <div className="grid grid-cols-3 gap-5 mt-12 max-w-lg">

              <SystemMetric
                label="BODY OS"
                value="ONLINE"
              />

              <SystemMetric
                label="MOTION AI"
                value="READY"
              />

              <SystemMetric
                label="DNA"
                value="SYNCED"
              />

            </div>

          </motion.div>


          {/* DECORATIVE RINGS */}

          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute right-[-120px] top-1/2 -translate-y-1/2 w-[430px] h-[430px] rounded-full border border-[#ccff00]/10"
          />

          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 50,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute right-[-40px] top-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-[#ccff00]/10"
          />

        </section>


        {/* ==================================================
            RIGHT LOGIN PANEL
        ================================================== */}

        <section className="flex items-center justify-center px-5 md:px-10 py-24">

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
            }}
            className="w-full max-w-[520px]"
          >

            {/* STATUS */}

            <div className="flex items-center gap-2 mb-6">

              <span className="w-2 h-2 rounded-full bg-[#00ff95] shadow-[0_0_8px_#00ff95]" />

              <span className="text-[#6d7367] text-[10px] tracking-[0.22em]">
                SECURE AUTHENTICATION CHANNEL
              </span>

            </div>


            {/* CARD */}

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/45 backdrop-blur-2xl p-7 md:p-10 shadow-[0_0_80px_rgba(204,255,0,0.04)]">

              {/* GLOW */}

              <div className="absolute top-[-150px] right-[-120px] w-[320px] h-[320px] rounded-full bg-[#ccff00]/10 blur-[110px]" />


              <div className="relative z-10">

                <p className="text-[#ccff00] text-[10px] tracking-[0.28em]">
                  X-FIT ATHLETE OS
                </p>


                <h2 className="text-4xl md:text-5xl font-black mt-4 tracking-[-0.04em]">
                  WELCOME BACK.
                </h2>


                <p className="text-[#8c9386] mt-4 leading-relaxed">
                  Authenticate to continue your training system.
                </p>


                <form
                  onSubmit={handleSubmit}
                  className="mt-8"
                >

                  {/* USERNAME */}

                  <AuthField
                    label="USERNAME"
                  >

                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter username"
                      required
                      autoComplete="username"
                      className="xfit-auth-input"
                    />

                  </AuthField>


                  {/* PASSWORD */}

                  <AuthField
                    label="PASSWORD"
                    className="mt-5"
                  >

                    <div className="relative">

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        required
                        autoComplete="current-password"
                        className="xfit-auth-input pr-20"
                      />


                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (current) =>
                              !current
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] tracking-wider text-[#7f8678] hover:text-[#ccff00] transition"
                      >
                        {showPassword
                          ? "HIDE"
                          : "SHOW"}
                      </button>

                    </div>

                  </AuthField>


                  {/* ERROR */}

                  {error && (

                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="mt-5 border border-red-500/30 bg-red-500/10 rounded-xl p-4"
                    >

                      <p className="text-red-300 text-sm">
                        {error}
                      </p>

                    </motion.div>

                  )}


                  {/* LOGIN BUTTON */}

                  <motion.button
                    whileHover={{
                      scale: 1.01,
                    }}
                    whileTap={{
                      scale: 0.99,
                    }}
                    type="submit"
                    disabled={loading}
                    className="w-full mt-7 bg-[#ccff00] text-black font-black py-4 rounded-xl hover:bg-[#b8e600] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >

                    {loading
                      ? (
                        <span className="flex items-center justify-center gap-3">

                          <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />

                          AUTHENTICATING

                        </span>
                      )
                      : "ENTER X-FIT →"}

                  </motion.button>


                  {/* REGISTER */}

                  <p className="text-center text-[#7d8478] text-sm mt-6">

                    New to X-Fit?

                    {" "}

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          "/register"
                        )
                      }
                      className="text-[#ccff00] font-bold hover:underline"
                    >
                      Create Account
                    </button>

                  </p>

                </form>

              </div>

            </div>


            {/* SECURITY FOOTER */}

            <div className="grid grid-cols-3 gap-3 mt-5">

              <SmallStatus
                label="API"
                value="ONLINE"
              />

              <SmallStatus
                label="AUTH"
                value="JWT"
              />

              <SmallStatus
                label="STATUS"
                value="SECURE"
              />

            </div>

          </motion.div>

        </section>

      </main>


      {/* ==================================================
          INPUT STYLE
      ================================================== */}

      <style>
        {`
          .xfit-auth-input {
            width: 100%;
            padding: 16px 18px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.10);
            background: rgba(7,9,7,0.85);
            color: white;
            outline: none;
            transition:
              border-color .2s ease,
              box-shadow .2s ease,
              background .2s ease;
          }

          .xfit-auth-input::placeholder {
            color: #555c52;
          }

          .xfit-auth-input:focus {
            border-color: rgba(204,255,0,0.7);
            box-shadow:
              0 0 0 3px rgba(204,255,0,0.05);
            background: rgba(10,12,9,0.95);
          }
        `}
      </style>

    </div>
  );
}


/* ==================================================
   AUTH FIELD
================================================== */

function AuthField({
  label,
  children,
  className = "",
}) {
  return (
    <div className={className}>

      <label className="block text-[#747b70] text-[10px] tracking-[0.2em] mb-2">
        {label}
      </label>

      {children}

    </div>
  );
}


/* ==================================================
   SYSTEM METRIC
================================================== */

function SystemMetric({
  label,
  value,
}) {
  return (
    <div className="border-t border-white/10 pt-4">

      <p className="text-[#646b61] text-[9px] tracking-[0.2em]">
        {label}
      </p>

      <p className="text-[#ccff00] font-black mt-2">
        {value}
      </p>

    </div>
  );
}


/* ==================================================
   SMALL STATUS
================================================== */

function SmallStatus({
  label,
  value,
}) {
  return (
    <div className="bg-black/25 border border-white/5 rounded-xl p-3 text-center">

      <p className="text-[#585f55] text-[8px] tracking-[0.18em]">
        {label}
      </p>

      <p className="text-[#9fa698] text-[10px] font-bold mt-1">
        {value}
      </p>

    </div>
  );
}


export default Login;