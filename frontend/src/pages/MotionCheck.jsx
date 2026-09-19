import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
} from "framer-motion";

import apiFetch from "../services/api";
import CinematicBackground from "../components/futuristic/CinematicBackground";


function MotionCheck() {
  const navigate = useNavigate();

  const [exercise, setExercise] =
    useState("squat");

  const [video, setVideo] =
    useState(null);

  const [previewUrl, setPreviewUrl] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [result, setResult] =
    useState(null);


  // ==================================================
  // EXERCISE CONFIG
  // ==================================================

  const exerciseConfig = {
    squat: {
      label: "Squat",
      code: "SQ-01",

      endpoint:
        "/motioncheck/squat/analyze/",

      description:
        "Analyze squat depth, movement quality and repetition performance.",

      focus:
        "Depth + Control",

      icon:
        "◢",
    },

    pushup: {
      label: "Push-Up",
      code: "PU-02",

      endpoint:
        "/motioncheck/pushup/analyze/",

      description:
        "Analyze push-up repetitions and upper-body movement quality.",

      focus:
        "Alignment + Range",

      icon:
        "◫",
    },

    bicep_curl: {
      label: "Bicep Curl",
      code: "BC-03",

      endpoint:
        "/motioncheck/bicep-curl/analyze/",

      description:
        "Analyze elbow movement, rep quality and curl technique.",

      focus:
        "Elbow + Control",

      icon:
        "◒",
    },
  };


  // ==================================================
  // VIDEO CHANGE
  // ==================================================

  const handleVideoChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    setVideo(file);
    setResult(null);
    setError("");

    if (previewUrl) {
      URL.revokeObjectURL(
        previewUrl
      );
    }

    const newPreview =
      URL.createObjectURL(
        file
      );

    setPreviewUrl(
      newPreview
    );
  };


  // ==================================================
  // ANALYZE VIDEO
  // ==================================================

  const analyzeVideo = async (e) => {
    e.preventDefault();

    if (!video) {
      setError(
        "Please select a workout video first."
      );

      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData =
        new FormData();

      formData.append(
        "video",
        video
      );

      const response =
        await apiFetch(
          exerciseConfig[
            exercise
          ].endpoint,
          {
            method: "POST",

            body:
              formData,
          }
        );

      if (!response) {
        return;
      }

      const data =
        await response.json();

      if (response.ok) {
        setResult(data);

        setTimeout(() => {
          document
            .getElementById(
              "motion-result"
            )
            ?.scrollIntoView({
              behavior:
                "smooth",

              block:
                "start",
            });
        }, 100);

        return;
      }

      setError(
        data.error ||
        data.detail ||
        data.details ||
        "MotionCheck analysis failed."
      );

    } catch (err) {
      console.error(
        "MotionCheck error:",
        err
      );

      setError(
        "Could not analyze the workout video."
      );

    } finally {
      setLoading(false);
    }
  };


  // ==================================================
  // RESET
  // ==================================================

  const resetAnalysis = () => {
    setVideo(null);
    setResult(null);
    setError("");

    if (previewUrl) {
      URL.revokeObjectURL(
        previewUrl
      );
    }

    setPreviewUrl("");
  };


  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden">

      <CinematicBackground />


      {/* ==================================================
          NAVBAR
      ================================================== */}

      <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-black/35 backdrop-blur-2xl border-b border-white/5">

        <div className="max-w-[1500px] mx-auto h-full px-5 md:px-10 flex items-center justify-between">

          <button
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
            className="text-[#ccff00] text-4xl font-black tracking-[-0.06em]"
          >
            X-FIT
          </button>


          <div className="hidden lg:flex items-center gap-8 h-full">

            <NavButton
              text="Today"
              onClick={() =>
                navigate(
                  "/dashboard"
                )
              }
            />

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
              active
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

          </div>


          <div className="flex items-center gap-3">

            <button
              onClick={() =>
                navigate(
                  "/motioncheck-history"
                )
              }
              className="hidden sm:block border border-white/10 bg-black/30 px-4 py-2 rounded-full text-[#92998c] text-sm hover:text-[#ccff00] hover:border-[#ccff00]/30 transition"
            >
              History
            </button>


            <button
              onClick={() =>
                navigate(
                  "/profile"
                )
              }
              className="w-10 h-10 border border-white/10 bg-black/30 rounded-full text-[#ccff00] hover:bg-[#ccff00] hover:text-black transition"
            >
              ◉
            </button>

          </div>

        </div>

      </nav>


      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="relative z-20 max-w-[1500px] mx-auto px-5 md:px-10 pt-[115px] pb-24">


        {/* ==================================================
            HEADER
        ================================================== */}

        <motion.header
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-10"
        >

          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">

            <div>

              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#ccff00]/20 bg-black/30">

                <span className="w-2 h-2 rounded-full bg-[#ccff00] shadow-[0_0_10px_#ccff00]" />

                <span className="text-[#ccff00] text-[10px] tracking-[0.25em]">
                  AI MOVEMENT INTELLIGENCE
                </span>

              </div>


              <h1 className="text-5xl md:text-7xl xl:text-8xl font-black tracking-[-0.06em] leading-[0.9] mt-6">

                MOTION

                <span className="text-[#ccff00]">
                  CHECK.
                </span>

              </h1>


              <p className="text-[#92998c] text-lg max-w-3xl mt-6 leading-relaxed">
                Upload a training video and let X-Fit analyze
                repetitions, movement quality and exercise technique.
              </p>

            </div>


            <div className="grid grid-cols-2 gap-3">

              <HeaderMetric
                label="AI ENGINE"
                value="ONLINE"
              />

              <HeaderMetric
                label="MOVEMENTS"
                value="03"
              />

            </div>

          </div>

        </motion.header>


        {/* ==================================================
            EXERCISE SELECTOR
        ================================================== */}

        <section className="mb-7">

          <p className="text-[#62695f] text-[9px] tracking-[0.22em] mb-4">
            SELECT MOVEMENT PROTOCOL
          </p>


          <div className="grid md:grid-cols-3 gap-4">

            {Object.entries(
              exerciseConfig
            ).map(
              ([
                key,
                config,
              ]) => {

                const active =
                  exercise ===
                  key;


                return (
                  <motion.button
                    whileHover={{
                      y: -3,
                    }}
                    key={key}
                    type="button"
                    onClick={() => {
                      setExercise(
                        key
                      );

                      setResult(
                        null
                      );

                      setError(
                        ""
                      );
                    }}
                    className={`relative overflow-hidden text-left rounded-2xl border p-5 transition ${
                      active
                        ? "bg-[#ccff00]/10 border-[#ccff00]/40"
                        : "bg-black/30 border-white/10 hover:border-[#ccff00]/25"
                    }`}
                  >

                    {active && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ccff00]" />
                    )}


                    <div className="flex items-start justify-between gap-4">

                      <div
                        className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xl ${
                          active
                            ? "bg-[#ccff00] border-[#ccff00] text-black"
                            : "bg-[#ccff00]/5 border-[#ccff00]/15 text-[#ccff00]"
                        }`}
                      >
                        {config.icon}
                      </div>


                      <span className="text-[#555c52] text-[9px] tracking-widest">
                        {config.code}
                      </span>

                    </div>


                    <h2
                      className={`text-2xl font-black mt-5 ${
                        active
                          ? "text-[#ccff00]"
                          : "text-white"
                      }`}
                    >
                      {config.label}
                    </h2>


                    <p className="text-[#7d8478] text-sm mt-2 leading-relaxed">
                      {config.description}
                    </p>


                    <p className="text-[#5f665c] text-[9px] tracking-[0.16em] mt-5">
                      FOCUS //{" "}
                      <span className="text-[#ccff00]">
                        {config.focus}
                      </span>
                    </p>

                  </motion.button>
                );
              }
            )}

          </div>

        </section>


        {/* ==================================================
            ANALYSIS LAB
        ================================================== */}

        <section className="grid xl:grid-cols-12 gap-5">


          {/* ==================================================
              VIDEO LAB
          ================================================== */}

          <div className="xl:col-span-8">

            <form
              onSubmit={
                analyzeVideo
              }
              className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black/35 backdrop-blur-xl p-6 md:p-8"
            >

              <div className="absolute right-[-150px] top-[-150px] w-[400px] h-[400px] rounded-full bg-[#ccff00]/7 blur-[140px]" />


              <div className="relative z-10">

                <div className="flex items-start justify-between gap-5">

                  <div>

                    <p className="text-[#ccff00] text-[9px] tracking-[0.24em]">
                      MOVEMENT INPUT
                    </p>

                    <h2 className="text-3xl font-black mt-2">
                      {
                        exerciseConfig[
                          exercise
                        ].label
                      } Analysis
                    </h2>

                  </div>


                  <div className="hidden sm:block text-right">

                    <p className="text-[#5f665c] text-[9px] tracking-[0.18em]">
                      ANALYSIS MODE
                    </p>

                    <p className="text-[#00ff95] font-bold text-sm mt-2">
                      VIDEO
                    </p>

                  </div>

                </div>


                {/* ==============================================
                    VIDEO AREA
                ============================================== */}

                <label className="block mt-7 cursor-pointer">

                  <div className="relative min-h-[420px] border border-dashed border-white/15 rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center hover:border-[#ccff00]/40 transition">

                    {/* GRID */}

                    <div
                      className="absolute inset-0 opacity-[0.08]"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(204,255,0,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,0.2) 1px, transparent 1px)",

                        backgroundSize:
                          "35px 35px",
                      }}
                    />


                    {/* CORNERS */}

                    <ScanCorner position="top-left" />
                    <ScanCorner position="top-right" />
                    <ScanCorner position="bottom-left" />
                    <ScanCorner position="bottom-right" />


                    {previewUrl ? (

                      <>
                        <video
                          src={
                            previewUrl
                          }
                          controls
                          className="relative z-10 w-full max-h-[540px] object-contain bg-black"
                        />


                        {!loading && (
                          <div className="absolute z-20 top-4 right-4 px-3 py-2 rounded-full border border-[#00ff95]/30 bg-black/65 backdrop-blur">

                            <p className="text-[#00ff95] text-[9px] tracking-[0.18em]">
                              VIDEO READY
                            </p>

                          </div>
                        )}


                        {loading && (
                          <AnalysisOverlay />
                        )}

                      </>

                    ) : (

                      <div className="relative z-10 text-center px-6 max-w-md">

                        <motion.div
                          animate={{
                            y: [
                              0,
                              -6,
                              0,
                            ],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat:
                              Infinity,
                          }}
                          className="w-20 h-20 mx-auto rounded-2xl border border-[#ccff00]/25 bg-[#ccff00]/5 flex items-center justify-center text-[#ccff00] text-3xl"
                        >
                          ↑
                        </motion.div>


                        <h3 className="text-2xl font-black mt-6">
                          Upload Movement Video
                        </h3>

                        <p className="text-[#747b70] mt-3 leading-relaxed">
                          Keep your full body visible and record
                          the complete exercise movement.
                        </p>


                        <div className="flex flex-wrap justify-center gap-2 mt-6">

                          <FileBadge
                            text="MP4"
                          />

                          <FileBadge
                            text="MOV"
                          />

                          <FileBadge
                            text="VIDEO"
                          />

                        </div>

                      </div>

                    )}

                  </div>


                  <input
                    type="file"
                    accept="video/*"
                    onChange={
                      handleVideoChange
                    }
                    className="hidden"
                  />

                </label>


                {/* ==============================================
                    FILE INFO
                ============================================== */}

                {video && (

                  <div className="mt-4 rounded-xl border border-white/5 bg-black/30 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div className="flex items-center gap-4">

                      <div className="w-10 h-10 rounded-lg border border-[#ccff00]/15 bg-[#ccff00]/5 flex items-center justify-center text-[#ccff00]">
                        ▶
                      </div>


                      <div>

                        <p className="text-[#5f665c] text-[8px] tracking-[0.18em]">
                          SELECTED VIDEO
                        </p>

                        <p className="font-bold mt-1 break-all">
                          {video.name}
                        </p>

                      </div>

                    </div>


                    <button
                      type="button"
                      onClick={
                        resetAnalysis
                      }
                      className="text-red-400 text-sm hover:text-red-300 transition"
                    >
                      Remove
                    </button>

                  </div>

                )}


                {/* ERROR */}

                {error && (

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -4,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="mt-5 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-4"
                  >
                    {error}
                  </motion.div>

                )}


                {/* ==============================================
                    ANALYZE BUTTON
                ============================================== */}

                <motion.button
                  whileHover={
                    !loading &&
                    video
                      ? {
                          scale:
                            1.01,
                        }
                      : {}
                  }
                  whileTap={
                    !loading &&
                    video
                      ? {
                          scale:
                            0.99,
                        }
                      : {}
                  }
                  type="submit"
                  disabled={
                    loading ||
                    !video
                  }
                  className="w-full mt-6 bg-[#ccff00] text-black font-black py-4 rounded-xl hover:bg-[#b8e600] transition disabled:opacity-40 disabled:cursor-not-allowed"
                >

                  {loading ? (

                    <span className="flex items-center justify-center gap-3">

                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />

                      ANALYZING BIOMECHANICS

                    </span>

                  ) : (
                    "RUN MOTIONCHECK ANALYSIS →"
                  )}

                </motion.button>

              </div>

            </form>

          </div>


          {/* ==================================================
              AI PIPELINE
          ================================================== */}

          <aside className="xl:col-span-4 space-y-4">

            <div className="rounded-[26px] border border-white/10 bg-black/35 backdrop-blur-xl p-6">

              <p className="text-[#62695f] text-[9px] tracking-[0.22em]">
                ANALYSIS PIPELINE
              </p>

              <h2 className="text-2xl font-black mt-2">
                Motion Intelligence
              </h2>


              <div className="space-y-4 mt-7">

                <PipelineStep
                  number="01"
                  title="Capture"
                  text="Record the full movement with your body clearly visible."
                  status={
                    video
                      ? "READY"
                      : "WAITING"
                  }
                />

                <PipelineStep
                  number="02"
                  title="Decode"
                  text="X-Fit processes movement frames and repetition patterns."
                  status={
                    loading
                      ? "ACTIVE"
                      : result
                      ? "COMPLETE"
                      : "STANDBY"
                  }
                />

                <PipelineStep
                  number="03"
                  title="Score"
                  text="Movement quality is converted into a form score."
                  status={
                    result
                      ? "COMPLETE"
                      : "STANDBY"
                  }
                />

                <PipelineStep
                  number="04"
                  title="Improve"
                  text="Review feedback and use it during your next training session."
                  status={
                    result
                      ? "READY"
                      : "LOCKED"
                  }
                />

              </div>

            </div>


            {/* RECORDING TIPS */}

            <div className="rounded-[26px] border border-[#ccff00]/15 bg-[#ccff00]/5 p-6">

              <p className="text-[#ccff00] text-[9px] tracking-[0.22em]">
                CAPTURE PROTOCOL
              </p>

              <div className="space-y-3 mt-5">

                <TipRow
                  text="Keep the full body in frame."
                />

                <TipRow
                  text="Use stable camera positioning."
                />

                <TipRow
                  text="Avoid heavy obstruction or poor lighting."
                />

                <TipRow
                  text="Record multiple complete repetitions."
                />

              </div>

            </div>

          </aside>

        </section>


        {/* ==================================================
            RESULT
        ================================================== */}

        <AnimatePresence>

          {result && (

            <motion.section
              id="motion-result"
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 20,
              }}
              className="mt-8"
            >

              <div className="relative overflow-hidden rounded-[30px] border border-[#ccff00]/20 bg-black/40 backdrop-blur-xl p-7 md:p-9">

                <div className="absolute right-[-140px] top-[-140px] w-[420px] h-[420px] rounded-full bg-[#ccff00]/10 blur-[140px]" />


                <div className="relative z-10">

                  {/* ============================================
                      RESULT HEADER
                  ============================================ */}

                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

                    <div>

                      <div className="flex items-center gap-3">

                        <span className="w-2 h-2 rounded-full bg-[#00ff95] shadow-[0_0_8px_#00ff95]" />

                        <p className="text-[#00ff95] text-[9px] tracking-[0.24em]">
                          ANALYSIS COMPLETE
                        </p>

                      </div>


                      <h2 className="text-3xl md:text-5xl font-black tracking-[-0.04em] mt-4">

                        {formatText(
                          result.exercise
                        )}

                        {" "}

                        <span className="text-[#ccff00]">
                          REPORT
                        </span>

                      </h2>

                    </div>


                    <button
                      onClick={
                        resetAnalysis
                      }
                      className="border border-white/10 px-5 py-3 rounded-xl text-sm text-[#9ba297] hover:border-[#ccff00]/40 hover:text-[#ccff00] transition"
                    >
                      NEW ANALYSIS
                    </button>

                  </div>


                  {/* ============================================
                      RESULT HERO
                  ============================================ */}

                  <div className="grid xl:grid-cols-12 gap-5 mt-8">


                    {/* SCORE CORE */}

                    <div className="xl:col-span-5 rounded-[26px] border border-[#ccff00]/20 bg-black/35 p-7">

                      <p className="text-[#60675e] text-[9px] tracking-[0.22em]">
                        FORM INTELLIGENCE SCORE
                      </p>


                      <div className="relative w-[240px] h-[240px] mx-auto mt-7">

                        <div className="absolute inset-0 rounded-full border-[10px] border-white/5" />

                        <motion.div
                          animate={{
                            rotate: 360,
                          }}
                          transition={{
                            duration: 22,
                            repeat:
                              Infinity,
                            ease:
                              "linear",
                          }}
                          className="absolute inset-[-7px] rounded-full border border-dashed border-[#ccff00]/30"
                        />

                        <motion.div
                          animate={{
                            rotate: -360,
                          }}
                          transition={{
                            duration: 35,
                            repeat:
                              Infinity,
                            ease:
                              "linear",
                          }}
                          className="absolute inset-[25px] rounded-full border border-[#ccff00]/15"
                        />


                        <div className="absolute inset-0 flex flex-col items-center justify-center">

                          <p className="text-7xl font-black text-[#ccff00]">
                            {
                              result.form_score
                            }
                          </p>

                          <p className="text-[#5f665c] text-[9px] tracking-[0.18em] mt-1">
                            /100
                          </p>

                          <p className="text-white font-bold mt-3">
                            {
                              getFormStatus(
                                result.form_score
                              )
                            }
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* METRICS */}

                    <div className="xl:col-span-7 grid sm:grid-cols-2 gap-4">

                      <ResultCard
                        label="REPETITIONS"
                        value={
                          result.rep_count
                        }
                        sub="DETECTED REPS"
                        highlight
                      />

                      <ResultCard
                        label="EXERCISE"
                        value={
                          formatText(
                            result.exercise
                          )
                        }
                        sub="MOVEMENT TYPE"
                        small
                      />

                      <ResultCard
                        label="ANALYSIS ID"
                        value={
                          result.id
                        }
                        sub="SESSION RECORD"
                      />

                      <ResultCard
                        label="ENGINE"
                        value="AI"
                        sub="MOTIONCHECK"
                        highlight
                      />

                    </div>

                  </div>


                  {/* ============================================
                      AI FEEDBACK
                  ============================================ */}

                  <div className="mt-8">

                    <div className="flex items-end justify-between gap-4">

                      <div>

                        <p className="text-[#ccff00] text-[9px] tracking-[0.22em]">
                          AI COACH OUTPUT
                        </p>

                        <h3 className="text-2xl font-black mt-2">
                          Movement Feedback
                        </h3>

                      </div>

                    </div>


                    {Array.isArray(
                      result.feedback
                    ) &&
                    result.feedback.length >
                      0 ? (

                      <div className="grid md:grid-cols-2 gap-4 mt-6">

                        {result.feedback.map(
                          (
                            feedback,
                            index
                          ) => (

                            <motion.div
                              initial={{
                                opacity: 0,
                                y: 10,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              transition={{
                                delay:
                                  index *
                                  0.07,
                              }}
                              key={
                                index
                              }
                              className="rounded-xl border border-white/5 bg-black/30 p-5"
                            >

                              <div className="flex gap-4">

                                <div className="w-9 h-9 flex-shrink-0 rounded-lg border border-[#ccff00]/20 bg-[#ccff00]/5 flex items-center justify-center text-[#ccff00]">
                                  ◈
                                </div>


                                <div>

                                  <p className="text-[#5f665c] text-[8px] tracking-[0.18em]">
                                    FEEDBACK{" "}
                                    {String(
                                      index +
                                        1
                                    ).padStart(
                                      2,
                                      "0"
                                    )}
                                  </p>

                                  <p className="text-[#c1c6bc] mt-2 leading-relaxed">
                                    {typeof feedback ===
                                    "string"
                                      ? feedback
                                      : JSON.stringify(
                                          feedback
                                        )}
                                  </p>

                                </div>

                              </div>

                            </motion.div>

                          )
                        )}

                      </div>

                    ) : (

                      <div className="mt-5 rounded-xl border border-white/5 bg-black/30 p-5 text-[#747b70]">
                        No additional feedback available.
                      </div>

                    )}

                  </div>


                  {/* ============================================
                      RESULT ACTIONS
                  ============================================ */}

                  <div className="grid md:grid-cols-3 gap-4 mt-8">

                    <button
                      onClick={() =>
                        navigate(
                          "/motioncheck-history"
                        )
                      }
                      className="border border-white/10 bg-black/25 text-white font-bold py-4 rounded-xl hover:border-[#ccff00]/40 transition"
                    >
                      VIEW HISTORY
                    </button>


                    <button
                      onClick={() =>
                        navigate(
                          "/progress-dna"
                        )
                      }
                      className="bg-[#ccff00] text-black font-black py-4 rounded-xl hover:bg-[#b8e600] transition"
                    >
                      VIEW PROGRESS DNA →
                    </button>


                    <button
                      onClick={() =>
                        navigate(
                          "/dashboard"
                        )
                      }
                      className="border border-white/10 bg-black/25 text-[#a0a79b] font-bold py-4 rounded-xl hover:border-[#ccff00]/40 hover:text-white transition"
                    >
                      DASHBOARD
                    </button>

                  </div>

                </div>

              </div>

            </motion.section>

          )}

        </AnimatePresence>

      </main>

    </div>
  );
}


/* ==================================================
   NAV BUTTON
================================================== */

function NavButton({
  text,
  onClick,
  active = false,
}) {
  return (
    <button
      onClick={
        onClick
      }
      className={`h-full flex items-center text-sm transition ${
        active
          ? "text-white font-bold border-b-2 border-[#ccff00]"
          : "text-[#92998c] hover:text-white"
      }`}
    >
      {text}
    </button>
  );
}


/* ==================================================
   HEADER METRIC
================================================== */

function HeaderMetric({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 px-5 py-3">

      <p className="text-[#5f665c] text-[8px] tracking-[0.18em]">
        {label}
      </p>

      <p className="text-[#ccff00] font-black mt-2 text-sm">
        {value}
      </p>

    </div>
  );
}


/* ==================================================
   SCAN CORNER
================================================== */

function ScanCorner({
  position,
}) {
  const map = {
    "top-left":
      "top-4 left-4 border-t border-l",

    "top-right":
      "top-4 right-4 border-t border-r",

    "bottom-left":
      "bottom-4 left-4 border-b border-l",

    "bottom-right":
      "bottom-4 right-4 border-b border-r",
  };


  return (
    <div
      className={`absolute z-20 w-7 h-7 border-[#ccff00]/40 ${map[position]}`}
    />
  );
}


/* ==================================================
   FILE BADGE
================================================== */

function FileBadge({
  text,
}) {
  return (
    <span className="px-3 py-2 rounded-lg border border-white/10 bg-black/30 text-[#70776c] text-[9px] tracking-wider">
      {text}
    </span>
  );
}


/* ==================================================
   ANALYSIS OVERLAY
================================================== */

function AnalysisOverlay() {
  return (
    <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">

      <div className="text-center">

        <div className="relative w-28 h-28 mx-auto">

          <div className="absolute inset-0 rounded-full border border-[#ccff00]/20" />

          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1.5,
              repeat:
                Infinity,
              ease:
                "linear",
            }}
            className="absolute inset-2 rounded-full border-t-2 border-[#ccff00]"
          />

          <div className="absolute inset-0 flex items-center justify-center text-[#ccff00] text-2xl">
            ◉
          </div>

        </div>


        <p className="text-[#ccff00] font-black tracking-[0.14em] mt-6">
          ANALYZING
        </p>

        <p className="text-[#72796f] text-[9px] tracking-[0.2em] mt-2">
          EXTRACTING MOTION INTELLIGENCE
        </p>

      </div>

    </div>
  );
}


