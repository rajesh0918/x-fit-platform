import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import apiFetch from "../services/api";
import CinematicBackground from "../components/futuristic/CinematicBackground";


function Profile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    training_experience: "",
    fitness_goal: "",
    workout_days_per_week: "",
    dietary_preference: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");


  // ==================================================
  // LOAD PROFILE
  // ==================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch(
          "/profile/"
        );

        if (!response) {
          return;
        }

        const data =
          await response.json();

        if (response.ok) {
          setFormData({
            name: data.name || "",
            age: data.age || "",
            height: data.height || "",
            weight: data.weight || "",
            training_experience:
              data.training_experience || "",
            fitness_goal:
              data.fitness_goal || "",
            workout_days_per_week:
              data.workout_days_per_week || "",
            dietary_preference:
              data.dietary_preference || "",
          });

          return;
        }

        setError(
          data.error ||
          data.detail ||
          "Could not load profile."
        );

      } catch (err) {
        console.error(
          "Profile load error:",
          err
        );

        setError(
          "Could not load your profile."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

  }, []);


  // ==================================================
  // COMPLETION
  // ==================================================

  const completion = useMemo(() => {
    const values = Object.values(
      formData
    );

    const completed =
      values.filter(
        (value) =>
          value !== "" &&
          value !== null &&
          value !== undefined
      ).length;

    return Math.round(
      (completed / values.length) * 100
    );
  }, [formData]);


  // ==================================================
  // INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

    setMessage("");
    setError("");
  };


  // ==================================================
  // SAVE PROFILE
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setSaving(true);

    try {
      const response =
        await apiFetch(
          "/profile/",
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name:
                formData.name.trim(),

              age:
                formData.age
                  ? Number(
                      formData.age
                    )
                  : null,

              height:
                formData.height
                  ? Number(
                      formData.height
                    )
                  : null,

              weight:
                formData.weight
                  ? Number(
                      formData.weight
                    )
                  : null,

              training_experience:
                formData.training_experience,

              fitness_goal:
                formData.fitness_goal,

              workout_days_per_week:
                formData.workout_days_per_week
                  ? Number(
                      formData
                        .workout_days_per_week
                    )
                  : null,

              dietary_preference:
                formData.dietary_preference,
            }),
          }
        );

      if (!response) {
        return;
      }

      const data =
        await response.json();

      if (response.ok) {
        setMessage(
          "Athlete profile calibrated successfully."
        );

        setTimeout(() => {
          navigate(
            "/assessment",
            {
              replace: true,
            }
          );
        }, 700);

        return;
      }

      if (data.name) {
        setError(
          getErrorText(
            data.name
          )
        );

        return;
      }

      if (data.age) {
        setError(
          getErrorText(
            data.age
          )
        );

        return;
      }

      if (data.height) {
        setError(
          getErrorText(
            data.height
          )
        );

        return;
      }

      if (data.weight) {
        setError(
          getErrorText(
            data.weight
          )
        );

        return;
      }

      if (
        data.training_experience
      ) {
        setError(
          getErrorText(
            data.training_experience
          )
        );

        return;
      }

      if (data.fitness_goal) {
        setError(
          getErrorText(
            data.fitness_goal
          )
        );

        return;
      }

      if (
        data.workout_days_per_week
      ) {
        setError(
          getErrorText(
            data.workout_days_per_week
          )
        );

        return;
      }

      if (
        data.dietary_preference
      ) {
        setError(
          getErrorText(
            data.dietary_preference
          )
        );

        return;
      }

      setError(
        data.error ||
        data.detail ||
        "Could not save profile."
      );

    } catch (err) {
      console.error(
        "Profile save error:",
        err
      );

      setError(
        "Could not save your profile."
      );

    } finally {
      setSaving(false);
    }
  };


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#050505] text-white flex items-center justify-center overflow-hidden">

        <CinematicBackground />

        <div className="relative z-20 text-center">

          <div className="w-16 h-16 border-2 border-[#ccff00]/20 border-t-[#ccff00] rounded-full animate-spin mx-auto" />

          <p className="text-[#ccff00] text-xs tracking-[0.28em] mt-6">
            INITIALIZING ATHLETE PROFILE
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden">

      <CinematicBackground />


      {/* ==================================================
          TOP BAR
      ================================================== */}

      <div className="relative z-30 px-6 md:px-10 py-6 flex items-center justify-between">

        <button
          onClick={() =>
            navigate("/")
          }
          className="text-[#ccff00] text-3xl md:text-4xl font-black tracking-[-0.06em]"
        >
          X-FIT
        </button>


        <div className="hidden sm:flex items-center gap-3">

          <span className="w-2 h-2 rounded-full bg-[#00ff95] shadow-[0_0_8px_#00ff95]" />

          <span className="text-[#747b70] text-[10px] tracking-[0.2em]">
            ATHLETE CALIBRATION ACTIVE
          </span>

        </div>

      </div>


      {/* ==================================================
          MAIN GRID
      ================================================== */}

      <main className="relative z-20 max-w-[1500px] mx-auto px-6 md:px-10 pb-16">

        <div className="grid xl:grid-cols-12 gap-8">


          {/* ==================================================
              LEFT SIDEBAR
          ================================================== */}

          <motion.aside
            initial={{
              opacity: 0,
              x: -30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="xl:col-span-4"
          >

            <div className="xl:sticky xl:top-8">

              <p className="text-[#ccff00] text-xs tracking-[0.28em]">
                X-FIT ONBOARDING
              </p>


              <h1 className="text-5xl md:text-6xl font-black tracking-[-0.05em] mt-5 leading-[0.95]">

                ATHLETE

                <br />

                <span className="text-[#ccff00]">
                  CALIBRATION.
                </span>

              </h1>


              <p className="text-[#92998c] leading-relaxed mt-6 max-w-md">
                Build the data layer X-Fit will use to generate
                your training and nutrition protocols.
              </p>


              {/* PROGRESS */}

              <div className="mt-10 bg-black/35 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">

                <div className="flex items-end justify-between">

                  <div>

                    <p className="text-[#636a60] text-[9px] tracking-[0.2em]">
                      PROFILE COMPLETION
                    </p>

                    <p className="text-4xl font-black text-[#ccff00] mt-3">
                      {completion}%
                    </p>

                  </div>


                  <span className="text-[#ccff00] text-xl">
                    ◈
                  </span>

                </div>


                <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-5">

                  <motion.div
                    animate={{
                      width:
                        `${completion}%`,
                    }}
                    transition={{
                      duration: 0.4,
                    }}
                    className="h-full bg-[#ccff00] rounded-full shadow-[0_0_12px_rgba(204,255,0,0.5)]"
                  />

                </div>

              </div>


              {/* ONBOARDING STEPS */}

              <div className="mt-8 space-y-4">

                <CalibrationStep
                  number="01"
                  title="Account"
                  status="COMPLETE"
                  completed
                />

                <CalibrationStep
                  number="02"
                  title="Athlete Profile"
                  status="ACTIVE"
                  active
                />

                <CalibrationStep
                  number="03"
                  title="Assessment"
                  status="NEXT"
                />

                <CalibrationStep
                  number="04"
                  title="Training Protocol"
                  status="LOCKED"
                />

              </div>

            </div>

          </motion.aside>


          {/* ==================================================
              FORM AREA
          ================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.1,
            }}
            className="xl:col-span-8"
          >

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-6"
            >


              {/* ==================================================
                  PERSONAL DATA
              ================================================== */}

              <CalibrationPanel
                index="01"
                title="Personal Data"
                description="Basic biometric information used by the athlete system."
              >

                <div className="grid md:grid-cols-2 gap-5">

                  <FieldGroup
                    label="NAME"
                    hint="ATHLETE IDENTITY"
                  >
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={
                        formData.name
                      }
                      onChange={
                        handleChange
                      }
                      required
                      className="xfit-profile-input"
                    />
                  </FieldGroup>


                  <FieldGroup
                    label="AGE"
                    hint="YEARS"
                  >
                    <input
                      type="number"
                      name="age"
                      placeholder="22"
                      min="10"
                      max="100"
                      value={
                        formData.age
                      }
                      onChange={
                        handleChange
                      }
                      required
                      className="xfit-profile-input"
                    />
                  </FieldGroup>


                  <FieldGroup
                    label="HEIGHT"
                    hint="CENTIMETERS"
                  >
                    <div className="relative">

                      <input
                        type="number"
                        name="height"
                        placeholder="175"
                        min="100"
                        max="250"
                        step="0.1"
                        value={
                          formData.height
                        }
                        onChange={
                          handleChange
                        }
                        required
                        className="xfit-profile-input pr-16"
                      />

                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5f665c] text-xs">
                        CM
                      </span>

                    </div>
                  </FieldGroup>


                  <FieldGroup
                    label="WEIGHT"
                    hint="KILOGRAMS"
                  >
                    <div className="relative">

                      <input
                        type="number"
                        name="weight"
                        placeholder="75"
                        min="30"
                        max="300"
                        step="0.1"
                        value={
                          formData.weight
                        }
                        onChange={
                          handleChange
                        }
                        required
                        className="xfit-profile-input pr-16"
                      />

                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5f665c] text-xs">
                        KG
                      </span>

                    </div>
                  </FieldGroup>

                </div>

              </CalibrationPanel>


              {/* ==================================================
                  TRAINING INTELLIGENCE
              ================================================== */}

              <CalibrationPanel
                index="02"
                title="Training Intelligence"
                description="Define your current experience and primary training objective."
              >

                <div className="grid md:grid-cols-2 gap-5">

                  <FieldGroup
                    label="TRAINING EXPERIENCE"
                    hint="CURRENT LEVEL"
                  >

                    <select
                      name="training_experience"
                      value={
                        formData.training_experience
                      }
                      onChange={
                        handleChange
                      }
                      required
                      className="xfit-profile-input"
                    >

                      <option value="">
                        Select experience
                      </option>

                      <option value="beginner">
                        Beginner
                      </option>

                      <option value="intermediate">
                        Intermediate
                      </option>

                      <option value="advanced">
                        Advanced
                      </option>

                    </select>

                  </FieldGroup>


                  <FieldGroup
                    label="FITNESS GOAL"
                    hint="PRIMARY OBJECTIVE"
                  >

                    <select
                      name="fitness_goal"
                      value={
                        formData.fitness_goal
                      }
                      onChange={
                        handleChange
                      }
                      required
                      className="xfit-profile-input"
                    >

                      <option value="">
                        Select goal
                      </option>

                      <option value="fat_loss">
                        Fat Loss
                      </option>

                      <option value="muscle_gain">
                        Muscle Gain
                      </option>

                      <option value="strength">
                        Strength
                      </option>

                      <option value="general_fitness">
                        General Fitness
                      </option>

                    </select>

                  </FieldGroup>

                </div>

              </CalibrationPanel>


              {/* ==================================================
                  PROTOCOL SETTINGS
              ================================================== */}

              <CalibrationPanel
                index="03"
                title="Protocol Settings"
                description="Define how X-Fit should structure your weekly training and nutrition."
              >

                <div className="grid md:grid-cols-2 gap-5">

                  <FieldGroup
                    label="WORKOUT DAYS / WEEK"
                    hint="1–7 DAYS"
                  >

                    <input
                      type="number"
                      name="workout_days_per_week"
                      placeholder="4"
                      min="1"
                      max="7"
                      value={
                        formData.workout_days_per_week
                      }
                      onChange={
                        handleChange
                      }
                      required
                      className="xfit-profile-input"
                    />

                  </FieldGroup>


                  <FieldGroup
                    label="DIETARY PREFERENCE"
                    hint="NUTRITION MODE"
                  >

                    <select
                      name="dietary_preference"
                      value={
                        formData.dietary_preference
                      }
                      onChange={
                        handleChange
                      }
                      required
                      className="xfit-profile-input"
                    >

                      <option value="">
                        Select preference
                      </option>

                      <option value="vegetarian">
                        Vegetarian
                      </option>

                      <option value="non_vegetarian">
                        Non-Vegetarian
                      </option>

                      <option value="vegan">
                        Vegan
                      </option>

                    </select>

                  </FieldGroup>

                </div>

              </CalibrationPanel>


              {/* ==================================================
                  ERROR / SUCCESS
              ================================================== */}

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
                  className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-4"
                >
                  {error}
                </motion.div>

              )}


              {message && (

                <motion.div
                  initial={{
                    opacity: 0,
                    y: -5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] rounded-xl p-4"
                >
                  {message}
                </motion.div>

              )}


              {/* ==================================================
                  SUBMIT
              ================================================== */}

              <div className="relative overflow-hidden rounded-2xl border border-[#ccff00]/20 bg-black/40 backdrop-blur-xl p-6">

                <div className="absolute right-[-100px] top-[-100px] w-[250px] h-[250px] bg-[#ccff00]/10 rounded-full blur-[100px]" />


                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                  <div>

                    <p className="text-[#ccff00] text-[10px] tracking-[0.22em]">
                      NEXT STAGE
                    </p>

                    <p className="font-bold text-lg mt-2">
                      Athlete Assessment
                    </p>

                    <p className="text-[#777e73] text-sm mt-1">
                      X-Fit will calculate your training level next.
                    </p>

                  </div>


                  <motion.button
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    type="submit"
                    disabled={
                      saving
                    }
                    className="bg-[#ccff00] text-black font-black px-8 py-4 rounded-xl hover:bg-[#b8e600] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >

                    {saving
                      ? (
                        <span className="flex items-center gap-3">

                          <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />

                          CALIBRATING

                        </span>
                      )
                      : "SAVE & BEGIN ASSESSMENT →"}

                  </motion.button>

                </div>

              </div>

            </form>

          </motion.section>

        </div>

      </main>


      {/* ==================================================
          INPUT STYLES
      ================================================== */}

      <style>
        {`
          .xfit-profile-input {
            width: 100%;
            padding: 16px 18px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.10);
            background: rgba(7,9,7,0.82);
            color: white;
            outline: none;
            transition:
              border-color .2s ease,
              box-shadow .2s ease,
              background .2s ease;
          }

          .xfit-profile-input::placeholder {
            color: #555c52;
          }

          .xfit-profile-input:focus {
            border-color: rgba(204,255,0,0.7);
            box-shadow:
              0 0 0 3px rgba(204,255,0,0.05);
            background: rgba(10,12,9,0.95);
          }

          .xfit-profile-input option {
            background: #101210;
            color: white;
          }
        `}
      </style>

    </div>
  );
}


