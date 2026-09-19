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
import NutritionChat from "../components/NutritionChat";


function DietPlan() {
  const navigate =
    useNavigate();

  const [plan, setPlan] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [generating, setGenerating] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==================================================
  // LOAD ACTIVE DIET PLAN
  // ==================================================

  const fetchDietPlan =
    async () => {

      try {
        setLoading(true);
        setError("");

        const response =
          await apiFetch(
            "/diet/active/"
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
          "Could not load diet plan."
        );

      } catch (err) {
        console.error(
          "Diet plan load error:",
          err
        );

        setError(
          "Could not load your nutrition plan."
        );

      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    fetchDietPlan();
  }, []);


  // ==================================================
  // GENERATE / REGENERATE
  // ==================================================

  const generateDietPlan =
    async () => {

      try {
        setGenerating(true);
        setError("");

        const response =
          await apiFetch(
            "/diet/generate/",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },
            }
          );

        if (!response) {
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
          "Could not generate diet plan."
        );

      } catch (err) {
        console.error(
          "Diet generation error:",
          err
        );

        setError(
          "Diet plan generation failed."
        );

      } finally {
        setGenerating(false);
      }
    };


  // ==================================================
  // MACRO DATA
  // ==================================================

  const macroData =
    useMemo(() => {

      if (!plan) {
        return [];
      }

      return [
        {
          label:
            "Protein",

          grams:
            Number(
              plan.protein_grams
            ) || 0,

          calories:
            (
              Number(
                plan.protein_grams
              ) || 0
            ) * 4,
        },

        {
          label:
            "Carbohydrates",

          grams:
            Number(
              plan.carbs_grams
            ) || 0,

          calories:
            (
              Number(
                plan.carbs_grams
              ) || 0
            ) * 4,
        },

        {
          label:
            "Fats",

          grams:
            Number(
              plan.fats_grams
            ) || 0,

          calories:
            (
              Number(
                plan.fats_grams
              ) || 0
            ) * 9,
        },
      ];

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

          <p className="text-[#ccff00] mt-6 tracking-[0.26em] text-[10px]">
            INITIALIZING NUTRITION ENGINE
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
              onClick={() =>
                navigate(
                  "/motioncheck"
                )
              }
            />

            <NavButton
              text="Nutrition"
              active
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
                  NUTRITION ENGINE ACTIVE
                </span>

              </div>


              <h1 className="text-5xl md:text-7xl xl:text-8xl font-black tracking-[-0.055em] leading-[0.92] mt-6">

                FUEL

                <br />

                <span className="text-[#ccff00]">
                  THE SYSTEM.
                </span>

              </h1>


              <p className="text-[#92998c] text-lg max-w-3xl mt-6 leading-relaxed">
                Your nutrition protocol adapts calories,
                macros and meals around your athlete profile
                and fitness goal.
              </p>

            </div>


            {plan && (

              <div className="grid grid-cols-2 gap-3">

                <HeaderMetric
                  label="DIET MODE"
                  value={
                    formatText(
                      plan.dietary_preference
                    )
                  }
                />

                <HeaderMetric
                  label="GOAL"
                  value={
                    formatText(
                      plan.fitness_goal
                    )
                  }
                />

              </div>

            )}

          </div>

        </motion.header>


        {/* ERROR */}

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-5">
            {error}
          </div>
        )}


        {/* ==================================================
            NO PLAN
        ================================================== */}

        {!plan ? (

          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="relative overflow-hidden rounded-[32px] border border-[#ccff00]/20 bg-black/40 backdrop-blur-xl p-8 md:p-12"
          >

            <div className="absolute right-[-140px] top-[-140px] w-[420px] h-[420px] rounded-full bg-[#ccff00]/10 blur-[140px]" />


            <div className="relative z-10 max-w-3xl">

              <p className="text-[#ccff00] text-[10px] tracking-[0.26em]">
                NUTRITION PROTOCOL REQUIRED
              </p>


              <h2 className="text-4xl md:text-6xl font-black tracking-[-0.04em] mt-5">
                BUILD YOUR
                <br />
                FUEL SYSTEM.
              </h2>


              <p className="text-[#8d9488] mt-5 text-lg leading-relaxed max-w-2xl">
                X-Fit will calculate your daily calories,
                protein, carbohydrates and fats, then generate
                meals based on your dietary preference.
              </p>


              <div className="grid sm:grid-cols-3 gap-4 mt-8">

                <FeatureMini
                  number="01"
                  title="Calories"
                  text="Goal-aware daily energy target."
                />

                <FeatureMini
                  number="02"
                  title="Macros"
                  text="Protein, carbohydrates and fats."
                />

                <FeatureMini
                  number="03"
                  title="Meals"
                  text="Diet-preference-aware meal structure."
                />

              </div>


              <motion.button
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={
                  generateDietPlan
                }
                disabled={
                  generating
                }
                className="mt-9 bg-[#ccff00] text-black font-black px-9 py-4 rounded-xl hover:bg-[#b8e600] transition disabled:opacity-50"
              >

                {generating ? (

                  <span className="flex items-center gap-3">

                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />

                    GENERATING NUTRITION

                  </span>

                ) : (
                  "GENERATE NUTRITION PROTOCOL →"
                )}

              </motion.button>

            </div>

          </motion.section>

        ) : (

          <>

            {/* ==================================================
                NUTRITION HERO
            ================================================== */}

            <section className="grid xl:grid-cols-12 gap-5 mb-7">


              {/* CALORIE CORE */}

              <div className="xl:col-span-5 relative overflow-hidden rounded-[30px] border border-[#ccff00]/20 bg-black/40 backdrop-blur-xl p-8">

                <div className="absolute left-1/2 top-1/2 w-[420px] h-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ccff00]/7 blur-[130px]" />


                <div className="relative z-10">

                  <p className="text-[#62695f] text-[9px] tracking-[0.24em]">
                    DAILY ENERGY CORE
                  </p>


                  <div className="relative w-[270px] h-[270px] mx-auto mt-8">

                    <div className="absolute inset-0 rounded-full border-[12px] border-white/5" />

                    <motion.div
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 28,
                        repeat:
                          Infinity,
                        ease:
                          "linear",
                      }}
                      className="absolute inset-[-9px] rounded-full border border-dashed border-[#ccff00]/25"
                    />

                    <motion.div
                      animate={{
                        rotate: -360,
                      }}
                      transition={{
                        duration: 40,
                        repeat:
                          Infinity,
                        ease:
                          "linear",
                      }}
                      className="absolute inset-[26px] rounded-full border border-[#ccff00]/15"
                    />


                    <div className="absolute inset-0 flex flex-col items-center justify-center">

                      <p className="text-6xl md:text-7xl font-black text-[#ccff00]">
                        {plan.daily_calories}
                      </p>

                      <p className="text-[#62695f] text-[9px] tracking-[0.2em] mt-2">
                        KCAL / DAY
                      </p>

                    </div>

                  </div>


                  <p className="text-center text-[#858c80] text-sm leading-relaxed max-w-sm mx-auto mt-7">
                    Daily energy target synchronized with your
                    current athlete profile and fitness objective.
                  </p>

                </div>

              </div>


              {/* PROTOCOL DATA */}

              <div className="xl:col-span-7 grid gap-5">

                <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/35 backdrop-blur-xl p-7">

                  <div className="absolute right-[-120px] top-[-120px] w-[300px] h-[300px] rounded-full bg-[#ccff00]/7 blur-[110px]" />


                  <div className="relative z-10">

                    <p className="text-[#ccff00] text-[9px] tracking-[0.24em]">
                      ACTIVE NUTRITION PROTOCOL
                    </p>

                    <h2 className="text-3xl md:text-4xl font-black mt-3">
                      {formatText(
                        plan.fitness_goal
                      )}{" "}
                      PLAN
                    </h2>

                    <p className="text-[#858c80] mt-3">
                      Dietary Mode:{" "}

                      <span className="text-white font-bold">
                        {formatText(
                          plan.dietary_preference
                        )}
                      </span>
                    </p>


                    <div className="grid grid-cols-3 gap-3 mt-7">

                      <MacroCard
                        label="PROTEIN"
                        value={
                          plan.protein_grams
                        }
                        unit="G"
                      />

                      <MacroCard
                        label="CARBS"
                        value={
                          plan.carbs_grams
                        }
                        unit="G"
                      />

                      <MacroCard
                        label="FATS"
                        value={
                          plan.fats_grams
                        }
                        unit="G"
                      />

                    </div>

                  </div>

                </div>


                <div className="grid sm:grid-cols-2 gap-5">

                  <ProtocolCard
                    label="NUTRITION MODE"
                    value={
                      formatText(
                        plan.dietary_preference
                      )
                    }
                    sub="PREFERENCE SYNC"
                  />

                  <ProtocolCard
                    label="MEAL COUNT"
                    value={
                      plan.meals?.length ||
                      0
                    }
                    sub="DAILY STRUCTURE"
                    highlight
                  />

                </div>

              </div>

            </section>


            {/* ==================================================
                MACRO SYSTEM
            ================================================== */}

            <section className="rounded-[28px] border border-white/10 bg-black/35 backdrop-blur-xl p-7 md:p-8 mb-7">

              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

                <div>

                  <p className="text-[#ccff00] text-[9px] tracking-[0.24em]">
                    MACRO SYSTEM
                  </p>

                  <h2 className="text-3xl font-black mt-2">
                    Daily Macro Distribution
                  </h2>

                </div>


                <button
                  onClick={
                    generateDietPlan
                  }
                  disabled={
                    generating
                  }
                  className="border border-[#ccff00]/40 text-[#ccff00] font-bold px-6 py-3 rounded-xl hover:bg-[#ccff00]/10 transition disabled:opacity-50"
                >

                  {generating
                    ? "RECALCULATING..."
                    : "REGENERATE PLAN"}

                </button>

              </div>


              <div className="grid xl:grid-cols-3 gap-5 mt-8">

                {macroData.map(
                  (macro) => (

                    <MacroDistributionCard
                      key={
                        macro.label
                      }
                      label={
                        macro.label
                      }
                      grams={
                        macro.grams
                      }
                      calories={
                        macro.calories
                      }
                      totalCalories={
                        Number(
                          plan.daily_calories
                        ) || 0
                      }
                    />

                  )
                )}

              </div>

            </section>


            {/* ==================================================
                MEAL ARCHITECTURE
            ================================================== */}

            <section>

              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">

                <div>

                  <p className="text-[#ccff00] text-[9px] tracking-[0.24em]">
                    DAILY PROTOCOL
                  </p>

                  <h2 className="text-3xl md:text-4xl font-black mt-2">
                    Meal Architecture
                  </h2>

                </div>


                <span className="text-[#858c80] text-sm">
                  {plan.meals?.length ||
                    0}{" "}
                  Meals
                </span>

              </div>


              <div className="space-y-4">

                {[...(plan.meals || [])]
                  .sort(
                    (a, b) =>
                      a.order -
                      b.order
                  )
                  .map(
                    (
                      meal,
                      index
                    ) => (

                      <MealCard
                        key={
                          meal.id
                        }
                        meal={
                          meal
                        }
                        index={
                          index
                        }
                      />

                    )
                  )}

              </div>

            </section>


            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="grid md:grid-cols-3 gap-4 mt-10">

              <button
                onClick={() =>
                  navigate(
                    "/dashboard"
                  )
                }
                className="border border-white/10 bg-black/30 py-4 rounded-xl font-bold hover:border-[#ccff00]/40 transition"
              >
                DASHBOARD
              </button>

              <button
                onClick={() =>
                  navigate(
                    "/workout-plan"
                  )
                }
                className="border border-[#ccff00]/40 text-[#ccff00] py-4 rounded-xl font-bold hover:bg-[#ccff00]/10 transition"
              >
                WORKOUT PLAN
              </button>

              <button
                onClick={() =>
                  navigate(
                    "/progress-dna"
                  )
                }
                className="bg-[#ccff00] text-black py-4 rounded-xl font-black hover:bg-[#b8e600] transition"
              >
                PROGRESS DNA
              </button>

            </div>

          </>

        )}

      </main>

      {plan && <NutritionChat plan={plan} />}

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

      <p className="text-[#ccff00] font-black mt-2 text-sm capitalize">
        {value}
      </p>

    </div>
  );
}


