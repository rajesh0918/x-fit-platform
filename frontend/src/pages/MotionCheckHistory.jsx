import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

import apiFetch from "../services/api";
import CinematicBackground from "../components/futuristic/CinematicBackground";


function MotionCheckHistory() {
  const navigate =
    useNavigate();

  const [analyses, setAnalyses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    exerciseFilter,
    setExerciseFilter,
  ] = useState("all");


  // ==================================================
  // LOAD HISTORY
  // ==================================================

  useEffect(() => {
    const fetchHistory =
      async () => {

        try {
          setLoading(true);
          setError("");

          const response =
            await apiFetch(
              "/motioncheck/history/"
            );

          if (!response) {
            return;
          }

          const data =
            await response.json();

          if (response.ok) {
            setAnalyses(
              Array.isArray(data)
                ? data
                : []
            );

            return;
          }

          setError(
            data.error ||
            data.detail ||
            "Could not load MotionCheck history."
          );

        } catch (err) {
          console.error(
            "MotionCheck history error:",
            err
          );

          setError(
            "Could not load MotionCheck history."
          );

        } finally {
          setLoading(false);
        }
      };

    fetchHistory();

  }, []);


  // ==================================================
  // FILTER
  // ==================================================

  const filteredAnalyses =
    useMemo(() => {

      if (
        exerciseFilter ===
        "all"
      ) {
        return analyses;
      }

      return analyses.filter(
        (analysis) =>
          analysis.exercise ===
          exerciseFilter
      );

    }, [
      analyses,
      exerciseFilter,
    ]);


  // ==================================================
  // STATS
  // ==================================================

  const stats =
    useMemo(() => {

      if (
        analyses.length === 0
      ) {
        return {
          total: 0,
          averageScore: 0,
          totalReps: 0,
          bestScore: 0,
        };
      }

      const scores =
        analyses.map(
          (analysis) =>
            Number(
              analysis.form_score
            ) || 0
        );

      const totalReps =
        analyses.reduce(
          (
            total,
            analysis
          ) =>
            total +
            (
              Number(
                analysis.rep_count
              ) || 0
            ),
          0
        );

      const averageScore =
        scores.length > 0
          ? (
              scores.reduce(
                (a, b) =>
                  a + b,
                0
              ) /
              scores.length
            ).toFixed(1)
          : 0;

      const bestScore =
        scores.length > 0
          ? Math.max(
              ...scores
            )
          : 0;

      return {
        total:
          analyses.length,

        averageScore,

        totalReps,

        bestScore,
      };

    }, [analyses]);


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#050505] text-white flex items-center justify-center overflow-hidden">

        <CinematicBackground />

        <div className="relative z-20 text-center">

          <div className="w-16 h-16 border-2 border-[#ccff00]/20 border-t-[#ccff00] rounded-full animate-spin mx-auto" />

          <p className="text-[#ccff00] mt-6 tracking-[0.26em] text-[10px]">
            LOADING MOTION INTELLIGENCE ARCHIVE
          </p>

        </div>

      </div>
    );
  }


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

          </div>


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

                <span className="text-[#ccff00] text-[10px] tracking-[0.24em]">
                  MOTION INTELLIGENCE ARCHIVE
                </span>

              </div>


              <h1 className="text-5xl md:text-7xl xl:text-8xl font-black tracking-[-0.055em] leading-[0.92] mt-6">

                ANALYSIS

                <br />

                <span className="text-[#ccff00]">
                  HISTORY.
                </span>

              </h1>


              <p className="text-[#92998c] text-lg max-w-3xl mt-6 leading-relaxed">
                Track movement quality, repetitions and
                biomechanical performance across every
                MotionCheck session.
              </p>

            </div>


            <button
              onClick={() =>
                navigate(
                  "/motioncheck"
                )
              }
              className="bg-[#ccff00] text-black font-black px-7 py-4 rounded-xl hover:bg-[#b8e600] transition"
            >
              + NEW ANALYSIS
            </button>

          </div>

        </motion.header>


        {/* ERROR */}

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-5">
            {error}
          </div>
        )}


        {/* ==================================================
            STATS
        ================================================== */}

        <section className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">

          <HistoryStat
            label="ANALYSES"
            value={
              stats.total
            }
            sub="TOTAL SESSIONS"
          />

          <HistoryStat
            label="AVG FORM SCORE"
            value={
              stats.averageScore
            }
            unit="/100"
            sub="MOVEMENT QUALITY"
            highlight
          />

          <HistoryStat
            label="TOTAL REPS"
            value={
              stats.totalReps
            }
            sub="DETECTED MOVEMENT"
          />

          <HistoryStat
            label="BEST SCORE"
            value={
              stats.bestScore
            }
            unit="/100"
            sub="PEAK ANALYSIS"
            highlight
          />

        </section>


        {/* ==================================================
            FILTER BAR
        ================================================== */}

        <section className="rounded-2xl border border-white/10 bg-black/35 backdrop-blur-xl p-4 mb-8">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>

              <p className="text-[#5f665c] text-[9px] tracking-[0.2em]">
                ANALYSIS FILTER
              </p>

              <p className="font-bold mt-1">
                Movement Type
              </p>

            </div>


            <div className="flex flex-wrap gap-2">

              <FilterButton
                text="ALL"
                count={
                  analyses.length
                }
                active={
                  exerciseFilter ===
                  "all"
                }
                onClick={() =>
                  setExerciseFilter(
                    "all"
                  )
                }
              />

              <FilterButton
                text="SQUAT"
                count={
                  getExerciseCount(
                    analyses,
                    "squat"
                  )
                }
                active={
                  exerciseFilter ===
                  "squat"
                }
                onClick={() =>
                  setExerciseFilter(
                    "squat"
                  )
                }
              />

              <FilterButton
                text="PUSH-UP"
                count={
                  getExerciseCount(
                    analyses,
                    "pushup"
                  )
                }
                active={
                  exerciseFilter ===
                  "pushup"
                }
                onClick={() =>
                  setExerciseFilter(
                    "pushup"
                  )
                }
              />

              <FilterButton
                text="BICEP CURL"
                count={
                  getExerciseCount(
                    analyses,
                    "bicep_curl"
                  )
                }
                active={
                  exerciseFilter ===
                  "bicep_curl"
                }
                onClick={() =>
                  setExerciseFilter(
                    "bicep_curl"
                  )
                }
              />

            </div>

          </div>

        </section>


        {/* ==================================================
            EMPTY
        ================================================== */}

        {!error &&
        analyses.length === 0 && (

          <motion.section
            initial={{
              opacity: 0,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="relative overflow-hidden rounded-[30px] border border-[#ccff00]/20 bg-black/35 backdrop-blur-xl p-12 text-center"
          >

            <div className="absolute left-1/2 top-[-180px] -translate-x-1/2 w-[450px] h-[450px] rounded-full bg-[#ccff00]/10 blur-[140px]" />


            <div className="relative z-10">

              <div className="w-20 h-20 mx-auto rounded-2xl border border-[#ccff00]/20 bg-[#ccff00]/5 flex items-center justify-center text-[#ccff00] text-3xl">
                ◉
              </div>

              <h2 className="text-3xl font-black mt-7">
                NO MOTION DATA YET
              </h2>

              <p className="text-[#858c80] mt-4 max-w-xl mx-auto leading-relaxed">
                Run your first MotionCheck analysis to begin
                building your movement intelligence archive.
              </p>

              <button
                onClick={() =>
                  navigate(
                    "/motioncheck"
                  )
                }
                className="mt-8 bg-[#ccff00] text-black font-black px-8 py-4 rounded-xl"
              >
                RUN FIRST MOTIONCHECK →
              </button>

            </div>

          </motion.section>

        )}


        {/* FILTER EMPTY */}

        {!error &&
        analyses.length > 0 &&
        filteredAnalyses.length ===
          0 && (

          <div className="rounded-2xl border border-white/10 bg-black/35 p-8 text-center mb-8">

            <p className="text-[#8b9286]">
              No analyses found for this movement.
            </p>

          </div>

        )}


        {/* ==================================================
            ANALYSIS GRID
        ================================================== */}

        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

          {filteredAnalyses.map(
            (
              analysis,
              index
            ) => (

              <AnalysisCard
                key={
                  analysis.id
                }
                analysis={
                  analysis
                }
                index={
                  index
                }
              />

            )
          )}

        </section>


        {/* ==================================================
            ACTIONS
        ================================================== */}

        {analyses.length > 0 && (

          <section className="grid md:grid-cols-3 gap-4 mt-10">

            <button
              onClick={() =>
                navigate(
                  "/motioncheck"
                )
              }
              className="bg-[#ccff00] text-black font-black py-4 rounded-xl hover:bg-[#b8e600] transition"
            >
              NEW MOTIONCHECK
            </button>

            <button
              onClick={() =>
                navigate(
                  "/progress-dna"
                )
              }
              className="border border-[#ccff00]/40 text-[#ccff00] font-bold py-4 rounded-xl hover:bg-[#ccff00]/10 transition"
            >
              PROGRESS DNA
            </button>

            <button
              onClick={() =>
                navigate(
                  "/dashboard"
                )
              }
              className="border border-white/10 text-white font-bold py-4 rounded-xl hover:border-[#ccff00]/40 transition"
            >
              DASHBOARD
            </button>

          </section>

        )}

      </main>

    </div>
  );
}


