import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import apiFetch from "../services/api";
import CinematicBackground from "../components/futuristic/CinematicBackground";


function Assessment() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    training_duration: "",
    days_per_week: "",
    equipment_familiarity: "",
    compound_experience: "",
    squat_confidence: "",
    pushup_confidence: "",
    curl_confidence: "",
    workout_location: "",
    structured_program: "",
  });

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  const [error, setError] = useState("");


  // ==================================================
  // COMPLETION
  // ==================================================

  const completion = useMemo(() => {
    const values = Object.values(formData);

    const completed = values.filter(
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
      [e.target.name]: e.target.value,
    });

    setError("");
  };


  // ==================================================
  // SUBMIT ASSESSMENT
  // ==================================================

  const calculateLevel = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await apiFetch(
        "/assessment/submit/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...formData,

            days_per_week:
              Number(formData.days_per_week),
          }),
        }
      );

      if (!response) {
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setResult({
          score: data.score,
          level: data.level,
        });

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        return;
      }

      setError(
        data.error ||
          data.detail ||
          getFirstError(data) ||
          "Assessment failed."
      );

    } catch (err) {
      console.error(
        "Assessment error:",
        err
      );

      setError(
        "Could not submit assessment."
      );

    } finally {
      setLoading(false);
    }
  };


  // ==================================================
  // GENERATE WORKOUT
  // ==================================================

  const generateWorkoutPlan = async () => {
    setGeneratingPlan(true);
    setError("");

    try {
      const response = await apiFetch(
        "/workouts/generate/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response) {
        return;
      }

      const data = await response.json();

      if (response.ok) {
        navigate(
          "/dashboard",
          {
            replace: true,
          }
        );

        return;
      }

      setError(
        data.error ||
          data.message ||
          getFirstError(data) ||
          "Could not generate workout plan."
      );

    } catch (err) {
      console.error(
        "Workout generation error:",
        err
      );

      setError(
        "Workout plan generation failed."
      );

    } finally {
      setGeneratingPlan(false);
    }
  };


  // ==================================================
  // RETAKE
  // ==================================================

  const handleRetake = () => {
    setResult(null);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden">

      <CinematicBackground />


      {/* ==================================================
          TOP NAV
      ================================================== */}

      <header className="relative z-30 px-6 md:px-10 py-6 flex items-center justify-between">

        <button
          onClick={() => navigate("/")}
          className="text-[#ccff00] text-3xl md:text-4xl font-black tracking-[-0.06em]"
        >
          X-FIT
        </button>


        <div className="hidden sm:flex items-center gap-3">

          <span className="w-2 h-2 rounded-full bg-[#00ff95] shadow-[0_0_8px_#00ff95]" />

          <span className="text-[#747b70] text-[10px] tracking-[0.22em]">
            CALIBRATION ENGINE ONLINE
          </span>

        </div>

      </header>


      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="relative z-20 max-w-[1500px] mx-auto px-6 md:px-10 pb-20">

        {!result ? (

          <div className="grid xl:grid-cols-12 gap-8">


            {/* ==================================================
                LEFT SIDE
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

                <p className="text-[#ccff00] text-[11px] tracking-[0.28em]">
                  X-FIT CALIBRATION
                </p>


                <h1 className="text-5xl md:text-6xl font-black tracking-[-0.055em] leading-[0.92] mt-5">

                  ATHLETE

                  <br />

                  <span className="text-[#ccff00]">
                    ASSESSMENT.
                  </span>

                </h1>


                <p className="text-[#92998c] leading-relaxed mt-6 max-w-md">
                  X-Fit analyzes your training history,
                  movement confidence and environment to
                  determine your current athlete level.
                </p>


                {/* PROGRESS */}

                <div className="mt-10 rounded-2xl border border-white/10 bg-black/35 backdrop-blur-xl p-6">

                  <div className="flex justify-between items-end">

                    <div>

                      <p className="text-[#62695f] text-[9px] tracking-[0.2em]">
                        ASSESSMENT COMPLETION
                      </p>

                      <p className="text-4xl font-black text-[#ccff00] mt-3">
                        {completion}%
                      </p>

                    </div>


                    <div className="relative w-14 h-14">

                      <div className="absolute inset-0 rounded-full border border-[#ccff00]/20" />

                      <motion.div
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-1 rounded-full border-t border-[#ccff00]"
                      />

                      <div className="absolute inset-0 flex items-center justify-center text-[#ccff00]">
                        ◈
                      </div>

                    </div>

                  </div>


                  <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-5">

                    <motion.div
                      animate={{
                        width: `${completion}%`,
                      }}
                      transition={{
                        duration: 0.35,
                      }}
                      className="h-full bg-[#ccff00] rounded-full shadow-[0_0_12px_rgba(204,255,0,0.5)]"
                    />

                  </div>

                </div>


                {/* FLOW */}

                <div className="mt-8 space-y-4">

                  <FlowStep
                    number="01"
                    title="Account"
                    status="COMPLETE"
                    completed
                  />

                  <FlowStep
                    number="02"
                    title="Athlete Profile"
                    status="COMPLETE"
                    completed
                  />

                  <FlowStep
                    number="03"
                    title="Assessment"
                    status="ACTIVE"
                    active
                  />

                  <FlowStep
                    number="04"
                    title="Training Protocol"
                    status="NEXT"
                  />

                </div>


                {/* INFO */}

                <div className="mt-8 border-l-2 border-[#ccff00]/40 pl-5">

                  <p className="text-[#ccff00] text-[9px] tracking-[0.2em]">
                    CALIBRATION NOTE
                  </p>

                  <p className="text-[#6f766c] text-sm mt-2 leading-relaxed">
                    Answer according to your current ability.
                    Your responses are used to determine the
                    appropriate starting protocol.
                  </p>

                </div>

              </div>

            </motion.aside>


            {/* ==================================================
                RIGHT FORM
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
                onSubmit={calculateLevel}
                className="space-y-6"
              >


                {/* ==============================================
                    TRAINING HISTORY
                ============================================== */}

                <AssessmentPanel
                  index="01"
                  title="Training History"
                  description="Establish your current training background."
                >

                  <div className="grid md:grid-cols-2 gap-5">

                    <AssessmentSelect
                      label="TRAINING DURATION"
                      hint="EXPERIENCE"
                      name="training_duration"
                      value={formData.training_duration}
                      onChange={handleChange}
                      options={[
                        {
                          value: "less_6",
                          label: "Less than 6 months",
                        },
                        {
                          value: "6_12",
                          label: "6–12 months",
                        },
                        {
                          value: "1_2",
                          label: "1–2 years",
                        },
                        {
                          value: "2_plus",
                          label: "More than 2 years",
                        },
                      ]}
                    />


                    <FieldGroup
                      label="TRAINING FREQUENCY"
                      hint="DAYS / WEEK"
                    >

                      <div className="relative">

                        <input
                          type="number"
                          name="days_per_week"
                          min="1"
                          max="7"
                          value={formData.days_per_week}
                          onChange={handleChange}
                          required
                          placeholder="Example: 4"
                          className="xfit-assessment-input pr-20"
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5c6359] text-[10px] tracking-wider">
                          DAYS
                        </span>

                      </div>

                    </FieldGroup>

                  </div>

                </AssessmentPanel>


                {/* ==============================================
                    TRAINING KNOWLEDGE
                ============================================== */}

                <AssessmentPanel
                  index="02"
                  title="Training Intelligence"
                  description="Measure your familiarity with resistance training."
                >

                  <div className="grid md:grid-cols-2 gap-5">

                    <AssessmentSelect
                      label="EQUIPMENT FAMILIARITY"
                      hint="GYM KNOWLEDGE"
                      name="equipment_familiarity"
                      value={formData.equipment_familiarity}
                      onChange={handleChange}
                      options={confidenceOptions}
                    />


                    <AssessmentSelect
                      label="COMPOUND EXPERIENCE"
                      hint="MOVEMENT KNOWLEDGE"
                      name="compound_experience"
                      value={formData.compound_experience}
                      onChange={handleChange}
                      options={confidenceOptions}
                    />

                  </div>

                </AssessmentPanel>


                {/* ==============================================
                    MOTION CONFIDENCE
                ============================================== */}

                <AssessmentPanel
                  index="03"
                  title="Motion Confidence"
                  description="Rate your confidence performing foundational movements."
                >

                  <div className="grid md:grid-cols-3 gap-5">

                    <ConfidenceCard
                      title="SQUAT"
                      code="SQ-01"
                      name="squat_confidence"
                      value={formData.squat_confidence}
                      onChange={handleChange}
                    />

                    <ConfidenceCard
                      title="PUSH-UP"
                      code="PU-02"
                      name="pushup_confidence"
                      value={formData.pushup_confidence}
                      onChange={handleChange}
                    />

                    <ConfidenceCard
                      title="BICEP CURL"
                      code="BC-03"
                      name="curl_confidence"
                      value={formData.curl_confidence}
                      onChange={handleChange}
                    />

                  </div>

                </AssessmentPanel>


                {/* ==============================================
                    ENVIRONMENT
                ============================================== */}

                <AssessmentPanel
                  index="04"
                  title="Training Environment"
                  description="Configure where and how you normally train."
                >

                  <div className="grid md:grid-cols-2 gap-5">

                    <AssessmentSelect
                      label="WORKOUT LOCATION"
                      hint="ENVIRONMENT"
                      name="workout_location"
                      value={formData.workout_location}
                      onChange={handleChange}
                      options={[
                        {
                          value: "gym",
                          label: "Gym",
                        },
                        {
                          value: "home",
                          label: "Home",
                        },
                        {
                          value: "both",
                          label: "Home + Gym",
                        },
                      ]}
                    />


                    <AssessmentSelect
                      label="STRUCTURED PROGRAM"
                      hint="PREVIOUS EXPERIENCE"
                      name="structured_program"
                      value={formData.structured_program}
                      onChange={handleChange}
                      options={[
                        {
                          value: "yes",
                          label: "Yes",
                        },
                        {
                          value: "no",
                          label: "No",
                        },
                      ]}
                    />

                  </div>

                </AssessmentPanel>


                {/* ERROR */}

                {error && (
                  <ErrorBox text={error} />
                )}


                {/* ==============================================
                    SUBMIT
                ============================================== */}

                <div className="relative overflow-hidden rounded-2xl border border-[#ccff00]/20 bg-black/40 backdrop-blur-xl p-6">

                  <div className="absolute right-[-100px] top-[-100px] w-[260px] h-[260px] rounded-full bg-[#ccff00]/10 blur-[100px]" />


                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">

                    <div>

                      <p className="text-[#ccff00] text-[9px] tracking-[0.22em]">
                        CALIBRATION ENGINE
                      </p>

                      <h3 className="font-bold text-lg mt-2">
                        Calculate Athlete Level
                      </h3>

                      <p className="text-[#777e73] text-sm mt-1">
                        {completion === 100
                          ? "All assessment parameters are ready."
                          : `${completion}% of calibration data received.`}
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
                      disabled={loading}
                      className="bg-[#ccff00] text-black font-black px-8 py-4 rounded-xl hover:bg-[#b8e600] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >

                      {loading ? (

                        <span className="flex items-center gap-3">

                          <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />

                          ANALYZING

                        </span>

                      ) : (
                        "CALCULATE MY LEVEL →"
                      )}

                    </motion.button>

                  </div>

                </div>

              </form>

            </motion.section>

          </div>

        ) : (

          /* ==================================================
             RESULT SCREEN
          ================================================== */

          <AssessmentResult
            result={result}
            error={error}
            generatingPlan={generatingPlan}
            onRetake={handleRetake}
            onGenerate={generateWorkoutPlan}
          />

        )}

      </main>


      {/* ==================================================
          INPUT CSS
      ================================================== */}

      <style>
        {`
          .xfit-assessment-input {
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

          .xfit-assessment-input::placeholder {
            color: #555c52;
          }

          .xfit-assessment-input:focus {
            border-color: rgba(204,255,0,0.7);

            box-shadow:
              0 0 0 3px rgba(204,255,0,0.05);

            background:
              rgba(10,12,9,0.95);
          }

          .xfit-assessment-input option {
            background: #101210;
            color: white;
          }
        `}
      </style>

    </div>
  );
}


