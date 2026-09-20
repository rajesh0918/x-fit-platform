import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import CinematicBackground from "../components/futuristic/CinematicBackground";
import { apiFetch } from "../services/api";


function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ==================================================
  // INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

    setError("");
  };


  // ==================================================
  // ERROR HELPER
  // ==================================================

  const getErrorMessage = (data) => {
    if (!data) {
      return "Registration failed.";
    }

    if (data.username) {
      return Array.isArray(
        data.username
      )
        ? data.username[0]
        : data.username;
    }

    if (data.email) {
      return Array.isArray(
        data.email
      )
        ? data.email[0]
        : data.email;
    }

    if (data.password) {
      return Array.isArray(
        data.password
      )
        ? data.password[0]
        : data.password;
    }

    if (data.error) {
      return data.error;
    }

    if (data.detail) {
      return data.detail;
    }

    return "Registration failed.";
  };


  // ==================================================
  // REGISTER
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response =
        await apiFetch(
          "/register/",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                username:
                  formData.username.trim(),

                email:
                  formData.email.trim(),

                password:
                  formData.password,
              }),
          }
        );


      const data =
        await response.json();


      if (response.ok) {
        navigate(
          "/login",
          {
            state: {
              message:
                "Registration successful. Please log in.",
            },
          }
        );

        return;
      }


      setError(
        getErrorMessage(data)
      );

    } catch (err) {
      console.error(
        err
      );

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
            navigate("/login")
          }
          className="text-sm text-[#a6ab9e] hover:text-[#ccff00] transition"
        >
          Already registered?

          <span className="text-[#ccff00] ml-2">
            Login →
          </span>
        </button>

      </div>


      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="relative z-20 min-h-screen grid xl:grid-cols-2">


        {/* ==================================================
            LEFT
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
            className="max-w-[630px]"
          >

            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#ccff00]/20 bg-black/20 backdrop-blur">

              <span className="w-2 h-2 rounded-full bg-[#ccff00] shadow-[0_0_10px_#ccff00]" />

              <span className="text-[#ccff00] text-[10px] tracking-[0.25em]">
                ATHLETE INITIALIZATION
              </span>

            </div>


            <h1 className="text-[88px] 2xl:text-[108px] leading-[0.88] font-black tracking-[-0.06em] mt-8">

              BUILD

              <br />

              YOUR

              <br />

              <span className="text-[#ccff00]">
                ATHLETE.
              </span>

            </h1>


            <p className="text-[#9da394] text-lg leading-relaxed mt-8 max-w-lg">

              Create your X-Fit identity, calibrate your training
              profile and unlock a personalized athlete operating
              system.

            </p>


            {/* ONBOARDING STEPS */}

            <div className="space-y-5 mt-12 max-w-lg">

              <OnboardingStep
                number="01"
                title="Create Identity"
                text="Register your X-Fit athlete account."
              />

              <OnboardingStep
                number="02"
                title="Calibrate"
                text="Complete your profile and fitness assessment."
              />

              <OnboardingStep
                number="03"
                title="Activate"
                text="Generate training, nutrition and Progress DNA."
              />

            </div>

          </motion.div>


          {/* DECORATION */}

          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 38,
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
            RIGHT FORM
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
                NEW ATHLETE CHANNEL READY
              </span>

            </div>


            {/* CARD */}

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/45 backdrop-blur-2xl p-7 md:p-10 shadow-[0_0_80px_rgba(204,255,0,0.04)]">

              <div className="absolute top-[-140px] right-[-120px] w-[320px] h-[320px] rounded-full bg-[#ccff00]/10 blur-[110px]" />


              <div className="relative z-10">

                <p className="text-[#ccff00] text-[10px] tracking-[0.28em]">
                  X-FIT ATHLETE OS
                </p>


                <h2 className="text-4xl md:text-5xl font-black mt-4 tracking-[-0.04em]">
                  CREATE ACCOUNT.
                </h2>


                <p className="text-[#8c9386] mt-4 leading-relaxed">
                  Initialize your athlete identity and begin
                  system calibration.
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
                      placeholder="Choose a username"
                      value={
                        formData.username
                      }
                      onChange={
                        handleChange
                      }
                      required
                      autoComplete="username"
                      className="xfit-register-input"
                    />

                  </AuthField>


                  {/* EMAIL */}

                  <AuthField
                    label="EMAIL"
                    className="mt-5"
                  >

                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={
                        formData.email
                      }
                      onChange={
                        handleChange
                      }
                      required
                      autoComplete="email"
                      className="xfit-register-input"
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
                        placeholder="Minimum 6 characters"
                        value={
                          formData.password
                        }
                        onChange={
                          handleChange
                        }
                        required
                        minLength={6}
                        autoComplete="new-password"
                        className="xfit-register-input pr-20"
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


                  {/* PASSWORD STRENGTH PREVIEW */}

                  <PasswordStrength
                    password={
                      formData.password
                    }
                  />


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
                      className="mt-5 bg-red-500/10 border border-red-500/30 rounded-xl p-4"
                    >

                      <p className="text-red-300 text-sm">
                        {error}
                      </p>

                    </motion.div>

                  )}


                  {/* SUBMIT */}

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

                          INITIALIZING ATHLETE

                        </span>
                      )
                      : "CREATE X-FIT ACCOUNT →"}

                  </motion.button>


                  {/* LOGIN */}

                  <p className="mt-6 text-center text-sm text-[#7d8478]">

                    Already have an account?

                    {" "}

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          "/login"
                        )
                      }
                      className="text-[#ccff00] font-bold hover:underline"
                    >
                      Login
                    </button>

                  </p>

                </form>

              </div>

            </div>


            {/* STATUS ROW */}

            <div className="grid grid-cols-3 gap-3 mt-5">

              <SmallStatus
                label="ACCOUNT"
                value="SECURE"
              />

              <SmallStatus
                label="AUTH"
                value="JWT"
              />

              <SmallStatus
                label="SYSTEM"
                value="READY"
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
          .xfit-register-input {
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

          .xfit-register-input::placeholder {
            color: #555c52;
          }

          .xfit-register-input:focus {
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
   PASSWORD STRENGTH
================================================== */

function PasswordStrength({
  password,
}) {
  let strength = 0;

  if (
    password.length >= 6
  ) {
    strength += 1;
  }

  if (
    password.length >= 10
  ) {
    strength += 1;
  }

  if (
    /[A-Z]/.test(
      password
    )
  ) {
    strength += 1;
  }

  if (
    /[0-9]/.test(
      password
    )
  ) {
    strength += 1;
  }


  const labels = [
    "WAITING",
    "BASIC",
    "GOOD",
    "STRONG",
    "SECURE",
  ];


  return (
    <div className="mt-4">

      <div className="flex gap-2">

        {[1, 2, 3, 4].map(
          (item) => (

            <div
              key={
                item
              }
              className={`h-[3px] flex-1 rounded-full ${
                item <= strength
                  ? "bg-[#ccff00]"
                  : "bg-white/10"
              }`}
            />

          )
        )}

      </div>


      <div className="flex justify-between mt-2">

        <p className="text-[#5e655b] text-[9px] tracking-widest">
          PASSWORD STRENGTH
        </p>

        <p className="text-[#ccff00] text-[9px] tracking-widest">
          {
            labels[
              strength
            ]
          }
        </p>

      </div>

    </div>
  );
}


/* ==================================================
   ONBOARDING STEP
================================================== */

function OnboardingStep({
  number,
  title,
  text,
}) {
  return (
    <div className="grid grid-cols-[50px_1fr] gap-4 border-t border-white/10 pt-4">

      <p className="text-[#ccff00] text-xs">
        {number}
      </p>

      <div>

        <p className="text-white font-bold">
          {title}
        </p>

        <p className="text-[#777e72] text-sm mt-1">
          {text}
        </p>

      </div>

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


export default Register;