/* ==================================================
   ANALYSIS CARD
================================================== */

function AnalysisCard({
  analysis,
  index,
}) {

  const formScore =
    Number(
      analysis.form_score
    ) || 0;

  const scoreLabel =
    getScoreLabel(
      formScore
    );

  const feedback =
    Array.isArray(
      analysis.feedback
    )
      ? analysis.feedback
      : [];

  const repAngles =
    Array.isArray(
      analysis
        .metric_breakdown
        ?.rep_angles
    )
      ? analysis
          .metric_breakdown
          .rep_angles
      : [];


  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay:
          index * 0.04,
      }}
      whileHover={{
        y: -4,
      }}
      className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-black/35 backdrop-blur-xl p-6 hover:border-[#ccff00]/30 transition"
    >

      <div className="absolute right-[-100px] top-[-100px] w-[220px] h-[220px] rounded-full bg-[#ccff00]/5 blur-[90px]" />


      <div className="relative z-10">

        {/* HEADER */}

        <div className="flex justify-between items-start gap-5">

          <div>

            <p className="text-[#5f665c] text-[9px] tracking-[0.2em]">
              ANALYSIS{" "}
              {String(
                index + 1
              ).padStart(
                2,
                "0"
              )}
            </p>

            <h2 className="text-2xl font-black capitalize mt-2 group-hover:text-[#ccff00] transition">
              {formatText(
                analysis.exercise
              )}
            </h2>

          </div>


          <div className="w-16 h-16 rounded-2xl bg-[#ccff00] text-black flex flex-col items-center justify-center">

            <p className="text-2xl font-black leading-none">
              {formScore}
            </p>

            <p className="text-[7px] font-black tracking-wider mt-1">
              SCORE
            </p>

          </div>

        </div>


        {/* QUALITY */}

        <div className="mt-6">

          <div className="flex items-center justify-between">

            <span className="text-[#5f665c] text-[9px] tracking-[0.18em]">
              FORM QUALITY
            </span>

            <span
              className={`text-[9px] font-black tracking-[0.16em] ${scoreLabel.className}`}
            >
              {scoreLabel.text}
            </span>

          </div>


          <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-3">

            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width:
                  `${Math.min(
                    formScore,
                    100
                  )}%`,
              }}
              transition={{
                duration: 0.6,
              }}
              className="h-full bg-[#ccff00] rounded-full shadow-[0_0_12px_rgba(204,255,0,0.5)]"
            />

          </div>

        </div>


        {/* METRICS */}

        <div className="grid grid-cols-2 gap-3 mt-6">

          <MetricBox
            label="REPETITIONS"
            value={
              analysis.rep_count
            }
          />

          <MetricBox
            label="FORM SCORE"
            value={`${formScore}/100`}
            highlight
          />

        </div>


        {/* REP ANGLES */}

        {repAngles.length > 0 && (

          <div className="mt-6">

            <p className="text-[#5f665c] text-[9px] tracking-[0.2em]">
              REP ANGLES
            </p>


            <div className="flex flex-wrap gap-2 mt-3">

              {repAngles
                .slice(
                  0,
                  8
                )
                .map(
                  (
                    angle,
                    angleIndex
                  ) => (

                    <span
                      key={
                        angleIndex
                      }
                      className="border border-white/5 bg-black/30 px-3 py-2 rounded-lg text-xs text-[#c2c7bd]"
                    >
                      {Number(
                        angle
                      ).toFixed(
                        1
                      )}
                      °
                    </span>

                  )
                )}

            </div>

          </div>

        )}


        {/* SELECTED ARM */}

        {analysis
          .metric_breakdown
          ?.selected_arm && (

          <div className="mt-5 rounded-xl border border-white/5 bg-black/30 p-4">

            <p className="text-[#5f665c] text-[8px] tracking-[0.18em]">
              TRACKED ARM
            </p>

            <p className="font-bold capitalize mt-2 text-[#ccff00]">
              {
                analysis
                  .metric_breakdown
                  .selected_arm
              }
            </p>

          </div>

        )}


        {/* FEEDBACK */}

        {feedback.length > 0 && (

          <div className="mt-6">

            <p className="text-[#5f665c] text-[9px] tracking-[0.2em] mb-3">
              AI FEEDBACK
            </p>


            <div className="space-y-3">

              {feedback
                .slice(
                  0,
                  3
                )
                .map(
                  (
                    item,
                    feedbackIndex
                  ) => (

                    <div
                      key={
                        feedbackIndex
                      }
                      className="flex gap-3"
                    >

                      <div className="w-7 h-7 flex-shrink-0 rounded-lg border border-[#ccff00]/15 bg-[#ccff00]/5 flex items-center justify-center text-[#ccff00] text-xs">
                        ◈
                      </div>

                      <p className="text-[#9ba297] text-sm leading-relaxed">
                        {typeof item ===
                        "string"
                          ? item
                          : JSON.stringify(
                              item
                            )}
                      </p>

                    </div>

                  )
                )}

            </div>

          </div>

        )}


        {/* FOOTER */}

        <div className="border-t border-white/5 mt-6 pt-4 flex justify-between items-center gap-3">

          <p className="text-[#5f665c] text-xs">
            {formatDate(
              analysis.created_at
            )}
          </p>

          <span className="text-[#ccff00] text-xs">
            #{analysis.id}
          </span>

        </div>

      </div>

    </motion.article>
  );
}