/* ==================================================
   CALIBRATION PANEL
================================================== */

function CalibrationPanel({
  index,
  title,
  description,
  children,
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/35 backdrop-blur-xl p-6 md:p-8">

      <div className="absolute right-[-120px] top-[-120px] w-[260px] h-[260px] bg-[#ccff00]/5 rounded-full blur-[100px]" />


      <div className="relative z-10">

        <div className="flex gap-4 items-start mb-7">

          <div className="w-11 h-11 rounded-xl border border-[#ccff00]/25 bg-[#ccff00]/5 flex items-center justify-center text-[#ccff00] font-black">
            {index}
          </div>


          <div>

            <h2 className="text-2xl font-black">
              {title}
            </h2>

            <p className="text-[#7f8679] text-sm mt-1">
              {description}
            </p>

          </div>

        </div>


        {children}

      </div>

    </section>
  );
}


/* ==================================================
   FIELD GROUP
================================================== */

function FieldGroup({
  label,
  hint,
  children,
}) {
  return (
    <div>

      <div className="flex justify-between gap-3 mb-2">

        <label className="text-[#81887c] text-[10px] tracking-[0.18em]">
          {label}
        </label>

        <span className="text-[#51574f] text-[9px] tracking-wider">
          {hint}
        </span>

      </div>

      {children}

    </div>
  );
}


