import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import apiFetch from "../services/api";
import CinematicBackground from "../components/futuristic/CinematicBackground";


function ProgressDNA() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==================================================
  // LOAD PROGRESS DNA
  // ==================================================

  useEffect(() => {
    const fetchProgressDNA = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch(
          "/progress-dna/"
        );

        if (!response) {
          return;
        }

        const result =
          await response.json();

        if (response.ok) {
          setData(result);
          return;
        }

        setError(
          result.error ||
            result.detail ||
            "Could not load Progress DNA."
        );

      } catch (err) {
        console.error(
          "Progress DNA error:",
          err
        );

        setError(
          "Could not load Progress DNA."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchProgressDNA();

  }, []);


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#050505] text-white flex items-center justify-center overflow-hidden">

        <CinematicBackground />

        <div className="relative z-20 text-center">

          <div className="w-16 h-16 border-2 border-[#ccff00]/20 border-t-[#ccff00] rounded-full animate-spin mx-auto" />

          <p className="text-[#ccff00] text-[10px] tracking-[0.28em] mt-6">
            DECODING ATHLETE DNA
          </p>

        </div>

      </div>
    );
  }


  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <div className="relative min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 overflow-hidden">

        <CinematicBackground />

        <div className="relative z-20 max-w-lg w-full rounded-2xl border border-red-500/30 bg-black/40 backdrop-blur-xl p-8">

          <p className="text-red-400">
            {error}
          </p>

          <button
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
            className="mt-6 text-[#ccff00] font-bold"
          >
            ← Back to Dashboard
          </button>

        </div>

      </div>
    );
  }


  if (!data) {
    return null;
  }


  // ==================================================
  // DATA
  // ==================================================

  const overallScore =
    Number(
      data.overall_dna_score
    ) || 0;

  const techniqueScore =
    Number(
      data.technique_score
    ) || 0;

  const consistencyScore =
    Number(
      data.consistency_score
    ) || 0;

  const progressScore =
    Number(
      data.progress_score
    ) || 0;

  const recentTrend =
    Number(
      data.recent_trend
    ) || 0;

  const trendPositive =
    recentTrend > 0;

  const trendNegative =
    recentTrend < 0;

  const currentStreak =
    data.current_streak ?? 0;

  const totalCompletedWorkouts =
    data.total_completed_workouts ?? 0;

  const workoutsThisWeek =
    data.workouts_this_week ?? 0;

  const targetWorkouts =
    data.target_workouts_per_week ?? 0;

  const weeklyConsistency =
    Number(
      data.weekly_consistency_score
    ) || 0;

  const streakScore =
    Number(
      data.streak_score
    ) || 0;

  const historyScore =
    Number(
      data.workout_history_score
    ) || 0;


  // ==================================================
  // DNA STATUS
  // ==================================================

  const dnaStatus =
    getDNAStatus(
      overallScore
    );


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
              active
            />

            {/* MEMBERSHIP */}

            <NavButton
              text="Membership"
              onClick={() =>
                navigate(
                  "/membership"
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
                  ATHLETE INTELLIGENCE ONLINE
                </span>

              </div>


              <h1 className="text-5xl md:text-7xl xl:text-8xl font-black tracking-[-0.055em] leading-[0.92] mt-6">

                PROGRESS

                <br />

                <span className="text-[#ccff00]">
                  DNA.
                </span>

              </h1>


              <p className="text-[#92998c] text-lg max-w-3xl mt-6 leading-relaxed">
                A unified athlete intelligence score combining
                technique, training consistency and measurable
                performance progress.
              </p>

            </div>


            <div className="grid grid-cols-2 gap-3">

              <HeaderMetric
                label="DNA STATUS"
                value={dnaStatus}
              />

              <HeaderMetric
                label="ANALYSES"
                value={
                  data.total_analyses ?? 0
                }
              />

            </div>

          </div>

        </motion.header>


        {/* ==================================================
            DNA HERO
        ================================================== */}

        <section className="grid xl:grid-cols-12 gap-5 mb-7">


          {/* DNA CORE */}

          <div className="xl:col-span-5 relative overflow-hidden rounded-[32px] border border-[#ccff00]/20 bg-black/40 backdrop-blur-xl p-8">

            <div className="absolute left-1/2 top-1/2 w-[460px] h-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ccff00]/8 blur-[150px]" />


            <div className="relative z-10">

              <p className="text-[#62695f] text-[9px] tracking-[0.24em]">
                OVERALL ATHLETE DNA
              </p>


              <div className="relative w-[290px] h-[290px] mx-auto mt-8">

                <div className="absolute inset-0 rounded-full border-[12px] border-white/5" />

                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-[-10px] rounded-full border border-dashed border-[#ccff00]/30"
                />

                <motion.div
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-[28px] rounded-full border border-[#ccff00]/15"
                />


                <div className="absolute inset-0 flex flex-col items-center justify-center">

                  <p className="text-7xl md:text-8xl font-black text-[#ccff00]">
                    {overallScore}
                  </p>

                  <p className="text-[#62695f] text-[9px] tracking-[0.2em] mt-1">
                    /100
                  </p>

                  <p className="text-white font-black tracking-[0.14em] mt-4">
                    {dnaStatus}
                  </p>

                </div>

              </div>


              <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-8">

                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width:
                      `${Math.min(
                        overallScore,
                        100
                      )}%`,
                  }}
                  transition={{
                    duration: 0.8,
                  }}
                  className="h-full bg-[#ccff00] rounded-full shadow-[0_0_14px_rgba(204,255,0,0.6)]"
                />

              </div>


              <p className="text-[#7f867b] text-sm text-center leading-relaxed mt-5">
                Based on{" "}
                <span className="text-white font-bold">
                  {data.total_analyses ?? 0}
                </span>{" "}
                MotionCheck analyses and your training activity.
              </p>

            </div>

          </div>


          {/* RIGHT PANEL */}

          <div className="xl:col-span-7 grid gap-5">


            {/* TREND */}

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/35 backdrop-blur-xl p-7">

              <div className="absolute right-[-120px] top-[-120px] w-[300px] h-[300px] rounded-full bg-[#ccff00]/5 blur-[110px]" />


              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                <div>

                  <p className="text-[#5f665c] text-[9px] tracking-[0.22em]">
                    RECENT TECHNIQUE TREND
                  </p>


                  <div className="flex items-end gap-3 mt-4">

                    <p
                      className={`text-6xl font-black ${
                        trendPositive
                          ? "text-[#00ff95]"
                          : trendNegative
                          ? "text-red-400"
                          : "text-[#ccff00]"
                      }`}
                    >
                      {trendPositive
                        ? "+"
                        : ""}

                      {recentTrend}
                    </p>

                    <p className="text-[#62695f] mb-2">
                      points
                    </p>

                  </div>


                  <p className="text-[#8b9286] mt-4 max-w-xl leading-relaxed">

                    {trendPositive
                      ? "Your recent MotionCheck form scores are improving."
                      : trendNegative
                      ? "Your recent MotionCheck form scores are below your earlier results."
                      : "No clear MotionCheck improvement trend has been established yet."}

                  </p>

                </div>


                <TrendOrb
                  positive={
                    trendPositive
                  }
                  negative={
                    trendNegative
                  }
                />

              </div>

            </div>


            {/* COMPONENT SCORES */}

            <div className="grid md:grid-cols-3 gap-4">

              <DNAComponent
                title="Technique"
                value={
                  techniqueScore
                }
                subtitle="MOVEMENT QUALITY"
                weight="50%"
                index="01"
              />

              <DNAComponent
                title="Consistency"
                value={
                  consistencyScore
                }
                subtitle="TRAINING BEHAVIOR"
                weight="25%"
                index="02"
              />

              <DNAComponent
                title="Progress"
                value={
                  progressScore
                }
                subtitle="PERFORMANCE TREND"
                weight="25%"
                index="03"
              />

            </div>

          </div>

        </section>


        {/* ==================================================
            ACTIVITY
        ================================================== */}

        <section className="mb-7">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">

            <div>

              <p className="text-[#ccff00] text-[9px] tracking-[0.24em]">
                TRAINING ACTIVITY
              </p>

              <h2 className="text-3xl font-black mt-2">
                Consistency Intelligence
              </h2>

            </div>


            <p className="text-[#72796f] text-sm">
              Real workout completion data
            </p>

          </div>


          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">

            <ActivityCard
              icon="🔥"
              title="Current Streak"
              value={
                currentStreak
              }
              suffix="DAYS"
            />

            <ActivityCard
              icon="✓"
              title="Completed"
              value={
                totalCompletedWorkouts
              }
              suffix="WORKOUTS"
            />

            <ActivityCard
              icon="⚡"
              title="This Week"
              value={`${workoutsThisWeek}/${targetWorkouts}`}
              suffix="SESSIONS"
            />

            <ActivityCard
              icon="◎"
              title="Consistency"
              value={
                consistencyScore
              }
              suffix="/100"
              highlight
            />

          </div>

        </section>


        {/* ==================================================
            CONSISTENCY ENGINE
        ================================================== */}

        <section className="grid xl:grid-cols-12 gap-5 mb-7">


          {/* SCORE BREAKDOWN */}

          <div className="xl:col-span-7 rounded-[28px] border border-white/10 bg-black/35 backdrop-blur-xl p-7 md:p-8">

            <p className="text-[#ccff00] text-[9px] tracking-[0.24em]">
              CONSISTENCY ENGINE
            </p>

            <h2 className="text-3xl font-black mt-2">
              Training Consistency Breakdown
            </h2>

            <p className="text-[#7f867b] mt-3 leading-relaxed max-w-2xl">
              Your consistency score combines weekly execution,
              workout streak and long-term completion history.
            </p>


            <div className="space-y-7 mt-8">

              <ScoreBar
                label="Weekly Training"
                value={
                  weeklyConsistency
                }
                weight="50%"
              />

              <ScoreBar
                label="Workout Streak"
                value={
                  streakScore
                }
                weight="30%"
              />

              <ScoreBar
                label="Workout History"
                value={
                  historyScore
                }
                weight="20%"
              />

            </div>

          </div>


          {/* FORMULA */}

          <div className="xl:col-span-5 rounded-[28px] border border-[#ccff00]/15 bg-[#ccff00]/5 backdrop-blur-xl p-7">

            <p className="text-[#ccff00] text-[9px] tracking-[0.24em]">
              CONSISTENCY FORMULA
            </p>

            <h3 className="text-2xl font-black mt-3">
              Behavior → Score
            </h3>


            <div className="space-y-4 mt-7">

              <FormulaCard
                title="Weekly Training"
                percentage="50%"
                text={`${workoutsThisWeek}/${targetWorkouts} workouts completed this week`}
              />

              <FormulaCard
                title="Workout Streak"
                percentage="30%"
                text={`${currentStreak} consecutive training day${
                  currentStreak === 1
                    ? ""
                    : "s"
                }`}
              />

              <FormulaCard
                title="Workout History"
                percentage="20%"
                text={`${totalCompletedWorkouts} total workouts completed`}
              />

            </div>

          </div>

        </section>


        {/* ==================================================
            DNA FORMULA
        ================================================== */}

        <section className="rounded-[28px] border border-white/10 bg-black/35 backdrop-blur-xl p-7 md:p-8 mb-7">

          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">

            <div>

              <p className="text-[#ccff00] text-[9px] tracking-[0.24em]">
                PROGRESS DNA ENGINE
              </p>

              <h2 className="text-3xl font-black mt-2">
                Athlete Intelligence Formula
              </h2>

              <p className="text-[#7f867b] mt-3">
                The three components used to calculate your
                overall athlete DNA.
              </p>

            </div>


            <div className="px-5 py-3 rounded-xl border border-[#ccff00]/20 bg-[#ccff00]/5">

              <p className="text-[#ccff00] text-[9px] tracking-[0.18em]">
                FORMULA
              </p>

              <p className="font-bold mt-1">
                50% + 25% + 25%
              </p>

            </div>

          </div>


          <div className="grid xl:grid-cols-3 gap-5 mt-8">

            <FormulaScore
              title="Technique"
              value={
                techniqueScore
              }
              weight="50%"
              code="TECH"
            />

            <FormulaScore
              title="Consistency"
              value={
                consistencyScore
              }
              weight="25%"
              code="CONS"
            />

            <FormulaScore
              title="Progress"
              value={
                progressScore
              }
              weight="25%"
              code="PROG"
            />

          </div>

        </section>


        {/* ==================================================
            EXERCISE TECHNIQUE
        ================================================== */}

        <section className="mb-7">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">

            <div>

              <p className="text-[#ccff00] text-[9px] tracking-[0.24em]">
                MOTIONCHECK INTELLIGENCE
              </p>

              <h2 className="text-3xl font-black mt-2">
                Exercise Technique
              </h2>

            </div>


            <button
              onClick={() =>
                navigate(
                  "/motioncheck-history"
                )
              }
              className="text-[#ccff00] text-sm hover:underline"
            >
              View analysis history →
            </button>

          </div>


          <div className="grid md:grid-cols-3 gap-5">

            <ExerciseCard
              title="Squat"
              code="SQ-01"
              value={
                data.squat_average
              }
            />

            <ExerciseCard
              title="Push-Up"
              code="PU-02"
              value={
                data.pushup_average
              }
            />

            <ExerciseCard
              title="Bicep Curl"
              code="BC-03"
              value={
                data.bicep_curl_average
              }
            />

          </div>

        </section>


        {/* ==================================================
            ACTIONS
        ================================================== */}

        <section className="grid md:grid-cols-5 gap-4">

          <button
            onClick={() =>
              navigate(
                "/motioncheck"
              )
            }
            className="bg-[#ccff00] text-black font-black py-4 rounded-xl hover:bg-[#b8e600] transition"
          >
            RUN MOTIONCHECK
          </button>

          <button
            onClick={() =>
              navigate(
                "/motioncheck-history"
              )
            }
            className="border border-[#ccff00]/40 text-[#ccff00] font-bold py-4 rounded-xl hover:bg-[#ccff00]/10 transition"
          >
            VIEW HISTORY
          </button>

          <button
            onClick={() =>
              navigate(
                "/workout-plan"
              )
            }
            className="border border-white/10 text-white font-bold py-4 rounded-xl hover:border-[#ccff00]/40 transition"
          >
            WORKOUT PLAN
          </button>

          {/* MEMBERSHIP */}

          <button
            onClick={() =>
              navigate(
                "/membership"
              )
            }
            className="border border-[#ccff00]/40 text-[#ccff00] font-bold py-4 rounded-xl hover:bg-[#ccff00]/10 transition"
          >
            MEMBERSHIP
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

      </main>

    </div>
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
   TREND ORB
================================================== */

function TrendOrb({
  positive,
  negative,
}) {
  const symbol =
    positive
      ? "↗"
      : negative
      ? "↘"
      : "→";

  const textClass =
    positive
      ? "text-[#00ff95]"
      : negative
      ? "text-red-400"
      : "text-[#ccff00]";


  return (
    <div className="relative w-32 h-32 flex-shrink-0">

      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 rounded-full border border-dashed border-[#ccff00]/20"
      />

      <div className="absolute inset-4 rounded-full border border-white/10 bg-black/30" />

      <div className="absolute inset-0 flex items-center justify-center">

        <span
          className={`text-5xl font-black ${textClass}`}
        >
          {symbol}
        </span>

      </div>

    </div>
  );
}


/* ==================================================
   DNA COMPONENT
================================================== */

function DNAComponent({
  title,
  value,
  subtitle,
  weight,
  index,
}) {
  const safeValue =
    clampScore(
      value
    );

  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      className="rounded-[24px] border border-white/10 bg-black/35 backdrop-blur-xl p-6"
    >

      <div className="flex justify-between items-start gap-3">

        <p className="text-[#5f665c] text-[9px] tracking-[0.18em]">
          {index}
        </p>

        <span className="text-[#ccff00] text-xs font-black">
          {weight}
        </span>

      </div>


      <h3 className="text-xl font-black mt-5">
        {title}
      </h3>


      <div className="flex items-end gap-1 mt-4">

        <p className="text-4xl font-black text-[#ccff00]">
          {safeValue}
        </p>

        <span className="text-[#62695f] text-xs mb-1">
          /100
        </span>

      </div>


      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-5">

        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width:
              `${safeValue}%`,
          }}
          transition={{
            duration: 0.6,
          }}
          className="h-full bg-[#ccff00] rounded-full"
        />

      </div>


      <p className="text-[#50564e] text-[8px] tracking-[0.15em] mt-3">
        {subtitle}
      </p>

    </motion.div>
  );
}