/* ==================================================
   PIPELINE STEP
================================================== */

function PipelineStep({
  number,
  title,
  text,
  status,
}) {

  const active =
    status ===
      "ACTIVE" ||
    status ===
      "READY";

  const complete =
    status ===
    "COMPLETE";


  return (
    <div className="grid grid-cols-[44px_1fr] gap-4 border-t border-white/5 pt-4">

      <div
        className={`w-10 h-10 rounded-lg border flex items-center justify-center text-xs font-black ${
          complete
            ? "bg-[#00ff95] border-[#00ff95] text-black"
            : active
            ? "bg-[#ccff00] border-[#ccff00] text-black"
            : "bg-black/30 border-white/10 text-[#656c62]"
        }`}
      >
        {complete
          ? "✓"
          : number}
      </div>


      <div>

        <div className="flex justify-between gap-3">

          <p className="font-bold">
            {title}
          </p>

          <span
            className={`text-[8px] tracking-[0.15em] ${
              complete
                ? "text-[#00ff95]"
                : active
                ? "text-[#ccff00]"
                : "text-[#50564e]"
            }`}
          >
            {status}
          </span>

        </div>

        <p className="text-[#747b70] text-sm mt-2 leading-relaxed">
          {text}
        </p>

      </div>

    </div>
  );
}