/* ==================================================
   CALIBRATION STEP
================================================== */

function CalibrationStep({
  number,
  title,
  status,
  active = false,
  completed = false,
}) {
  return (
    <div
      className={`grid grid-cols-[46px_1fr_auto] gap-3 items-center rounded-xl border p-4 ${
        active
          ? "border-[#ccff00]/40 bg-[#ccff00]/8"
          : completed
          ? "border-[#00ff95]/20 bg-[#00ff95]/5"
          : "border-white/5 bg-black/20"
      }`}
    >

      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black ${
          completed
            ? "bg-[#00ff95] text-black"
            : active
            ? "bg-[#ccff00] text-black"
            : "bg-white/5 text-[#646b61]"
        }`}
      >
        {completed
          ? "✓"
          : number}
      </div>


      <p
        className={`font-bold ${
          active
            ? "text-white"
            : completed
            ? "text-[#00ff95]"
            : "text-[#858c80]"
        }`}
      >
        {title}
      </p>


      <span
        className={`text-[8px] tracking-[0.18em] ${
          active
            ? "text-[#ccff00]"
            : completed
            ? "text-[#00ff95]"
            : "text-[#50564e]"
        }`}
      >
        {status}
      </span>

    </div>
  );
}


/* ==================================================
   ERROR HELPER
================================================== */

function getErrorText(
  value
) {
  if (
    Array.isArray(value)
  ) {
    return value[0];
  }

  return String(value);
}


export default Profile;