/* ==================================================
   ACTIVITY CARD
================================================== */

function ActivityCard({
  icon,
  title,
  value,
  suffix,
  highlight = false,
}) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      className={`rounded-[22px] border p-5 ${
        highlight
          ? "bg-[#ccff00]/8 border-[#ccff00]/30"
          : "bg-black/35 border-white/10"
      }`}
    >

      <div className="flex items-center justify-between">

        <p className="text-[#5f665c] text-[8px] tracking-[0.18em]">
          {title.toUpperCase()}
        </p>

        <span className="text-[#ccff00] text-xl">
          {icon}
        </span>

      </div>


      <p
        className={`text-3xl font-black mt-5 ${
          highlight
            ? "text-[#ccff00]"
            : "text-white"
        }`}
      >
        {value}
      </p>

      <p className="text-[#50564e] text-[8px] tracking-[0.15em] mt-2">
        {suffix}
      </p>

    </motion.div>
  );
}


/* ==================================================
   SCORE BAR
================================================== */

function ScoreBar({
  label,
  value,
  weight,
}) {
  const safeValue =
    clampScore(
      value
    );

  return (
    <div>

      <div className="flex justify-between items-end mb-3">

        <div>

          <p className="font-bold">
            {label}
          </p>

          <p className="text-[#5f665c] text-[8px] tracking-[0.16em] mt-1">
            WEIGHT {weight}
          </p>

        </div>


        <p className="text-[#ccff00] text-xl font-black">
          {safeValue}
        </p>

      </div>


      <div className="h-2 bg-white/5 rounded-full overflow-hidden">

        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width:
              `${safeValue}%`,
          }}
          transition={{
            duration: 0.7,
          }}
          className="h-full bg-[#ccff00] rounded-full shadow-[0_0_10px_rgba(204,255,0,0.4)]"
        />

      </div>

    </div>
  );
}