/* ==================================================
   HISTORY STAT
================================================== */

function HistoryStat({
  label,
  value,
  unit = "",
  sub,
  highlight = false,
}) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      className="rounded-2xl border border-white/10 bg-black/35 backdrop-blur-xl p-5"
    >

      <p className="text-[#5f665c] text-[9px] tracking-[0.18em]">
        {label}
      </p>


      <div className="flex items-end gap-1 mt-3">

        <p
          className={`text-3xl md:text-4xl font-black ${
            highlight
              ? "text-[#ccff00]"
              : "text-white"
          }`}
        >
          {value}
        </p>

        {unit && (
          <span className="text-[#656c62] text-xs mb-1">
            {unit}
          </span>
        )}

      </div>


      <p className="text-[#50564e] text-[8px] tracking-[0.16em] mt-2">
        {sub}
      </p>

    </motion.div>
  );
}


/* ==================================================
   METRIC BOX
================================================== */

function MetricBox({
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/30 p-4">

      <p className="text-[#5f665c] text-[8px] tracking-[0.17em]">
        {label}
      </p>

      <p
        className={`text-2xl font-black mt-2 ${
          highlight
            ? "text-[#ccff00]"
            : "text-white"
        }`}
      >
        {value}
      </p>

    </div>
  );
}


/* ==================================================
   FILTER
================================================== */