/* ==================================================
   TIP ROW
================================================== */

function TipRow({
  text,
}) {
  return (
    <div className="flex gap-3">

      <span className="text-[#ccff00]">
        ◈
      </span>

      <p className="text-[#9ba297] text-sm">
        {text}
      </p>

    </div>
  );
}


/* ==================================================
   RESULT CARD
================================================== */

function ResultCard({
  label,
  value,
  sub,
  highlight = false,
  small = false,
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/30 p-6">

      <p className="text-[#5f665c] text-[9px] tracking-[0.2em]">
        {label}
      </p>

      <p
        className={`font-black mt-4 capitalize ${
          small
            ? "text-2xl"
            : "text-4xl"
        } ${
          highlight
            ? "text-[#ccff00]"
            : "text-white"
        }`}
      >
        {value}
      </p>

      <p className="text-[#5a6157] text-[8px] tracking-[0.18em] mt-2">
        {sub}
      </p>

    </div>
  );
}


/* ==================================================
   FORM STATUS
================================================== */

function getFormStatus(
  score
) {
  const value =
    Number(score) || 0;

  if (value >= 90) {
    return "ELITE";
  }

  if (value >= 80) {
    return "EXCELLENT";
  }

  if (value >= 70) {
    return "GOOD";
  }

  if (value >= 60) {
    return "DEVELOPING";
  }

  return "NEEDS WORK";
}


/* ==================================================
   FORMAT
================================================== */

function formatText(
  value
) {
  if (!value) {
    return "";
  }

  return String(value)
    .replaceAll(
      "_",
      " "
    )
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}


export default MotionCheck;