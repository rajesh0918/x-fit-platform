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

import AthleteHologram from "../components/3d/AthleteHologram";
import CinematicBackground from "../components/futuristic/CinematicBackground";

import apiFetch, {
  logoutUser,
} from "../services/api";


function Dashboard() {
  const navigate =
    useNavigate();


  const [profile, setProfile] =
    useState(null);

  const [
    progressDNA,
    setProgressDNA,
  ] = useState(null);

  const [
    workoutPlan,
    setWorkoutPlan,
  ] = useState(null);

  const [
    workoutActivity,
    setWorkoutActivity,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==================================================
  // LOAD DASHBOARD DATA
  // ==================================================

  useEffect(() => {
    const fetchDashboardData =
      async () => {

        try {
          setLoading(true);
          setError("");


          const [
            profileResponse,
            dnaResponse,
            workoutResponse,
            workoutStatsResponse,
          ] =
            await Promise.all([
              apiFetch(
                "/profile/"
              ),

              apiFetch(
                "/progress-dna/"
              ),

              apiFetch(
                "/workouts/active/"
              ),

              apiFetch(
                "/workouts/stats/"
              ),
            ]);


          if (
            !profileResponse ||
            !dnaResponse ||
            !workoutResponse ||
            !workoutStatsResponse
          ) {
            return;
          }


          // PROFILE

          if (
            profileResponse.ok
          ) {
            const profileData =
              await profileResponse.json();

            setProfile(
              profileData
            );

          } else {
            setError(
              "Could not load athlete profile."
            );
          }


          // PROGRESS DNA

          if (
            dnaResponse.ok
          ) {
            const dnaData =
              await dnaResponse.json();

            setProgressDNA(
              dnaData
            );
          }


          // ACTIVE WORKOUT

          if (
            workoutResponse.ok
          ) {
            const workoutData =
              await workoutResponse.json();

            setWorkoutPlan(
              workoutData
            );

          } else if (
            workoutResponse.status ===
            404
          ) {
            setWorkoutPlan(
              null
            );

          } else {
            setError(
              "Could not load workout plan."
            );
          }


          // WORKOUT STATS

          if (
            workoutStatsResponse.ok
          ) {
            const statsData =
              await workoutStatsResponse.json();

            setWorkoutActivity(
              statsData
            );
          }

        } catch (err) {
          console.error(
            "Dashboard error:",
            err
          );

          setError(
            "Could not load dashboard data."
          );

        } finally {
          setLoading(false);
        }
      };


    fetchDashboardData();

  }, []);


  // ==================================================
  // DISPLAY DATA
  // ==================================================

  const getGreeting = () => {
    const hour =
      new Date().getHours();

    if (hour < 12) {
      return "Good Morning";
    }

    if (hour < 17) {
      return "Good Afternoon";
    }

    return "Good Evening";
  };


  const displayName =
    profile?.name ||
    profile?.username ||
    "Athlete";


  const level =
    workoutPlan?.level ||
    "X-Fit";


  const fitnessGoal =
    workoutPlan
      ?.fitness_goal
      ?.replaceAll(
        "_",
        " "
      ) ||
    profile
      ?.fitness_goal
      ?.replaceAll(
        "_",
        " "
      ) ||
    "General Fitness";


  const trainingDays =
    workoutPlan
      ?.workout_days_per_week ||
    profile
      ?.workout_days_per_week ||
    0;


  // ==================================================
  // DNA
  // ==================================================

  const dnaScore =
    progressDNA
      ?.overall_dna_score ??
    0;

  const techniqueScore =
    progressDNA
      ?.technique_score ??
    0;

  const consistencyScore =
    progressDNA
      ?.consistency_score ??
    0;

  const progressScore =
    progressDNA
      ?.progress_score ??
    0;


  // ==================================================
  // ACTIVITY
  // ==================================================

  const currentStreak =
    workoutActivity
      ?.current_streak ??
    0;

  const totalCompletedWorkouts =
    workoutActivity
      ?.total_completed_workouts ??
    0;

  const workoutsThisWeek =
    workoutActivity
      ?.workouts_this_week ??
    0;

  const weeklyActivity =
    workoutActivity
      ?.weekly_activity ??
    [];


  const lastWorkoutDate =
    workoutActivity
      ?.last_workout_date
      ? new Date(
          workoutActivity
            .last_workout_date
        ).toLocaleDateString(
          undefined,
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )
      : "No workouts";


  // ==================================================
  // PROGRAM COMPLETION
  // ==================================================

  const workoutStats =
    useMemo(() => {

      if (
        !workoutPlan?.days
      ) {
        return {
          totalExercises: 0,
          completedExercises: 0,
          completionPercent: 0,
          completedDays: 0,
          totalTrainingDays: 0,
        };
      }


      const trainingDaysList =
        workoutPlan.days.filter(
          (day) =>
            !day.is_rest_day
        );


      const allExercises =
        trainingDaysList.flatMap(
          (day) =>
            day.exercises || []
        );


      const completedExercises =
        allExercises.filter(
          (exercise) =>
            exercise.completed
        );


      const completedDays =
        trainingDaysList.filter(
          (day) =>
            day.completed
        ).length;


      const totalExercises =
        allExercises.length;


      const completionPercent =
        totalExercises > 0
          ? Math.round(
              (
                completedExercises.length /
                totalExercises
              ) * 100
            )
          : 0;


      return {
        totalExercises,

        completedExercises:
          completedExercises.length,

        completionPercent,

        completedDays,

        totalTrainingDays:
          trainingDaysList.length,
      };

    }, [workoutPlan]);


  // ==================================================
  // TODAY TRAINING
  // ==================================================

  const todayTrainingDay =
    workoutPlan?.days?.find(
      (day) =>
        !day.is_rest_day &&
        !day.completed
    );


  const todayTitle =
    todayTrainingDay?.title ||
    (
      workoutPlan
        ? "Protocol Complete"
        : "No Training Protocol"
    );


  const todayExercises =
    todayTrainingDay
      ?.exercises ||
    [];


  const completedToday =
    todayExercises.filter(
      (exercise) =>
        exercise.completed
    ).length;


  const todayPercent =
    todayExercises.length > 0
      ? Math.round(
          (
            completedToday /
            todayExercises.length
          ) * 100
        )
      : todayTrainingDay
      ? 0
      : 100;


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#050505] text-white flex items-center justify-center overflow-hidden">

        <CinematicBackground />

        <div className="relative z-20 text-center">

          <div className="w-16 h-16 border-2 border-[#ccff00]/20 border-t-[#ccff00] rounded-full animate-spin mx-auto" />

          <p className="text-[#ccff00] text-[11px] tracking-[0.28em] mt-6">
            INITIALIZING X-FIT COMMAND CENTER
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden">

      <CinematicBackground />


      {/* ==================================================
          TOP NAVIGATION
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


          <div className="hidden lg:flex items-center h-full gap-7">

            <TopNav
              text="Today"
              active
              onClick={() =>
                navigate(
                  "/dashboard"
                )
              }
            />

            <TopNav
              text="Training"
              onClick={() =>
                navigate(
                  "/workout-plan"
                )
              }
            />

            <TopNav
              text="MotionCheck"
              onClick={() =>
                navigate(
                  "/motioncheck"
                )
              }
            />

            <TopNav
              text="Nutrition"
              onClick={() =>
                navigate(
                  "/diet-plan"
                )
              }
            />

            <TopNav
              text="Safe Mode"
              onClick={() =>
                navigate(
                  "/safe-mode"
                )
              }
            />

            <TopNav
              text="Progress DNA"
              onClick={() =>
                navigate(
                  "/progress-dna"
                )
              }
            />

            <TopNav
              text="Membership"
              onClick={() =>
                navigate(
                  "/membership"
                )
              }
            />

            <TopNav
              text="Shop"
              onClick={() =>
                navigate(
                  "/shop"
                )
              }
            />

          </div>


          <div className="flex items-center gap-3">

            <div className="hidden md:flex items-center gap-2 mr-2">

              <span className="w-2 h-2 rounded-full bg-[#00ff95] shadow-[0_0_8px_#00ff95]" />

              <span className="text-[#666d63] text-[9px] tracking-[0.18em]">
                SYSTEM ONLINE
              </span>

            </div>


            <button
              onClick={() =>
                navigate(
                  "/profile"
                )
              }
              title="Profile"
              className="w-10 h-10 rounded-full border border-white/10 bg-black/30 flex items-center justify-center text-[#ccff00] hover:bg-[#ccff00] hover:text-black transition"
            >
              ◉
            </button>


            <button
              onClick={
                logoutUser
              }
              title="Logout"
              className="w-10 h-10 rounded-full border border-white/10 bg-black/30 flex items-center justify-center text-[#8b9286] hover:border-red-400/50 hover:text-red-400 transition"
            >
              ↪
            </button>

          </div>

        </div>

      </nav>


      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="relative z-20 max-w-[1500px] mx-auto px-5 md:px-10 pt-[115px] pb-28">


        {/* ERROR */}

        {error && (
          <div className="mb-8 border border-red-500/30 bg-red-500/10 text-red-300 rounded-xl p-4">
            {error}
          </div>
        )}


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

              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/35 border border-[#ccff00]/20">

                <span className="w-2 h-2 rounded-full bg-[#ccff00] shadow-[0_0_10px_#ccff00]" />

                <span className="text-[#ccff00] text-[10px] tracking-[0.22em] uppercase">
                  {level} Protocol Active
                </span>

              </div>


              <p className="text-[#60675e] text-[10px] tracking-[0.22em] mt-7">
                X-FIT ATHLETE COMMAND CENTER
              </p>


              <h1 className="text-4xl md:text-6xl xl:text-7xl font-black tracking-[-0.05em] mt-3">

                {getGreeting()},

                <br className="md:hidden" />

                {" "}

                <span className="text-[#ccff00]">
                  {displayName}.
                </span>

              </h1>


              <p className="text-[#91988c] text-lg mt-4 capitalize">

                {fitnessGoal}

                {" // "}

                {trainingDays} training days / week

              </p>

            </div>


            <div className="grid grid-cols-2 gap-3">

              <HeaderMetric
                label="CURRENT STREAK"
                value={`${currentStreak} DAYS`}
              />

              <HeaderMetric
                label="THIS WEEK"
                value={`${workoutsThisWeek} SESSIONS`}
              />

            </div>

          </div>

        </motion.header>


        {/* ==================================================
            COMMAND CENTER HERO
        ================================================== */}

        <section className="grid xl:grid-cols-12 gap-5 mb-6">


          {/* 3D ATHLETE */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="xl:col-span-7 relative min-h-[620px] overflow-hidden rounded-[30px] border border-white/10 bg-black/30 backdrop-blur-xl"
          >

            <div className="absolute inset-0 bg-gradient-to-br from-[#ccff00]/5 via-transparent to-[#00d1ff]/5" />


            <div className="absolute top-7 left-7 z-20">

              <p className="text-[#ccff00] text-[9px] tracking-[0.25em]">
                ATHLETE DIGITAL TWIN
              </p>

              <h2 className="text-2xl font-black mt-2">
                BODY OS
              </h2>

            </div>


            <div className="absolute top-7 right-7 z-20 text-right">

              <p className="text-[#666d63] text-[9px] tracking-[0.2em]">
                STATUS
              </p>

              <p className="text-[#00ff95] text-xs font-bold mt-2">
                SYNCHRONIZED
              </p>

            </div>


            {/* ORBITS */}

            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 35,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute left-1/2 top-1/2 w-[480px] h-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ccff00]/10"
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
              className="absolute left-1/2 top-1/2 w-[350px] h-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ccff00]/10"
            />


            {/* HOLOGRAM */}

            <div className="absolute inset-0 flex items-center justify-center">

              <div className="w-full max-w-[620px]">
                <AthleteHologram />
              </div>

            </div>


            {/* BOTTOM HUD */}

            <div className="absolute bottom-6 left-6 right-6 z-20 grid grid-cols-3 gap-3">

              <GlassMetric
                label="DNA"
                value={dnaScore}
              />

              <GlassMetric
                label="LEVEL"
                value={level}
              />

              <GlassMetric
                label="PROGRAM"
                value={`${workoutStats.completionPercent}%`}
              />

            </div>

          </motion.div>


          {/* RIGHT COLUMN */}

          <div className="xl:col-span-5 grid gap-5">


            {/* PROGRESS DNA */}

            <motion.button
              whileHover={{
                y: -3,
              }}
              onClick={() =>
                navigate(
                  "/progress-dna"
                )
              }
              className="relative overflow-hidden rounded-[28px] border border-[#ccff00]/20 bg-black/40 backdrop-blur-xl p-7 text-left"
            >

              <div className="absolute right-[-100px] top-[-100px] w-[300px] h-[300px] bg-[#ccff00]/10 rounded-full blur-[110px]" />


              <div className="relative z-10">

                <div className="flex justify-between items-start">

                  <div>

                    <p className="text-[#646b61] text-[9px] tracking-[0.22em]">
                      ATHLETE INTELLIGENCE
                    </p>

                    <h2 className="text-2xl font-black mt-2">
                      Progress DNA
                    </h2>

                  </div>


                  <span className="text-[#ccff00] text-2xl">
                    ◈
                  </span>

                </div>


                <div className="flex items-end gap-3 mt-7">

                  <p className="text-7xl md:text-8xl font-black text-[#ccff00]">
                    {dnaScore}
                  </p>

                  <p className="text-[#666d63] text-xl mb-3">
                    /100
                  </p>

                </div>


                <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-6">

                  <motion.div
                    animate={{
                      width:
                        `${Math.min(
                          Number(
                            dnaScore
                          ) || 0,
                          100
                        )}%`,
                    }}
                    className="h-full bg-[#ccff00] rounded-full shadow-[0_0_14px_rgba(204,255,0,0.6)]"
                  />

                </div>


                <div className="grid grid-cols-3 gap-3 mt-6">

                  <MiniScore
                    label="TECH"
                    value={techniqueScore}
                  />

                  <MiniScore
                    label="CONSIST"
                    value={consistencyScore}
                  />

                  <MiniScore
                    label="PROGRESS"
                    value={progressScore}
                  />

                </div>

              </div>

            </motion.button>


            {/* QUICK STATS */}

            <div className="grid grid-cols-2 gap-4">

              <SystemCard
                label="STREAK"
                value={`${currentStreak}`}
                suffix="DAYS"
                symbol="🔥"
              />

              <SystemCard
                label="WORKOUTS"
                value={
                  totalCompletedWorkouts
                }
                suffix="TOTAL"
                symbol="✓"
              />

              <SystemCard
                label="THIS WEEK"
                value={
                  workoutsThisWeek
                }
                suffix="SESSIONS"
                symbol="⚡"
              />

              <SystemCard
                label="LAST SESSION"
                value={
                  lastWorkoutDate
                }
                small
                symbol="◷"
              />

            </div>

          </div>

        </section>


        {/* ==================================================
            NO PLAN
        ================================================== */}

        {!workoutPlan && (

          <section className="mb-6 relative overflow-hidden rounded-[28px] border border-[#ccff00]/20 bg-black/40 backdrop-blur-xl p-8 md:p-10">

            <div className="absolute right-[-100px] top-[-100px] w-[350px] h-[350px] bg-[#ccff00]/10 blur-[120px] rounded-full" />


            <div className="relative z-10">

              <p className="text-[#ccff00] text-[10px] tracking-[0.24em]">
                TRAINING PROTOCOL REQUIRED
              </p>

              <h2 className="text-3xl md:text-4xl font-black mt-4">
                Complete Athlete Calibration
              </h2>

              <p className="text-[#90978b] mt-4 max-w-2xl">
                X-Fit requires your athlete assessment before
                generating your personalized four-week training system.
              </p>

              <button
                onClick={() =>
                  navigate(
                    "/assessment"
                  )
                }
                className="mt-7 bg-[#ccff00] text-black font-black px-8 py-4 rounded-xl hover:bg-[#b8e600] transition"
              >
                START ASSESSMENT →
              </button>

            </div>

          </section>

        )}


        {/* ==================================================
            CURRENT SESSION
        ================================================== */}

        {workoutPlan && (

          <section className="grid lg:grid-cols-12 gap-5 mb-6">


            {/* SESSION */}

            <div className="lg:col-span-8 relative overflow-hidden rounded-[28px] border border-white/10 bg-black/35 backdrop-blur-xl p-7 md:p-9">

              <div className="absolute right-[-150px] bottom-[-150px] w-[420px] h-[420px] bg-[#ccff00]/7 rounded-full blur-[130px]" />


              <div className="relative z-10">

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

                  <div>

                    <p className="text-[#ccff00] text-[10px] tracking-[0.24em]">
                      CURRENT TRAINING PROTOCOL
                    </p>

                    <h2 className="text-3xl md:text-5xl font-black tracking-[-0.04em] mt-3">
                      {todayTitle}
                    </h2>

                  </div>


                  {todayTrainingDay && (

                    <div className="md:text-right">

                      <p className="text-[#656c62] text-[10px] tracking-[0.18em]">
                        WEEK {todayTrainingDay.week_number}
                        {" // "}
                        DAY {todayTrainingDay.day_number}
                      </p>

                      <p className="font-bold mt-2">
                        {todayTrainingDay.theme}
                      </p>

                    </div>

                  )}

                </div>


                {todayTrainingDay ? (

                  <>

                    <div className="grid grid-cols-3 gap-3 mt-8">

                      <TrainingStat
                        label="EXERCISES"
                        value={
                          todayExercises.length
                        }
                      />

                      <TrainingStat
                        label="COMPLETE"
                        value={
                          completedToday
                        }
                      />

                      <TrainingStat
                        label="SESSION"
                        value={`${todayPercent}%`}
                        highlight
                      />

                    </div>


                    <div className="mt-8">

                      <div className="flex justify-between mb-2">

                        <span className="text-[#656c62] text-[10px] tracking-[0.18em]">
                          SESSION COMPLETION
                        </span>

                        <span className="text-[#ccff00] font-bold">
                          {todayPercent}%
                        </span>

                      </div>


                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">

                        <motion.div
                          animate={{
                            width:
                              `${todayPercent}%`,
                          }}
                          className="h-full bg-[#ccff00] rounded-full shadow-[0_0_12px_rgba(204,255,0,0.6)]"
                        />

                      </div>

                    </div>


                    <div className="flex flex-col sm:flex-row gap-4 mt-8">

                      <motion.button
                        whileHover={{
                          scale: 1.02,
                        }}
                        whileTap={{
                          scale: 0.98,
                        }}
                        onClick={() =>
                          navigate(
                            "/workout-plan"
                          )
                        }
                        className="bg-[#ccff00] text-black font-black px-8 py-4 rounded-xl"
                      >
                        ▶ CONTINUE SESSION
                      </motion.button>


                      <button
                        onClick={() =>
                          navigate(
                            "/motioncheck"
                          )
                        }
                        className="border border-[#ccff00]/50 text-[#ccff00] font-bold px-8 py-4 rounded-xl hover:bg-[#ccff00]/10 transition"
                      >
                        ◉ RUN MOTIONCHECK
                      </button>

                    </div>

                  </>

                ) : (

                  <div className="mt-8">

                    <p className="text-[#00ff95] text-xl font-bold">
                      ✓ ACTIVE PLAN COMPLETE
                    </p>

                    <p className="text-[#8d9488] mt-2">
                      No incomplete training session remains.
                    </p>

                  </div>

                )}

              </div>

            </div>


            {/* PROGRAM RING */}

            <div className="lg:col-span-4 rounded-[28px] border border-white/10 bg-black/35 backdrop-blur-xl p-7">

              <p className="text-[#656c62] text-[9px] tracking-[0.22em]">
                FOUR-WEEK FOUNDATION
              </p>


              <div className="relative w-[210px] h-[210px] mx-auto mt-7">

                <div className="absolute inset-0 rounded-full border-[10px] border-white/5" />


                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-[-8px] rounded-full border border-dashed border-[#ccff00]/20"
                />


                <div className="absolute inset-0 flex flex-col items-center justify-center">

                  <p className="text-6xl font-black text-[#ccff00]">
                    {
                      workoutStats
                        .completionPercent
                    }
                  </p>

                  <p className="text-[#62695f] text-[10px] tracking-widest mt-1">
                    % COMPLETE
                  </p>

                </div>

              </div>


              <div className="space-y-4 mt-7">

                <StatusRow
                  label="Exercises"
                  value={`${workoutStats.completedExercises}/${workoutStats.totalExercises}`}
                />

                <StatusRow
                  label="Training Days"
                  value={`${workoutStats.completedDays}/${workoutStats.totalTrainingDays}`}
                />

                <StatusRow
                  label="Frequency"
                  value={`${trainingDays} Days`}
                />

              </div>

            </div>

          </section>

        )}


        {/* ==================================================
            EXERCISES
        ================================================== */}

        {workoutPlan && (

          <section className="mb-6">

            <div className="flex items-end justify-between gap-4 mb-5">

              <div>

                <p className="text-[#ccff00] text-[10px] tracking-[0.23em]">
                  MOVEMENT PROTOCOL
                </p>

                <h2 className="text-3xl font-black mt-2">
                  Today's Exercises
                </h2>

              </div>


              <button
                onClick={() =>
                  navigate(
                    "/workout-plan"
                  )
                }
                className="text-[#ccff00] text-sm hover:underline"
              >
                View protocol →
              </button>

            </div>


            {todayExercises.length ===
            0 ? (

              <div className="rounded-2xl border border-[#00ff95]/20 bg-[#00ff95]/5 p-7">

                <p className="text-[#00ff95] font-bold">
                  ✓ No incomplete exercises remaining.
                </p>

              </div>

            ) : (

              <div className="grid md:grid-cols-2 gap-4">

                {todayExercises
                  .slice(
                    0,
                    4
                  )
                  .map(
                    (
                      exercise,
                      index
                    ) => (

                      <motion.button
                        whileHover={{
                          y: -3,
                        }}
                        key={
                          exercise.id
                        }
                        onClick={() =>
                          navigate(
                            "/workout-plan"
                          )
                        }
                        className={`group text-left rounded-2xl p-5 border backdrop-blur-xl transition ${
                          exercise.completed
                            ? "bg-[#00ff95]/5 border-[#00ff95]/20"
                            : "bg-black/35 border-white/10 hover:border-[#ccff00]/40"
                        }`}
                      >

                        <div className="flex justify-between gap-5">

                          <div className="flex gap-4">

                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center font-black border ${
                                exercise.completed
                                  ? "bg-[#00ff95]/10 border-[#00ff95]/30 text-[#00ff95]"
                                  : "bg-[#ccff00]/5 border-[#ccff00]/20 text-[#ccff00]"
                              }`}
                            >
                              {exercise.completed
                                ? "✓"
                                : String(
                                    index +
                                      1
                                  ).padStart(
                                    2,
                                    "0"
                                  )}
                            </div>


                            <div>

                              <p
                                className={`text-lg font-bold ${
                                  exercise.completed
                                    ? "text-[#00ff95]"
                                    : "group-hover:text-[#ccff00]"
                                }`}
                              >
                                {exercise.name}
                              </p>

                              <p className="text-[#676e64] text-sm mt-1">
                                {exercise.equipment}
                              </p>

                            </div>

                          </div>


                          <div className="text-right">

                            <p className="text-[#ccff00] text-xs font-bold">
                              {exercise.sets} SETS
                            </p>

                            <p className="text-[#939a8e] text-sm mt-1">
                              {exercise.reps} reps
                            </p>

                          </div>

                        </div>

                      </motion.button>

                    )
                  )}

              </div>

            )}

          </section>

        )}


        {/* ==================================================
            ACTIVITY + MODULES
        ================================================== */}

        <section className="grid lg:grid-cols-12 gap-5">


          {/* ACTIVITY */}

          <div className="lg:col-span-8 rounded-[28px] border border-white/10 bg-black/35 backdrop-blur-xl p-7">

            <div className="flex justify-between items-end gap-4 mb-7">

              <div>

                <p className="text-[#ccff00] text-[10px] tracking-[0.23em]">
                  ACTIVITY MATRIX
                </p>

                <h2 className="text-2xl md:text-3xl font-black mt-2">
                  7-Day Training Activity
                </h2>

              </div>


              <p className="text-[#777e73] text-sm">
                {workoutsThisWeek} this week
              </p>

            </div>


            {weeklyActivity.length ===
            0 ? (

              <p className="text-[#777e73]">
                No activity data available.
              </p>

            ) : (

              <div className="grid grid-cols-7 gap-2 md:gap-4">

                {weeklyActivity.map(
                  (item) => {

                    const active =
                      item.workouts >
                      0;


                    return (
                      <div
                        key={
                          item.date
                        }
                        className="text-center"
                      >

                        <p className="text-[9px] md:text-xs text-[#656c62]">
                          {item.day}
                        </p>


                        <div
                          className={`relative h-20 md:h-28 mt-3 rounded-xl border flex items-end justify-center overflow-hidden ${
                            active
                              ? "bg-[#ccff00]/5 border-[#ccff00]/30"
                              : "bg-black/25 border-white/5"
                          }`}
                        >

                          {active && (

                            <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-gradient-to-t from-[#ccff00]/20 to-transparent" />

                          )}


                          <span
                            className={`relative z-10 mb-4 font-black ${
                              active
                                ? "text-[#ccff00]"
                                : "text-[#41473f]"
                            }`}
                          >
                            {active
                              ? item.workouts
                              : "·"}
                          </span>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            )}

          </div>


          {/* MODULES */}

          <div className="lg:col-span-4 rounded-[28px] border border-white/10 bg-black/35 backdrop-blur-xl p-6">

            <p className="text-[#656c62] text-[9px] tracking-[0.22em] mb-5">
              SYSTEM MODULES
            </p>


            <div className="space-y-3">

              <ModuleButton
                title="Nutrition Engine"
                subtitle="Personalized fuel protocol"
                symbol="◈"
                onClick={() =>
                  navigate(
                    "/diet-plan"
                  )
                }
              />

              <ModuleButton
                title="MotionCheck AI"
                subtitle="Movement intelligence"
                symbol="◉"
                onClick={() =>
                  navigate(
                    "/motioncheck"
                  )
                }
              />

              <ModuleButton
                title="Progress DNA"
                subtitle="Athlete intelligence"
                symbol="◇"
                onClick={() =>
                  navigate(
                    "/progress-dna"
                  )
                }
              />

              <ModuleButton
                title="Safe Mode"
                subtitle="Training education"
                symbol="△"
                onClick={() =>
                  navigate(
                    "/safe-mode"
                  )
                }
              />

            </div>

          </div>

        </section>

      </main>


      {/* ==================================================
          MOBILE NAV
      ================================================== */}

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl border-t border-white/10 px-3 py-3">

        <div className="grid grid-cols-5 gap-2">

          <MobileNav
            label="Today"
            active
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
          />

          <MobileNav
            label="Train"
            onClick={() =>
              navigate(
                "/workout-plan"
              )
            }
          />

          <MobileNav
            label="Motion"
            onClick={() =>
              navigate(
                "/motioncheck"
              )
            }
          />

          <MobileNav
            label="Diet"
            onClick={() =>
              navigate(
                "/diet-plan"
              )
            }
          />

          <MobileNav
            label="DNA"
            onClick={() =>
              navigate(
                "/progress-dna"
              )
            }
          />

        </div>

      </nav>

    </div>
  );
}


/* ==================================================
   TOP NAV
================================================== */

function TopNav({
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
    <div className="rounded-xl border border-white/10 bg-black/30 backdrop-blur-xl px-5 py-3">

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
   GLASS METRIC
================================================== */

function GlassMetric({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/45 backdrop-blur-xl p-4">

      <p className="text-[#5c6359] text-[8px] tracking-[0.18em]">
        {label}
      </p>

      <p className="text-[#ccff00] font-black mt-2 uppercase">
        {value}
      </p>

    </div>
  );
}


/* ==================================================
   MINI SCORE
================================================== */

function MiniScore({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/30 p-3">

      <p className="text-[#5f665c] text-[8px] tracking-[0.15em]">
        {label}
      </p>

      <p className="font-black mt-2">
        {value}
      </p>

    </div>
  );
}


/* ==================================================
   SYSTEM CARD
================================================== */

function SystemCard({
  label,
  value,
  suffix,
  symbol,
  small = false,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/35 backdrop-blur-xl p-5">

      <div className="flex items-start justify-between gap-3">

        <p className="text-[#5f665c] text-[8px] tracking-[0.18em]">
          {label}
        </p>

        <span className="text-[#ccff00]">
          {symbol}
        </span>

      </div>


      <p
        className={`font-black mt-5 ${
          small
            ? "text-lg"
            : "text-3xl"
        }`}
      >
        {value}
      </p>


      {suffix && (
        <p className="text-[#656c62] text-[8px] tracking-[0.18em] mt-1">
          {suffix}
        </p>
      )}

    </div>
  );
}


/* ==================================================
   TRAINING STAT
================================================== */

function TrainingStat({
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/30 p-4">

      <p className="text-[#5e655b] text-[8px] tracking-[0.18em]">
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
   STATUS ROW
================================================== */

function StatusRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-3">

      <span className="text-[#81887c]">
        {label}
      </span>

      <span className="font-bold">
        {value}
      </span>

    </div>
  );
}


/* ==================================================
   MODULE BUTTON
================================================== */

function ModuleButton({
  title,
  subtitle,
  symbol,
  onClick,
}) {
  return (
    <motion.button
      whileHover={{
        x: 3,
      }}
      onClick={
        onClick
      }
      className="w-full flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-black/30 p-4 text-left hover:border-[#ccff00]/35 transition group"
    >

      <div className="flex items-center gap-4">

        <div className="w-10 h-10 rounded-lg border border-[#ccff00]/20 bg-[#ccff00]/5 flex items-center justify-center text-[#ccff00]">
          {symbol}
        </div>


        <div>

          <p className="font-bold group-hover:text-[#ccff00] transition">
            {title}
          </p>

          <p className="text-[#5f665c] text-xs mt-1">
            {subtitle}
          </p>

        </div>

      </div>


      <span className="text-[#ccff00]">
        →
      </span>

    </motion.button>
  );
}


/* ==================================================
   MOBILE NAV
================================================== */

function MobileNav({
  label,
  onClick,
  active = false,
}) {
  return (
    <button
      onClick={
        onClick
      }
      className={`py-2 text-[10px] rounded-full transition ${
        active
          ? "bg-[#ccff00] text-black font-black"
          : "text-[#92998c]"
      }`}
    >
      {label}
    </button>
  );
}


export default Dashboard;