/* ==================================================
   RESULT SCREEN
================================================== */

function AssessmentResult({
  result,
  error,
  generatingPlan,
  onRetake,
  onGenerate,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.96,
        y: 25,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        duration: 0.7,
      }}
      className="max-w-5xl mx-auto pt-8"
    >

      <div className="text-center">

        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#ccff00]/20 bg-[#ccff00]/5">

          <span className="w-2 h-2 rounded-full bg-[#ccff00] shadow-[0_0_10px_#ccff00]" />

          <span className="text-[#ccff00] text-[9px] tracking-[0.25em]">
            CALIBRATION COMPLETE
          </span>

        </div>


        <p className="text-[#6e756a] text-xs tracking-[0.25em] mt-10">
          X-FIT ATHLETE CLASSIFICATION
        </p>


        <h1 className="text-6xl md:text-8xl font-black text-[#ccff00] tracking-[-0.06em] mt-4 uppercase">
          {result.level}
        </h1>


        <p className="text-[#8b9286] max-w-xl mx-auto mt-5 leading-relaxed">
          Your calibration data has been processed.
          X-Fit can now construct your personalized
          training protocol.
        </p>

      </div>


      {/* RESULT GRID */}

      <div className="grid md:grid-cols-3 gap-5 mt-12">

        <ResultMetric
          label="ASSESSMENT SCORE"
          value={result.score}
          sub="CALIBRATION INDEX"
        />

        <ResultMetric
          label="ATHLETE LEVEL"
          value={result.level}
          sub="CLASSIFICATION"
        />

        <ResultMetric
          label="SYSTEM STATUS"
          value="READY"
          sub="PROTOCOL ENGINE"
        />

      </div>


      {/* VISUAL CORE */}

      <div className="relative flex items-center justify-center h-[320px] mt-8 overflow-hidden rounded-3xl border border-white/10 bg-black/35 backdrop-blur-xl">

        <div className="absolute w-[380px] h-[380px] rounded-full border border-[#ccff00]/10" />

        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-[280px] h-[280px] rounded-full border border-dashed border-[#ccff00]/25"
        />

        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-[200px] h-[200px] rounded-full border border-[#ccff00]/30"
        />


        <div className="absolute w-[150px] h-[150px] bg-[#ccff00]/10 rounded-full blur-[50px]" />


        <div className="relative text-center">

          <p className="text-[#646b61] text-[9px] tracking-[0.25em]">
            X-FIT SCORE
          </p>

          <p className="text-7xl font-black text-[#ccff00] mt-2">
            {result.score}
          </p>

          <p className="text-white font-bold mt-2 uppercase">
            {result.level}
          </p>

        </div>

      </div>


      {error && (
        <ErrorBox text={error} />
      )}


      {/* ACTIONS */}

      <div className="grid md:grid-cols-[1fr_2fr] gap-4 mt-6">

        <button
          onClick={onRetake}
          disabled={generatingPlan}
          className="border border-white/15 text-[#a2a99d] font-bold py-4 rounded-xl hover:border-[#ccff00]/50 hover:text-[#ccff00] transition disabled:opacity-50"
        >
          ← RETAKE ASSESSMENT
        </button>


        <motion.button
          whileHover={{
            scale: 1.01,
          }}
          whileTap={{
            scale: 0.99,
          }}
          onClick={onGenerate}
          disabled={generatingPlan}
          className="bg-[#ccff00] text-black font-black py-4 rounded-xl hover:bg-[#b8e600] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >

          {generatingPlan ? (

            <span className="flex items-center justify-center gap-3">

              <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />

              GENERATING TRAINING PROTOCOL

            </span>

          ) : (
            "GENERATE MY TRAINING PROTOCOL →"
          )}

        </motion.button>

      </div>

    </motion.div>
  );
}