/* ==================================================
   FORMULA CARD
================================================== */

function FormulaCard({
  title,
  percentage,
  text,
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/25 p-5">

      <div className="flex justify-between gap-3">

        <p className="font-bold">
          {title}
        </p>

        <span className="text-[#ccff00] font-black">
          {percentage}
        </span>

      </div>

      <p className="text-[#81887d] text-sm mt-3 leading-relaxed">
        {text}
      </p>

    </div>
  );
}


/* ==================================================
   FORMULA SCORE
================================================== */

function FormulaScore({
  title,
  value,
  weight,
  code,
}) {
  const safeValue =
    clampScore(
      value
    );

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-black/30 p-6">

      <div className="absolute right-[-60px] top-[-60px] w-[150px] h-[150px] rounded-full bg-[#ccff00]/5 blur-[60px]" />

      <div className="relative z-10">

        <div className="flex justify-between">

          <p className="text-[#5f665c] text-[8px] tracking-[0.18em]">
            {code}
          </p>

          <span className="text-[#ccff00] text-xs font-black">
            {weight}
          </span>

        </div>


        <p className="text-xl font-black mt-4">
          {title}
        </p>

        <p className="text-5xl font-black text-[#ccff00] mt-4">
          {safeValue}
        </p>

      </div>

    </div>
  );
}


