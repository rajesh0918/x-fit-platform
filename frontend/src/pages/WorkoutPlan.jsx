import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import apiFetch from "../services/api";


function WorkoutPlan() {
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingExercise, setUpdatingExercise] =
    useState(null);

  const [streak, setStreak] = useState(0);

  const [confirmingDay, setConfirmingDay] =
    useState(null);


  // ==================================================
  // LOAD ACTIVE WORKOUT PLAN
  // ==================================================

  const fetchPlan = async () => {
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
  // LOAD WORKOUT STREAK
  // ==================================================

  const fetchStreak = async () => {
    try {
      const response = await apiFetch(
        "/workouts/stats/"
      );

      if (!response || !response.ok) {
        return;
      }

      const data = await response.json();
      setStreak(data.current_streak || 0);

    } catch (err) {
      console.error(
        "Workout streak error:",
        err
      );
    }
  };


  useEffect(() => {
    fetchStreak();
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


        // ------------------------------------------
        // UPDATE UI WITHOUT FULL PAGE RELOAD
        // ------------------------------------------

        setPlan(
          (currentPlan) => {

            if (
              !currentPlan
            ) {
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
  // CONFIRM COMPLETED DAY
  // ==================================================

  const confirmDay = async (day) => {
    if (!day || day.completed || day.is_rest_day) {
      return;
    }

    const exercises = day.exercises || [];
    const allCompleted =
      exercises.length > 0 &&
      exercises.every(
        (exercise) => exercise.completed
      );

    if (!allCompleted) {
      setError(
        "Complete every exercise before submitting the day."
      );
      return;
    }

    try {
      setConfirmingDay(day.id);
      setError("");

      const firstExerciseId =
        exercises[0]?.id;

      if (!firstExerciseId) {
        setError(
          "No exercise was found for this day."
        );
        return;
      }

      const response = await apiFetch(
        `/workouts/exercises/${firstExerciseId}/toggle/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            complete_day: true,
          }),
        }
      );

      if (!response) {
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
          data.detail ||
          "Could not complete the workout day."
        );
        return;
      }

      setPlan((currentPlan) => {
        if (!currentPlan) {
          return currentPlan;
        }

        return {
          ...currentPlan,
          days: currentPlan.days.map((item) =>
            item.id === data.workout_day_id
              ? {
                  ...item,
                  completed: true,
                  completed_at: data.completed_at,
                }
              : item
          ),
        };
      });

      await fetchStreak();

    } catch (err) {
      console.error(
        "Day confirmation error:",
        err
      );
      setError(
        "Could not confirm the completed day."
      );

    } finally {
      setConfirmingDay(null);
    }
  };


  // ==================================================
  // PLAN STATISTICS
  // ==================================================

  const stats = useMemo(() => {
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
      <div className="min-h-screen bg-[#070707] text-white flex items-center justify-center">

        <div className="text-center">

          <div className="w-16 h-16 border-2 border-[#ccff00]/20 border-t-[#ccff00] rounded-full animate-spin mx-auto" />

          <p className="text-[#ccff00] text-sm tracking-[0.22em] mt-5">
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
      <div
        className="min-h-screen bg-[#070707] text-white flex items-center justify-center px-6"
        style={{
          backgroundImage:
            "linear-gradient(rgba(204,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,0.03) 1px, transparent 1px)",

          backgroundSize:
            "45px 45px",
        }}
      >

        <div className="max-w-xl w-full bg-[#111111] border border-[#ccff00]/20 rounded-2xl p-8 text-center">

          <p className="text-[#ccff00] text-xs tracking-[0.25em]">
            X-FIT TRAINING ENGINE
          </p>

          <h1 className="text-3xl md:text-4xl font-black mt-4">
            No Workout Plan Yet
          </h1>

          <p className="text-[#8d9384] mt-4 leading-relaxed">
            Complete your athlete assessment and X-Fit will
            generate your personalized four-week training protocol.
          </p>

          <button
            onClick={() =>
              navigate("/assessment")
            }
            className="mt-7 bg-[#ccff00] text-black font-black px-8 py-4 rounded-lg hover:bg-[#b8e600] transition"
          >
            START ASSESSMENT →
          </button>

        </div>

      </div>
    );
  }


  const weeks =
    [1, 2, 3, 4];


  return (
    <div
      className="min-h-screen bg-[#070707] text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(204,255,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,0.025) 1px, transparent 1px)",

        backgroundSize:
          "45px 45px",
      }}
    >

      {/* BACKGROUND GLOW */}

      <div className="fixed top-[-250px] right-[-200px] w-[650px] h-[650px] bg-[#ccff00]/5 rounded-full blur-[150px] pointer-events-none" />


      {/* ==================================================
          NAVBAR
      ================================================== */}

      <nav className="sticky top-0 z-50 h-20 bg-[#070707]/90 backdrop-blur-xl border-b border-[#444933]/40">

        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="text-[#ccff00] text-4xl font-black tracking-tighter"
          >
            X-FIT
          </button>


          <div className="hidden md:flex items-center gap-7">

            <NavButton
              text="Today"
              onClick={() =>
                navigate("/dashboard")
              }
            />

            <NavButton
              text="Workouts"
              active
            />

            <NavButton
              text="MotionCheck"
              onClick={() =>
                navigate("/motioncheck")
              }
            />

            <NavButton
              text="Nutrition"
              onClick={() =>
                navigate("/diet-plan")
              }
            />

            <NavButton
              text="Progress DNA"
              onClick={() =>
                navigate("/progress-dna")
              }
            />

          </div>


          <button
            onClick={() =>
              navigate("/profile")
            }
            className="w-10 h-10 border border-[#444933] rounded-full text-[#ccff00] hover:bg-[#ccff00] hover:text-black transition"
          >
            ◉
          </button>

        </div>

      </nav>


      {/* ==================================================
          PAGE
      ================================================== */}

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">


        {/* HEADER */}

        <header className="mb-10">

          <p className="text-[#ccff00] uppercase tracking-[0.25em] text-sm mb-2">
            X-Fit Training Architecture
          </p>

          <h1 className="text-4xl md:text-6xl font-black mb-4">
            Your 4-Week Protocol
          </h1>

          <p className="text-[#8d9384] text-lg">
            Complete each exercise to advance your training
            consistency and Progress DNA.
          </p>

          <div className="mt-5 inline-flex items-center gap-3 border border-[#ccff00]/25 bg-[#111111] rounded-xl px-5 py-3">
            <span className="text-xl">🔥</span>
            <div>
              <p className="text-[#ccff00] font-black text-lg">
                {streak} Day Streak
              </p>
              <p className="text-[#707766] text-[10px] uppercase tracking-[0.18em]">
                Training consistency
              </p>
            </div>
          </div>

        </header>


        {/* ERROR */}

        {error && (
          <div className="mb-7 bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl">
            {error}
          </div>
        )}


        {/* ==================================================
            PLAN OVERVIEW
        ================================================== */}

        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

          <OverviewCard
            label="X-FIT LEVEL"
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

          <OverviewCard
            label="TRAINING DAYS"
            value={`${plan.workout_days_per_week}/week`}
          />

          <OverviewCard
            label="EXERCISES"
            value={`${stats.completedExercises}/${stats.totalExercises}`}
          />

          <OverviewCard
            label="PROGRAM"
            value={`${stats.percent}%`}
            highlight
          />

        </section>


        {/* PROGRAM PROGRESS */}

        <section className="bg-[#111111] border border-[#444933]/40 rounded-2xl p-6 mb-10">

          <div className="flex justify-between gap-4 mb-3">

            <div>

              <p className="text-[#707766] text-xs tracking-[0.2em]">
                PROGRAM COMPLETION
              </p>

              <p className="font-bold text-white mt-1">
                {stats.completedDays}/{stats.trainingDays} training days complete
              </p>

            </div>


            <p className="text-[#ccff00] text-2xl font-black">
              {stats.percent}%
            </p>

          </div>


          <div className="h-2 bg-[#080908] rounded-full overflow-hidden">

            <div
              className="h-full bg-[#ccff00] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(204,255,0,0.6)]"
              style={{
                width:
                  `${stats.percent}%`,
              }}
            />

          </div>

        </section>


        {/* ==================================================
            WEEKS
        ================================================== */}

        <div className="space-y-14">

          {weeks.map(
            (weekNumber) => {

              const weekDays =
                plan.days.filter(
                  (day) =>
                    day.week_number ===
                    weekNumber
                );


              const weekTheme =
                weekDays.length > 0
                  ? weekDays[0].theme
                  : "";


              const weekTrainingDays =
                weekDays.filter(
                  (day) =>
                    !day.is_rest_day
                );


              const completedWeekDays =
                weekTrainingDays.filter(
                  (day) =>
                    day.completed
                ).length;


              return (
                <section
                  key={
                    weekNumber
                  }
                >

                  {/* WEEK HEADER */}

                  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">

                    <div>

                      <p className="text-[#ccff00] text-xs uppercase tracking-[0.25em]">
                        Week {weekNumber}
                      </p>

                      <h2 className="text-3xl font-black mt-2">
                        {weekTheme}
                      </h2>

                    </div>


                    <p className="text-[#8d9384] text-sm">
                      {completedWeekDays}/{weekTrainingDays.length} sessions complete
                    </p>

                  </div>


                  {/* DAYS */}

                  <div className="grid xl:grid-cols-2 gap-5">

                    {weekDays.map(
                      (day) => (

                        <WorkoutDayCard
                          key={day.id}
                          day={day}
                          allDays={plan.days}
                          updatingExercise={
                            updatingExercise
                          }
                          toggleExercise={
                            toggleExercise
                          }
                          confirmDay={
                            confirmDay
                          }
                          confirmingDay={
                            confirmingDay
                          }
                          navigate={
                            navigate
                          }
                        />

                      )
                    )}

                  </div>

                </section>
              );
            }
          )}

        </div>


        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div className="grid md:grid-cols-3 gap-4 mt-12">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="border border-[#444933] text-white font-bold py-4 rounded-lg hover:border-[#ccff00] transition"
          >
            DASHBOARD
          </button>


          <button
            onClick={() =>
              navigate("/motioncheck")
            }
            className="border border-[#ccff00] text-[#ccff00] font-bold py-4 rounded-lg hover:bg-[#ccff00]/10 transition"
          >
            MOTIONCHECK
          </button>


          <button
            onClick={() =>
              navigate("/progress-dna")
            }
            className="bg-[#ccff00] text-black font-black py-4 rounded-lg hover:bg-[#b8e600] transition"
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
  allDays,
  updatingExercise,
  toggleExercise,
  confirmDay,
  confirmingDay,
  navigate,
}) {

  const trainingDays =
    (allDays || []).filter(
      (item) => !item.is_rest_day
    );

  const currentIndex =
    trainingDays.findIndex(
      (item) => item.id === day.id
    );

  const previousTrainingDay =
    currentIndex > 0
      ? trainingDays[currentIndex - 1]
      : null;

  const unlocked =
    day.is_rest_day ||
    day.completed ||
    !previousTrainingDay ||
    previousTrainingDay.completed;

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
    <div
      className={`rounded-2xl p-6 border transition ${
        day.completed
          ? "bg-[#0d1511] border-[#00ff95]/25"
          : day.is_rest_day
          ? "bg-[#0d1010] border-[#00d1ff]/20"
          : !unlocked
          ? "bg-[#0b0b0b] border-[#2b2d28]/50 opacity-75"
          : "bg-[#111111] border-[#444933]/40"
      }`}
    >

      {/* HEADER */}

      <div className="flex justify-between items-start gap-4 mb-5">

        <div>

          <p className="text-[#707766] text-xs tracking-[0.18em]">
            DAY {day.day_number}
          </p>

          <h3 className="text-xl md:text-2xl font-black mt-1">
            {day.title}
          </h3>

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

        ) : !unlocked ? (

          <StatusBadge
            text="LOCKED"
            type="locked"
          />

        ) : (

          <StatusBadge
            text={`${dayPercent}%`}
          />

        )}

      </div>


      {/* REST DAY */}

      {day.is_rest_day ? (

        <div className="bg-[#080908] border border-[#00d1ff]/10 rounded-xl p-5">

          <p className="text-[#00d1ff] font-bold">
            Recovery Protocol
          </p>

          <p className="text-[#8d9384] text-sm mt-2 leading-relaxed">
            Prioritize sleep, hydration, mobility and recovery
            before your next training session.
          </p>

        </div>

      ) : (

        <>

          {!unlocked && (
            <div className="mb-5 rounded-xl border border-[#444933]/40 bg-[#080908] p-4">
              <p className="text-[#ccff00] font-bold text-sm">
                🔒 DAY LOCKED
              </p>
              <p className="text-[#707766] text-xs mt-1">
                Complete the previous training day to unlock this session.
              </p>
            </div>
          )}

          {/* DAY PROGRESS */}

          <div className="mb-5">

            <div className="flex justify-between mb-2 text-xs">

              <span className="text-[#707766]">
                SESSION PROGRESS
              </span>

              <span className="text-[#ccff00]">
                {completedExercises}/{totalExercises}
              </span>

            </div>


            <div className="h-1.5 bg-[#080908] rounded-full overflow-hidden">

              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  day.completed
                    ? "bg-[#00ff95]"
                    : "bg-[#ccff00]"
                }`}
                style={{
                  width:
                    `${dayPercent}%`,
                }}
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
                    key={
                      exercise.id
                    }
                    className={`rounded-xl p-4 border ${
                      exercise.completed
                        ? "bg-[#0b1410] border-[#00ff95]/20"
                        : "bg-[#080908] border-[#444933]/30"
                    }`}
                  >

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">


                      {/* EXERCISE INFO */}

                      <div>

                        <div className="flex items-center gap-3">

                          <button
                            type="button"
                            disabled={
                              updating ||
                              !unlocked ||
                              day.completed
                            }
                            onClick={() =>
                              toggleExercise(
                                exercise.id
                              )
                            }
                            className={`w-8 h-8 flex-shrink-0 rounded-lg border flex items-center justify-center font-black transition ${
                              exercise.completed
                                ? "bg-[#00ff95] text-black border-[#00ff95]"
                                : "border-[#444933] text-[#ccff00] hover:border-[#ccff00]"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
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

                            <p className="text-[#707766] text-sm mt-1">
                              {exercise.equipment ||
                                "No equipment"}
                            </p>

                          </div>

                        </div>

                      </div>


                      {/* EXERCISE STATS */}

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
                            className="px-3 py-2 rounded-lg border border-[#ccff00]/40 text-[#ccff00] text-[10px] font-bold tracking-wider hover:bg-[#ccff00]/10 transition"
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

          {!day.is_rest_day && (
            <div className="mt-5 pt-5 border-t border-[#444933]/30">
              <button
                type="button"
                disabled={
                  !unlocked ||
                  day.completed ||
                  totalExercises === 0 ||
                  completedExercises !== totalExercises ||
                  confirmingDay === day.id
                }
                onClick={() =>
                  confirmDay(day)
                }
                className={`w-full py-3 rounded-lg font-black tracking-wide transition ${
                  day.completed
                    ? "bg-[#00ff95]/10 text-[#00ff95] border border-[#00ff95]/30"
                    : !unlocked
                    ? "bg-[#141414] text-[#555a50] border border-[#2b2d28]"
                    : completedExercises === totalExercises
                    ? "bg-[#ccff00] text-black hover:bg-[#b8e600]"
                    : "bg-[#141414] text-[#707766] border border-[#444933]/40 cursor-not-allowed"
                }`}
              >
                {day.completed
                  ? "✓ DAY COMPLETE"
                  : !unlocked
                  ? "🔒 COMPLETE PREVIOUS DAY FIRST"
                  : completedExercises === totalExercises
                  ? confirmingDay === day.id
                    ? "CONFIRMING..."
                    : "COMPLETE DAY → UNLOCK NEXT"
                  : `COMPLETE ALL EXERCISES (${completedExercises}/${totalExercises})`}
              </button>
            </div>
          )}

        </>
      )}

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
      className={`transition ${
        active
          ? "text-white font-bold border-b-2 border-[#ccff00] pb-1"
          : "text-[#aeb39d] hover:text-white"
      }`}
    >
      {text}
    </button>
  );
}


/* ==================================================
   OVERVIEW CARD
================================================== */

function OverviewCard({
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="bg-[#111111] border border-[#444933]/40 rounded-xl p-5">

      <p className="text-[#707766] text-[10px] tracking-[0.18em]">
        {label}
      </p>

      <p
        className={`font-black mt-3 capitalize ${
          highlight
            ? "text-[#ccff00] text-2xl"
            : "text-white text-xl"
        }`}
      >
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
    <div className="bg-[#141614] border border-[#444933]/30 rounded-lg px-3 py-2 text-center">

      <p className="text-[#656b5d] text-[9px] tracking-wider">
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


  if (
    type === "locked"
  ) {
    classes =
      "text-[#707766] border-[#444933]/40 bg-[#141414]";
  }


  return (
    <span
      className={`text-xs font-bold border px-3 py-2 rounded-full ${classes}`}
    >
      {text}
    </span>
  );
}


/* ==================================================
   TEXT FORMAT
================================================== */

function formatText(
  value
) {
  if (!value) {
    return "";
  }

  return value
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}


export default WorkoutPlan;