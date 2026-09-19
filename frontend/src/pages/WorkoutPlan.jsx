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
  AnimatePresence,
} from "framer-motion";

import apiFetch from "../services/api";
import CinematicBackground from "../components/futuristic/CinematicBackground";


function WorkoutPlan() {
  const navigate =
    useNavigate();

  const [plan, setPlan] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    updatingExercise,
    setUpdatingExercise,
  ] = useState(null);

  const [
    activeWeek,
    setActiveWeek,
  ] = useState(1);


  // ==================================================
  // LOAD ACTIVE PLAN
  // ==================================================

  const fetchPlan =
    async () => {

      try {
        setLoading(true);
        setError("");

        const response =
          await apiFetch(
            "/workouts/active/"
          );

        if (!response) {
          return;
        }

        if (
          response.status === 404
        ) {
          setPlan(null);
          return;
        }

        const data =
          await response.json();

        if (response.ok) {
          setPlan(data);
          return;
        }

        setError(
          data.error ||
          data.detail ||
          "Could not load workout plan."
        );

      } catch (err) {
        console.error(
          "Workout plan error:",
          err
        );

        setError(
          "Could not load your workout plan."
        );

      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    fetchPlan();
  }, []);


  // ==================================================
  // TOGGLE EXERCISE
  // ==================================================

  const toggleExercise =
    async (exerciseId) => {

      if (
        updatingExercise ===
        exerciseId
      ) {
        return;
      }

      try {
        setUpdatingExercise(
          exerciseId
        );

        setError("");

        const response =
          await apiFetch(
            `/workouts/exercises/${exerciseId}/toggle/`,
            {
              method: "PATCH",
            }
          );

        if (!response) {
          return;
        }

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.error ||
            data.detail ||
            "Could not update exercise."
          );

          return;
        }


        setPlan(
          (currentPlan) => {

            if (!currentPlan) {
              return currentPlan;
            }

            return {
              ...currentPlan,

              days:
                currentPlan.days.map(
                  (day) => {

                    if (
                      day.id !==
                      data.workout_day_id
                    ) {
                      return day;
                    }

                    return {
                      ...day,

                      completed:
                        data.day_completed,

                      completed_at:
                        data.completed_at,

                      exercises:
                        day.exercises.map(
                          (exercise) => {

                            if (
                              exercise.id !==
                              data.exercise_id
                            ) {
                              return exercise;
                            }

                            return {
                              ...exercise,

                              completed:
                                data.completed,
                            };
                          }
                        ),
                    };
                  }
                ),
            };
          }
        );

      } catch (err) {
        console.error(
          "Exercise toggle error:",
          err
        );

        setError(
          "Could not update exercise."
        );

      } finally {
        setUpdatingExercise(
          null
        );
      }
    };


  // ==================================================
  // PLAN STATS
  // ==================================================

  const stats =
    useMemo(() => {

      if (!plan?.days) {
        return {
          totalExercises: 0,
          completedExercises: 0,
          completedDays: 0,
          trainingDays: 0,
          percent: 0,
        };
      }

      const trainingDays =
        plan.days.filter(
          (day) =>
            !day.is_rest_day
        );

      const exercises =
        trainingDays.flatMap(
          (day) =>
            day.exercises || []
        );

      const completedExercises =
        exercises.filter(
          (exercise) =>
            exercise.completed
        );

      const completedDays =
        trainingDays.filter(
          (day) =>
            day.completed
        );

      const percent =
        exercises.length > 0
          ? Math.round(
              (
                completedExercises.length /
                exercises.length
              ) * 100
            )
          : 0;

      return {
        totalExercises:
          exercises.length,

        completedExercises:
          completedExercises.length,

        completedDays:
          completedDays.length,

        trainingDays:
          trainingDays.length,

        percent,
      };

    }, [plan]);


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
            LOADING TRAINING PROTOCOL
          </p>

        </div>

      </div>
    );
  }


  // ==================================================
  // NO PLAN
  // ==================================================

  if (!plan) {
    return (
      <div className="relative min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 overflow-hidden">

        <CinematicBackground />

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="relative z-20 max-w-2xl w-full rounded-[30px] border border-[#ccff00]/20 bg-black/40 backdrop-blur-2xl p-9 text-center"
        >

          <p className="text-[#ccff00] text-[10px] tracking-[0.28em]">
            X-FIT TRAINING ENGINE
          </p>

          <h1 className="text-4xl md:text-5xl font-black mt-5">
            NO ACTIVE PROTOCOL
          </h1>

          <p className="text-[#8f968a] mt-5 leading-relaxed">
            Complete your athlete assessment and X-Fit
            will generate your personalized four-week training
            architecture.
          </p>

          <button
            onClick={() =>
              navigate(
                "/assessment"
              )
            }
            className="mt-8 bg-[#ccff00] text-black font-black px-8 py-4 rounded-xl hover:bg-[#b8e600] transition"
          >
            START ASSESSMENT →
          </button>

        </motion.div>

      </div>
    );
  }


  // ==================================================
  // WEEK DATA
  // ==================================================

  const weeks = [1, 2, 3, 4];

  const activeWeekDays =
    plan.days.filter(
      (day) =>
        day.week_number ===
        activeWeek
    );

  const activeWeekTheme =
    activeWeekDays.length > 0
      ? activeWeekDays[0].theme
      : "";

  const activeWeekTrainingDays =
    activeWeekDays.filter(
      (day) =>
        !day.is_rest_day
    );

  const completedWeekDays =
    activeWeekTrainingDays.filter(
      (day) =>
        day.completed
    ).length;

  const activeWeekPercent =
    activeWeekTrainingDays.length > 0
      ? Math.round(
          (
            completedWeekDays /
            activeWeekTrainingDays.length
          ) * 100
        )
      : 0;


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
              active
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


        {/* HEADER */}

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

              <p className="text-[#ccff00] text-[10px] tracking-[0.28em]">
                X-FIT TRAINING ARCHITECTURE
              </p>

              <h1 className="text-4xl md:text-6xl xl:text-7xl font-black tracking-[-0.05em] mt-4">

                FOUR-WEEK

                <br />

                <span className="text-[#ccff00]">
                  PROTOCOL.
                </span>

              </h1>

              <p className="text-[#91988c] text-lg mt-5 max-w-2xl leading-relaxed">
                Execute each training session to increase
                consistency, unlock progression and evolve your
                Progress DNA.
              </p>

            </div>


            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

              <HeaderStat
                label="LEVEL"
                value={plan.level}
                highlight
              />

              <HeaderStat
                label="FREQUENCY"
                value={`${plan.workout_days_per_week}/WK`}
              />

              <HeaderStat
                label="COMPLETE"
                value={`${stats.percent}%`}
                highlight
              />

            </div>

          </div>

        </motion.header>


        {/* ERROR */}

        {error && (
          <div className="mb-7 bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl">
            {error}
          </div>
        )}


        {/* ==================================================
            PROTOCOL OVERVIEW
        ================================================== */}

        <section className="grid xl:grid-cols-12 gap-5 mb-8">


          {/* LEFT PROGRESS CORE */}

          <div className="xl:col-span-5 relative overflow-hidden rounded-[30px] border border-[#ccff00]/20 bg-black/40 backdrop-blur-xl p-8">

            <div className="absolute right-[-100px] top-[-100px] w-[320px] h-[320px] rounded-full bg-[#ccff00]/10 blur-[120px]" />


            <div className="relative z-10">

              <p className="text-[#62695f] text-[9px] tracking-[0.24em]">
                PROTOCOL COMPLETION
              </p>


              <div className="relative w-[240px] h-[240px] mx-auto mt-8">

                <div className="absolute inset-0 rounded-full border-[12px] border-white/5" />

                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-[-8px] rounded-full border border-dashed border-[#ccff00]/25"
                />

                <motion.div
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-[22px] rounded-full border border-[#ccff00]/15"
                />


                <div className="absolute inset-0 flex flex-col items-center justify-center">

                  <p className="text-7xl font-black text-[#ccff00]">
                    {stats.percent}
                  </p>

                  <p className="text-[#646b61] text-[9px] tracking-[0.2em] mt-1">
                    % COMPLETE
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-2 gap-3 mt-8">

                <ProtocolMetric
                  label="EXERCISES"
                  value={`${stats.completedExercises}/${stats.totalExercises}`}
                />

                <ProtocolMetric
                  label="TRAINING DAYS"
                  value={`${stats.completedDays}/${stats.trainingDays}`}
                />

              </div>

            </div>

          </div>


          {/* RIGHT OVERVIEW */}

          <div className="xl:col-span-7 grid gap-5">

            <div className="grid sm:grid-cols-2 gap-5">

              <OverviewCard
                label="ATHLETE LEVEL"
                value={plan.level}
                highlight
              />

              <OverviewCard
                label="FITNESS GOAL"
                value={
                  formatText(
                    plan.fitness_goal
                  )
                }
              />

            </div>


            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/35 backdrop-blur-xl p-7">

              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

                <div>

                  <p className="text-[#62695f] text-[9px] tracking-[0.24em]">
                    ACTIVE WEEK
                  </p>

                  <h2 className="text-3xl font-black mt-3">
                    WEEK {activeWeek}
                  </h2>

                  <p className="text-[#ccff00] text-lg font-bold mt-2">
                    {activeWeekTheme}
                  </p>

                </div>


                <div className="md:text-right">

                  <p className="text-5xl font-black text-[#ccff00]">
                    {activeWeekPercent}%
                  </p>

                  <p className="text-[#646b61] text-[9px] tracking-[0.18em] mt-1">
                    WEEK COMPLETION
                  </p>

                </div>

              </div>


              <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-7">

                <motion.div
                  animate={{
                    width:
                      `${activeWeekPercent}%`,
                  }}
                  className="h-full bg-[#ccff00] rounded-full shadow-[0_0_14px_rgba(204,255,0,0.5)]"
                />

              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            WEEK NAV
        ================================================== */}

        <section className="mb-8">

          <div className="flex items-end justify-between gap-4 mb-5">

            <div>

              <p className="text-[#ccff00] text-[10px] tracking-[0.24em]">
                TRAINING BLOCKS
              </p>

              <h2 className="text-3xl font-black mt-2">
                Select Protocol Week
              </h2>

            </div>

          </div>


          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

            {weeks.map(
              (weekNumber) => {

                const weekDays =
                  plan.days.filter(
                    (day) =>
                      day.week_number ===
                      weekNumber
                  );

                const trainingDays =
                  weekDays.filter(
                    (day) =>
                      !day.is_rest_day
                  );

                const completedDays =
                  trainingDays.filter(
                    (day) =>
                      day.completed
                  ).length;

                const selected =
                  activeWeek ===
                  weekNumber;


                return (
                  <motion.button
                    whileHover={{
                      y: -3,
                    }}
                    key={weekNumber}
                    onClick={() =>
                      setActiveWeek(
                        weekNumber
                      )
                    }
                    className={`relative overflow-hidden rounded-2xl border p-5 text-left transition ${
                      selected
                        ? "bg-[#ccff00]/10 border-[#ccff00]/40"
                        : "bg-black/30 border-white/10 hover:border-[#ccff00]/25"
                    }`}
                  >

                    <p className="text-[#666d63] text-[9px] tracking-[0.2em]">
                      WEEK
                    </p>

                    <p
                      className={`text-3xl font-black mt-2 ${
                        selected
                          ? "text-[#ccff00]"
                          : "text-white"
                      }`}
                    >
                      0{weekNumber}
                    </p>

                    <p className="text-[#8e9589] text-sm mt-2">
                      {completedDays}/{trainingDays.length} sessions
                    </p>

                    {selected && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ccff00]" />
                    )}

                  </motion.button>
                );
              }
            )}

          </div>

        </section>


        {/* ==================================================
            ACTIVE WEEK
        ================================================== */}

        <AnimatePresence
          mode="wait"
        >

          <motion.section
            key={activeWeek}
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.3,
            }}
          >

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">

              <div>

                <p className="text-[#ccff00] text-[10px] tracking-[0.24em]">
                  WEEK {activeWeek}
                </p>

                <h2 className="text-3xl md:text-4xl font-black mt-2">
                  {activeWeekTheme}
                </h2>

              </div>


              <p className="text-[#858c80] text-sm">
                {completedWeekDays}/{activeWeekTrainingDays.length} sessions complete
              </p>

            </div>


            <div className="grid xl:grid-cols-2 gap-5">

              {activeWeekDays.map(
                (day) => (

                  <WorkoutDayCard
                    key={day.id}
                    day={day}
                    updatingExercise={
                      updatingExercise
                    }
                    toggleExercise={
                      toggleExercise
                    }
                    navigate={
                      navigate
                    }
                  />

                )
              )}

            </div>

          </motion.section>

        </AnimatePresence>


        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div className="grid md:grid-cols-3 gap-4 mt-12">

          <button
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
            className="border border-white/10 bg-black/30 text-white font-bold py-4 rounded-xl hover:border-[#ccff00]/40 transition"
          >
            DASHBOARD
          </button>


          <button
            onClick={() =>
              navigate(
                "/motioncheck"
              )
            }
            className="border border-[#ccff00]/40 text-[#ccff00] font-bold py-4 rounded-xl hover:bg-[#ccff00]/10 transition"
          >
            MOTIONCHECK
          </button>


          <button
            onClick={() =>
              navigate(
                "/progress-dna"
              )
            }
            className="bg-[#ccff00] text-black font-black py-4 rounded-xl hover:bg-[#b8e600] transition"
          >
            PROGRESS DNA
          </button>

        </div>

      </main>

    </div>
  );
}