function FilterButton({
  text,
  count,
  active,
  onClick,
}) {
  return (
    <button
      onClick={
        onClick
      }
      className={`px-4 py-3 rounded-xl border text-xs font-bold tracking-[0.08em] transition ${
        active
          ? "bg-[#ccff00] border-[#ccff00] text-black"
          : "bg-black/30 border-white/10 text-[#8e9589] hover:border-[#ccff00]/30 hover:text-white"
      }`}
    >
      {text}

      <span
        className={`ml-2 ${
          active
            ? "text-black/60"
            : "text-[#5b6258]"
        }`}
      >
        {count}
      </span>
    </button>
  );
}


/* ==================================================
   NAV
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
   COUNT
================================================== */

function getExerciseCount(
  analyses,
  exercise
) {
  return analyses.filter(
    (analysis) =>
      analysis.exercise ===
      exercise
  ).length;
}


/* ==================================================
   SCORE LABEL
================================================== */

function getScoreLabel(
  score
) {
  if (score >= 85) {
    return {
      text:
        "EXCELLENT",

      className:
        "text-[#00ff95]",
    };
  }

  if (score >= 70) {
    return {
      text:
        "GOOD",

      className:
        "text-[#ccff00]",
    };
  }

  if (score >= 50) {
    return {
      text:
        "IMPROVE",

      className:
        "text-yellow-400",
    };
  }

  return {
    text:
      "NEEDS WORK",

    className:
      "text-red-400",
  };
}


/* ==================================================
   DATE
================================================== */

function formatDate(
  value
) {
  if (!value) {
    return "Unknown date";
  }

  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleString(
    undefined,
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",

      hour:
        "2-digit",

      minute:
        "2-digit",
    }
  );
}


/* ==================================================
   TEXT
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


export default MotionCheckHistory;