/* ==================================================
   FEATURE MINI
================================================== */

function FeatureMini({
  number,
  title,
  text,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-5">

      <p className="text-[#ccff00] text-[9px] tracking-[0.18em]">
        {number}
      </p>

      <p className="font-black text-xl mt-4">
        {title}
      </p>

      <p className="text-[#7e857a] text-sm mt-2 leading-relaxed">
        {text}
      </p>

    </div>
  );
}


/* ==================================================
   MACRO CARD
================================================== */

function MacroCard({
  label,
  value,
  unit,
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/30 p-5">

      <p className="text-[#5f665c] text-[8px] tracking-[0.18em]">
        {label}
      </p>

      <div className="flex items-end gap-1 mt-3">

        <p className="text-3xl font-black text-white">
          {value}
        </p>

        <span className="text-[#656c62] text-xs mb-1">
          {unit}
        </span>

      </div>

    </div>
  );
}


/* ==================================================
   PROTOCOL CARD
================================================== */

function ProtocolCard({
  label,
  value,
  sub,
  highlight = false,
}) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      className="rounded-[24px] border border-white/10 bg-black/35 backdrop-blur-xl p-6"
    >

      <p className="text-[#5f665c] text-[9px] tracking-[0.18em]">
        {label}
      </p>

      <p
        className={`text-2xl font-black mt-4 capitalize ${
          highlight
            ? "text-[#ccff00]"
            : "text-white"
        }`}
      >
        {value}
      </p>

      <p className="text-[#50564e] text-[8px] tracking-[0.16em] mt-2">
        {sub}
      </p>

    </motion.div>
  );
}