/* ==================================================
   WORKOUT DAY
================================================== */

function WorkoutDayCard({
  day,
  updatingExercise,
  toggleExercise,
  navigate,
}) {

  const completedExercises =
    day.exercises?.filter(
      (exercise) =>
        exercise.completed
    ).length || 0;

  const totalExercises =
    day.exercises?.length || 0;

  const dayPercent =
    totalExercises > 0
      ? Math.round(
          (
            completedExercises /
            totalExercises
          ) * 100
        )
      : 0;


  return (
    <motion.article
      whileHover={{
        y: day.is_rest_day
          ? 0
          : -2,
      }}
      className={`relative overflow-hidden rounded-[26px] border p-6 backdrop-blur-xl transition ${
        day.completed
          ? "bg-[#00ff95]/5 border-[#00ff95]/20"
          : day.is_rest_day
          ? "bg-[#00d1ff]/5 border-[#00d1ff]/15"
          : "bg-black/35 border-white/10"
      }`}
    >

      <div className="flex justify-between items-start gap-4 mb-6">

        <div className="flex gap-4">

          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-black border ${
              day.completed
                ? "bg-[#00ff95] text-black border-[#00ff95]"
                : day.is_rest_day
                ? "bg-[#00d1ff]/10 text-[#00d1ff] border-[#00d1ff]/20"
                : "bg-[#ccff00]/5 text-[#ccff00] border-[#ccff00]/20"
            }`}
          >
            {day.completed
              ? "✓"
              : String(
                  day.day_number
                ).padStart(
                  2,
                  "0"
                )}
          </div>


          <div>

            <p className="text-[#62695f] text-[9px] tracking-[0.2em]">
              DAY {day.day_number}
            </p>

            <h3 className="text-2xl font-black mt-1">
              {day.title}
            </h3>

          </div>

        </div>


        {day.completed ? (

          <StatusBadge
            text="COMPLETE"
            type="complete"
          />

        ) : day.is_rest_day ? (

          <StatusBadge
            text="RECOVERY"
            type="recovery"
          />

        ) : (

          <StatusBadge
            text={`${dayPercent}%`}
          />

        )}

      </div>


      {/* REST DAY */}

      {day.is_rest_day ? (

        <div className="rounded-xl border border-[#00d1ff]/10 bg-black/25 p-5">

          <p className="text-[#00d1ff] font-bold">
            Recovery Protocol
          </p>

          <p className="text-[#848b80] text-sm mt-2 leading-relaxed">
            Prioritize sleep, hydration, mobility and
            recovery before the next training block.
          </p>

        </div>

      ) : (

        <>

          {/* SESSION PROGRESS */}

          <div className="mb-6">

            <div className="flex justify-between mb-2">

              <span className="text-[#62695f] text-[9px] tracking-[0.2em]">
                SESSION PROGRESS
              </span>

              <span className="text-[#ccff00] text-xs font-bold">
                {completedExercises}/{totalExercises}
              </span>

            </div>


            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">

              <motion.div
                animate={{
                  width:
                    `${dayPercent}%`,
                }}
                className={`h-full rounded-full ${
                  day.completed
                    ? "bg-[#00ff95]"
                    : "bg-[#ccff00]"
                }`}
              />

            </div>

          </div>


          {/* EXERCISES */}

          <div className="space-y-3">

            {(day.exercises || []).map(
              (exercise) => {

                const updating =
                  updatingExercise ===
                  exercise.id;


                return (
                  <div
                    key={exercise.id}
                    className={`rounded-xl border p-4 transition ${
                      exercise.completed
                        ? "bg-[#00ff95]/5 border-[#00ff95]/15"
                        : "bg-black/30 border-white/5 hover:border-[#ccff00]/20"
                    }`}
                  >

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                      <div className="flex items-center gap-3">

                        <button
                          type="button"
                          disabled={
                            updating
                          }
                          onClick={() =>
                            toggleExercise(
                              exercise.id
                            )
                          }
                          className={`w-9 h-9 rounded-lg border flex-shrink-0 flex items-center justify-center font-black transition ${
                            exercise.completed
                              ? "bg-[#00ff95] text-black border-[#00ff95]"
                              : "border-white/10 text-[#ccff00] hover:border-[#ccff00]/50"
                          } disabled:opacity-50`}
                        >
                          {updating
                            ? "…"
                            : exercise.completed
                            ? "✓"
                            : ""}
                        </button>


                        <div>

                          <h4
                            className={`font-bold text-lg ${
                              exercise.completed
                                ? "text-[#00ff95]"
                                : "text-white"
                            }`}
                          >
                            {exercise.name}
                          </h4>

                          <p className="text-[#62695f] text-sm mt-1">
                            {exercise.equipment ||
                              "No equipment"}
                          </p>

                        </div>

                      </div>


                      <div className="flex items-center flex-wrap gap-2">

                        <ExerciseStat
                          label="SETS"
                          value={exercise.sets}
                        />

                        <ExerciseStat
                          label="REPS"
                          value={exercise.reps}
                        />

                        <ExerciseStat
                          label="REST"
                          value={`${exercise.rest_seconds}s`}
                        />


                        {exercise.motioncheck_supported && (

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                "/motioncheck"
                              )
                            }
                            className="px-3 py-2 rounded-lg border border-[#ccff00]/30 bg-[#ccff00]/5 text-[#ccff00] text-[9px] font-bold tracking-[0.14em] hover:bg-[#ccff00]/10 transition"
                          >
                            MOTIONCHECK
                          </button>

                        )}

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </>
      )}

    </motion.article>
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
   HEADER STAT
================================================== */

function HeaderStat({
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 px-5 py-3">

      <p className="text-[#5f665c] text-[8px] tracking-[0.18em]">
        {label}
      </p>

      <p
        className={`font-black mt-2 ${
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
   OVERVIEW
================================================== */

function OverviewCard({
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/35 backdrop-blur-xl p-6">

      <p className="text-[#62695f] text-[9px] tracking-[0.2em]">
        {label}
      </p>

      <p
        className={`font-black mt-4 capitalize ${
          highlight
            ? "text-[#ccff00] text-3xl"
            : "text-white text-2xl"
        }`}
      >
        {value}
      </p>

    </div>
  );
}


/* ==================================================
   PROTOCOL METRIC
================================================== */

function ProtocolMetric({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/30 p-4">

      <p className="text-[#5f665c] text-[8px] tracking-[0.18em]">
        {label}
      </p>

      <p className="text-white text-xl font-black mt-2">
        {value}
      </p>

    </div>
  );
}


/* ==================================================
   EXERCISE STAT
================================================== */

function ExerciseStat({
  label,
  value,
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-black/30 px-3 py-2 text-center">

      <p className="text-[#5f665c] text-[8px] tracking-wider">
        {label}
      </p>

      <p className="text-white font-bold text-sm mt-1">
        {value}
      </p>

    </div>
  );
}


/* ==================================================
   STATUS BADGE
================================================== */

function StatusBadge({
  text,
  type = "normal",
}) {

  let classes =
    "text-[#ccff00] border-[#ccff00]/30 bg-[#ccff00]/5";

  if (
    type === "complete"
  ) {
    classes =
      "text-[#00ff95] border-[#00ff95]/30 bg-[#00ff95]/5";
  }

  if (
    type === "recovery"
  ) {
    classes =
      "text-[#00d1ff] border-[#00d1ff]/30 bg-[#00d1ff]/5";
  }


  return (
    <span
      className={`text-[9px] font-bold tracking-[0.15em] border px-3 py-2 rounded-full ${classes}`}
    >
      {text}
    </span>
  );
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

  return value
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


export default WorkoutPlan;