/* ==================================================
   PANEL
================================================== */

function AssessmentPanel({
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
   FIELD
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
   SELECT
================================================== */

function AssessmentSelect({
  label,
  hint,
  name,
  value,
  onChange,
  options,
}) {
  return (
    <FieldGroup
      label={label}
      hint={hint}
    >

      <select
        name={name}
        value={value}
        onChange={onChange}
        required
        className="xfit-assessment-input"
      >

        <option value="">
          Select
        </option>


        {options.map(
          (option) => (

            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>

          )
        )}

      </select>

    </FieldGroup>
  );
}


/* ==================================================
   CONFIDENCE CARD
================================================== */

function ConfidenceCard({
  title,
  code,
  name,
  value,
  onChange,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#080a08]/70 p-5">

      <div className="flex justify-between items-center">

        <p className="font-black">
          {title}
        </p>

        <span className="text-[#555c52] text-[9px] tracking-widest">
          {code}
        </span>

      </div>


      <p className="text-[#646b61] text-[9px] tracking-[0.16em] mt-2">
        MOVEMENT CONFIDENCE
      </p>


      <div className="grid grid-cols-3 gap-2 mt-5">

        {confidenceOptions.map(
          (option) => {

            const selected =
              value === option.value;

            return (
              <label
                key={option.value}
                className={`cursor-pointer text-center py-3 rounded-lg border text-[10px] font-bold transition ${
                  selected
                    ? "bg-[#ccff00] text-black border-[#ccff00]"
                    : "bg-black/30 text-[#747b70] border-white/10 hover:border-[#ccff00]/30"
                }`}
              >

                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={selected}
                  onChange={onChange}
                  required
                  className="hidden"
                />

                {option.label.toUpperCase()}

              </label>
            );
          }
        )}

      </div>

    </div>
  );
}


/* ==================================================
   FLOW STEP
================================================== */

function FlowStep({
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
   RESULT METRIC
================================================== */

function ResultMetric({
  label,
  value,
  sub,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/35 backdrop-blur-xl p-6">

      <p className="text-[#62695f] text-[9px] tracking-[0.2em]">
        {label}
      </p>

      <p className="text-2xl font-black text-white mt-3 uppercase">
        {value}
      </p>

      <p className="text-[#ccff00] text-[8px] tracking-[0.18em] mt-2">
        {sub}
      </p>

    </div>
  );
}


/* ==================================================
   ERROR
================================================== */

function ErrorBox({
  text,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -5,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="mt-6 bg-red-500/10 border border-red-500/40 text-red-300 p-4 rounded-xl"
    >
      {text}
    </motion.div>
  );
}


/* ==================================================
   OPTIONS
================================================== */

const confidenceOptions = [
  {
    value: "low",
    label: "Low",
  },
  {
    value: "medium",
    label: "Medium",
  },
  {
    value: "high",
    label: "High",
  },
];


/* ==================================================
   ERROR HELPER
================================================== */

function getFirstError(data) {
  if (
    !data ||
    typeof data !== "object"
  ) {
    return null;
  }

  for (
    const value of Object.values(data)
  ) {
    if (
      Array.isArray(value) &&
      value.length > 0
    ) {
      return String(value[0]);
    }

    if (
      typeof value === "string"
    ) {
      return value;
    }
  }

  return null;
}


export default Assessment;