/* ==================================================
   EXERCISE CARD
================================================== */

function ExerciseCard({
  title,
  code,
  value,
}) {
  const safeValue =
    clampScore(
      value
    );

  const status =
    getScoreStatus(
      safeValue
    );


  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      className="rounded-[26px] border border-white/10 bg-black/35 backdrop-blur-xl p-6"
    >

      <div className="flex items-start justify-between">

        <div>

          <p className="text-[#5f665c] text-[9px] tracking-[0.18em]">
            {code}
          </p>

          <h3 className="text-2xl font-black mt-2">
            {title}
          </h3>

        </div>


        <span
          className={`text-[9px] tracking-[0.15em] font-black ${status.className}`}
        >
          {status.text}
        </span>

      </div>


      <div className="flex items-end gap-1 mt-6">

        <p className="text-5xl font-black text-[#ccff00]">
          {safeValue}
        </p>

        <span className="text-[#62695f] mb-1">
          /100
        </span>

      </div>


      <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-5">

        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width:
              `${safeValue}%`,
          }}
          className="h-full bg-[#ccff00] rounded-full"
        />

      </div>


      <p className="text-[#5f665c] text-[8px] tracking-[0.15em] mt-3">
        AVERAGE MOTIONCHECK FORM SCORE
      </p>

    </motion.div>
  );
}


/* ==================================================
   HELPERS
================================================== */

function clampScore(
  value
) {
  return Math.max(
    0,
    Math.min(
      Number(value) || 0,
      100
    )
  );
}


function getDNAStatus(
  score
) {
  if (score >= 90) {
    return "ELITE";
  }

  if (score >= 80) {
    return "ADVANCED";
  }

  if (score >= 70) {
    return "STRONG";
  }

  if (score >= 50) {
    return "DEVELOPING";
  }

  return "BUILDING";
}


function getScoreStatus(
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
        "DEVELOPING",

      className:
        "text-yellow-400",
    };
  }

  return {
    text:
      "BUILDING",

    className:
      "text-red-400",
  };
}


export default ProgressDNA;