/* ==================================================
   MACRO DISTRIBUTION
================================================== */

function MacroDistributionCard({
  label,
  grams,
  calories,
  totalCalories,
}) {

  const percentage =
    totalCalories > 0
      ? Math.min(
          100,
          Math.round(
            (
              calories /
              totalCalories
            ) * 100
          )
        )
      : 0;


  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-black/30 p-6">

      <div className="absolute right-[-70px] top-[-70px] w-[180px] h-[180px] rounded-full bg-[#ccff00]/5 blur-[70px]" />


      <div className="relative z-10">

        <div className="flex items-start justify-between gap-4">

          <div>

            <p className="text-[#5f665c] text-[9px] tracking-[0.18em] uppercase">
              {label}
            </p>

            <div className="flex items-end gap-2 mt-3">

              <p className="text-4xl font-black">
                {grams}
              </p>

              <span className="text-[#656c62] mb-1">
                g
              </span>

            </div>

          </div>


          <p className="text-[#ccff00] text-2xl font-black">
            {percentage}%
          </p>

        </div>


        <p className="text-[#737a70] text-sm mt-3">
          {calories} kcal contribution
        </p>


        <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-6">

          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width:
                `${percentage}%`,
            }}
            transition={{
              duration: 0.6,
            }}
            className="h-full bg-[#ccff00] rounded-full shadow-[0_0_12px_rgba(204,255,0,0.5)]"
          />

        </div>

      </div>

    </div>
  );
}


/* ==================================================
   MEAL CARD
================================================== */

function MealCard({
  meal,
  index,
}) {
  return (
    <motion.article
      whileHover={{
        y: -3,
      }}
      className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-black/35 backdrop-blur-xl p-6 hover:border-[#ccff00]/30 transition"
    >

      <div className="absolute right-[-120px] top-[-120px] w-[280px] h-[280px] bg-[#ccff00]/5 blur-[100px] rounded-full" />


      <div className="relative z-10 grid xl:grid-cols-[80px_1fr_310px] gap-6 xl:items-center">


        {/* NUMBER */}

        <div className="w-14 h-14 rounded-xl border border-[#ccff00]/20 bg-[#ccff00]/5 flex items-center justify-center text-[#ccff00] font-black text-xl">
          {String(
            index + 1
          ).padStart(
            2,
            "0"
          )}
        </div>


        {/* INFO */}

        <div>

          <p className="text-[#ccff00] text-[9px] tracking-[0.2em]">
            {formatText(
              meal.meal_type
            )}
          </p>

          <h3 className="text-2xl md:text-3xl font-black mt-2 group-hover:text-[#ccff00] transition">
            {meal.title}
          </h3>


          <div className="flex flex-wrap gap-2 mt-4">

            {(meal.foods || []).map(
              (
                food,
                foodIndex
              ) => (

                <span
                  key={`${food}-${foodIndex}`}
                  className="border border-white/5 bg-black/30 px-3 py-2 rounded-lg text-sm text-[#b9beb5]"
                >
                  {food}
                </span>

              )
            )}

          </div>

        </div>


        {/* METRICS */}

        <div className="grid grid-cols-2 gap-3">

          <MealMetric
            label="KCAL"
            value={
              meal.calories
            }
            highlight
          />

          <MealMetric
            label="PROTEIN"
            value={`${meal.protein}g`}
          />

          <MealMetric
            label="CARBS"
            value={`${meal.carbs}g`}
          />

          <MealMetric
            label="FATS"
            value={`${meal.fats}g`}
          />

        </div>

      </div>

    </motion.article>
  );
}


/* ==================================================
   MEAL METRIC
================================================== */

function MealMetric({
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/30 p-3">

      <p className="text-[#5f665c] text-[8px] tracking-[0.16em]">
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


export default DietPlan;