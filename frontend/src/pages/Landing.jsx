import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import CinematicBackground from "../components/futuristic/CinematicBackground";
import AthleteHologram from "../components/3d/AthleteHologram";


function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-white overflow-x-hidden relative">

      <CinematicBackground />


      {/* ==================================================
          NAVBAR
      ================================================== */}

      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-black/20 backdrop-blur-2xl">

        <div className="max-w-[1500px] mx-auto px-6 md:px-10 h-20 flex items-center justify-between">

          <button
            onClick={() =>
              navigate("/")
            }
            className="text-[#ccff00] text-4xl font-black tracking-[-0.06em]"
          >
            X-FIT
          </button>


          <div className="hidden lg:flex items-center gap-8 text-sm">

            <a
              href="#technology"
              className="text-[#a6ab9e] hover:text-white transition"
            >
              Technology
            </a>

            <a
              href="#motion"
              className="text-[#a6ab9e] hover:text-white transition"
            >
              Motion AI
            </a>

            <a
              href="#nutrition"
              className="text-[#a6ab9e] hover:text-white transition"
            >
              Nutrition
            </a>

            <a
              href="#dna"
              className="text-[#a6ab9e] hover:text-white transition"
            >
              Progress DNA
            </a>

            <button
              onClick={() => navigate("/membership")}
              className="text-[#a6ab9e] hover:text-white transition"
            >
              Membership
            </button>

            <button
              onClick={() => navigate("/shop")}
              className="text-[#a6ab9e] hover:text-[#ccff00] transition font-semibold"
            >
              Shop
            </button>

          </div>


          <div className="flex items-center gap-3">

            <button
              onClick={() =>
                navigate("/login")
              }
              className="px-5 py-2.5 rounded-full border border-white/15 text-white hover:border-[#ccff00]/60 hover:text-[#ccff00] transition"
            >
              Login
            </button>

            <button
              onClick={() =>
                navigate("/register")
              }
              className="hidden sm:block px-5 py-2.5 rounded-full bg-[#ccff00] text-black font-black hover:scale-[1.03] transition"
            >
              Create Account
            </button>

          </div>

        </div>

      </nav>


      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative min-h-screen flex items-center pt-24">

        <div className="max-w-[1500px] mx-auto px-6 md:px-10 w-full">

          <div className="grid xl:grid-cols-12 gap-8 items-center">


            {/* ==================================================
                LEFT HERO CONTENT
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.9,
              }}
              className="xl:col-span-6 relative z-10"
            >

              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-[#ccff00]/20">

                <span className="w-2 h-2 rounded-full bg-[#ccff00] shadow-[0_0_12px_#ccff00]" />

                <span className="text-[#ccff00] text-[10px] md:text-xs tracking-[0.25em] uppercase">
                  AI Performance Operating System
                </span>

              </div>


              <h1 className="mt-7 text-[58px] sm:text-[72px] md:text-[92px] xl:text-[108px] leading-[0.86] font-black tracking-[-0.065em]">

                TRAIN

                <br />

                <span className="text-[#ccff00]">
                  SMARTER.
                </span>

                <br />

                MOVE BETTER.

              </h1>


              <p className="mt-8 text-[#a6ab9e] text-lg md:text-xl leading-relaxed max-w-xl">

                X-Fit turns training into measurable intelligence.
                Workouts, form analysis, nutrition, safety and
                progress tracking work together as one athlete system.

              </p>


              <div className="flex flex-col sm:flex-row gap-4 mt-9">

                <button
                  onClick={() =>
                    navigate(
                      "/register"
                    )
                  }
                  className="group bg-[#ccff00] text-black px-8 py-4 rounded-full font-black text-base md:text-lg hover:scale-[1.03] transition"
                >
                  START YOUR PROTOCOL

                  <span className="ml-3 group-hover:ml-5 transition-all">
                    →
                  </span>
                </button>


                <a
                  href="#technology"
                  className="px-8 py-4 rounded-full border border-white/15 text-white font-bold text-center hover:border-[#ccff00]/50 hover:text-[#ccff00] transition"
                >
                  EXPLORE X-FIT
                </a>

              </div>


              {/* HERO METRICS */}

              <div className="grid grid-cols-3 gap-4 mt-12 max-w-xl">

                <HeroMetric
                  value="AI"
                  label="Movement"
                />

                <HeroMetric
                  value="4W"
                  label="Training"
                />

                <HeroMetric
                  value="DNA"
                  label="Progress"
                />

              </div>

            </motion.div>


            {/* ==================================================
                RIGHT HERO VISUAL
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.93,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 1.1,
                delay: 0.1,
              }}
              className="xl:col-span-6 relative min-h-[620px]"
            >

              {/* OUTER GLOW */}

              <div className="absolute left-1/2 top-1/2 w-[520px] h-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ccff00]/10 blur-[120px]" />


              {/* ORBIT RING 1 */}

              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 28,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute left-1/2 top-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ccff00]/20"
              >

                <div className="absolute top-[-5px] left-1/2 w-[10px] h-[10px] rounded-full bg-[#ccff00] shadow-[0_0_15px_#ccff00]" />

                <div className="absolute bottom-[-4px] right-[25%] w-[8px] h-[8px] rounded-full bg-[#00d1ff] shadow-[0_0_12px_#00d1ff]" />

              </motion.div>


              {/* ORBIT RING 2 */}

              <motion.div
                animate={{
                  rotate: -360,
                }}
                transition={{
                  duration: 38,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute left-1/2 top-1/2 w-[390px] h-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ccff00]/10"
              />


              {/* VERTICAL SCAN */}

              <motion.div
                animate={{
                  y: [-190, 190, -190],
                  opacity: [0.1, 0.7, 0.1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute left-[15%] right-[15%] top-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#ccff00] to-transparent shadow-[0_0_15px_#ccff00] z-20"
              />


              {/* HUD TOP LEFT */}

              <motion.div
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
                className="absolute left-2 md:left-8 top-[12%] z-20"
              >

                <HudCard
                  label="BODY OS"
                  value="SYNCED"
                />

              </motion.div>


              {/* HUD TOP RIGHT */}

              <motion.div
                animate={{
                  y: [0, 7, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                }}
                className="absolute right-2 md:right-8 top-[18%] z-20"
              >

                <HudCard
                  label="MOTION AI"
                  value="READY"
                />

              </motion.div>


              {/* HUD BOTTOM LEFT */}

              <motion.div
                animate={{
                  y: [0, 5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
                className="absolute left-4 md:left-12 bottom-[16%] z-20"
              >

                <HudCard
                  label="PROGRESS DNA"
                  value="84"
                />

              </motion.div>


              {/* HUD BOTTOM RIGHT */}

              <motion.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                }}
                className="absolute right-4 md:right-12 bottom-[18%] z-20"
              >

                <HudCard
                  label="STATUS"
                  value="ONLINE"
                />

              </motion.div>


              {/* HOLOGRAM */}

              <div className="absolute inset-0 flex items-center justify-center z-10">

                <div className="w-full max-w-[560px]">

                  <AthleteHologram />

                </div>

              </div>


              {/* FLOOR GLOW */}

              <div className="absolute left-1/2 bottom-[8%] -translate-x-1/2 w-[340px] h-[70px] rounded-[50%] bg-[#ccff00]/10 blur-[35px]" />


              {/* HERO STATUS BAR */}

              <div className="absolute left-1/2 bottom-[2%] -translate-x-1/2 z-30">

                <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-black/40 backdrop-blur-xl border border-[#ccff00]/15">

                  <span className="w-2 h-2 rounded-full bg-[#ccff00] shadow-[0_0_10px_#ccff00]" />

                  <p className="text-[#ccff00] text-[10px] tracking-[0.22em] whitespace-nowrap">
                    X-FIT ATHLETE SYSTEM ONLINE
                  </p>

                </div>

              </div>

            </motion.div>

          </div>

        </div>


        {/* SCROLL */}

        <motion.a
          href="#technology"
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
        >

          <p className="text-[9px] tracking-[0.3em] text-[#6d7367]">
            ENTER THE LAB
          </p>

          <p className="text-[#ccff00] mt-2">
            ↓
          </p>

        </motion.a>

      </section>


      {/* ==================================================
          TECHNOLOGY
      ================================================== */}

      <section
        id="technology"
        className="relative py-28 md:py-36"
      >

        <SectionContainer>

          <SectionHeader
            eyebrow="01 / ATHLETE INTELLIGENCE"
            title="YOUR TRAINING."
            accent="ENGINEERED."
            description="Every major X-Fit system works together instead of living as separate fitness tools."
          />


          <div className="grid lg:grid-cols-3 gap-5 mt-14">

            <FeatureCard
              number="01"
              title="Adaptive Training"
              description="A four-week workout protocol generated from your profile, experience, goals and weekly availability."
            />

            <FeatureCard
              number="02"
              title="Motion Intelligence"
              description="Analyze exercise videos, count repetitions and receive technique-focused feedback."
              highlight
            />

            <FeatureCard
              number="03"
              title="Nutrition Engine"
              description="Goal-aware calorie, macro and meal protocols synchronized with your athlete profile."
            />

          </div>

        </SectionContainer>

      </section>


      {/* ==================================================
          MOTIONCHECK
      ================================================== */}

      <section
        id="motion"
        className="relative py-28 md:py-36"
      >

        <SectionContainer>

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div>

              <SectionHeader
                eyebrow="02 / MOTIONCHECK AI"
                title="SEE HOW"
                accent="YOU MOVE."
                description="X-Fit transforms workout video into measurable movement intelligence."
              />


              <div className="space-y-4 mt-10">

                <SystemRow
                  number="01"
                  title="Record"
                  text="Capture the complete exercise movement."
                />

                <SystemRow
                  number="02"
                  title="Analyze"
                  text="X-Fit processes movement, repetitions and technique."
                />

                <SystemRow
                  number="03"
                  title="Improve"
                  text="Use form score and feedback to improve your next session."
                />

              </div>

            </div>


            <motion.div
              whileHover={{
                scale: 1.01,
              }}
              className="relative min-h-[500px] rounded-[32px] bg-white/[0.025] border border-white/10 overflow-hidden"
            >

              <div className="absolute inset-0 bg-gradient-to-br from-[#ccff00]/10 via-transparent to-[#00d1ff]/5" />


              <div className="absolute top-8 left-8">

                <p className="text-[#ccff00] text-[10px] tracking-[0.25em]">
                  MOTIONCHECK LIVE
                </p>

                <p className="text-white text-xl font-bold mt-2">
                  Movement Scan
                </p>

              </div>


              <div className="absolute inset-0 flex items-center justify-center">

                <div className="relative w-[230px] h-[350px]">

                  <div className="absolute left-1/2 -translate-x-1/2 top-0 w-16 h-16 rounded-full border border-[#ccff00]/60 shadow-[0_0_30px_rgba(204,255,0,0.15)]" />

                  <div className="absolute left-1/2 -translate-x-1/2 top-[82px] w-[130px] h-[150px] rounded-[45%] border border-[#ccff00]/50" />

                  <div className="absolute left-[32px] top-[95px] w-[30px] h-[160px] rounded-full border border-[#ccff00]/40 rotate-6" />

                  <div className="absolute right-[32px] top-[95px] w-[30px] h-[160px] rounded-full border border-[#ccff00]/40 -rotate-6" />

                  <div className="absolute left-[66px] bottom-0 w-[34px] h-[130px] rounded-full border border-[#ccff00]/40" />

                  <div className="absolute right-[66px] bottom-0 w-[34px] h-[130px] rounded-full border border-[#ccff00]/40" />

                </div>

              </div>


              <motion.div
                animate={{
                  y: [-120, 280, -120],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute left-[10%] right-[10%] top-1/2 h-[1px] bg-[#ccff00] shadow-[0_0_18px_#ccff00]"
              />


              <div className="absolute bottom-7 left-7 right-7 grid grid-cols-3 gap-3">

                <MiniMetric
                  label="FORM"
                  value="92"
                />

                <MiniMetric
                  label="REPS"
                  value="12"
                />

                <MiniMetric
                  label="STATUS"
                  value="GOOD"
                />

              </div>

            </motion.div>

          </div>

        </SectionContainer>

      </section>


      {/* ==================================================
          NUTRITION
      ================================================== */}

      <section
        id="nutrition"
        className="relative py-28 md:py-36"
      >

        <SectionContainer>

          <SectionHeader
            eyebrow="03 / NUTRITION ENGINE"
            title="FUEL THE"
            accent="SYSTEM."
            description="Training adapts the body. Nutrition fuels the adaptation."
          />


          <div className="grid lg:grid-cols-12 gap-5 mt-14">

            <div className="lg:col-span-7 bg-white/[0.025] border border-white/10 rounded-[30px] p-8 md:p-10">

              <p className="text-[#6f7669] text-[10px] tracking-[0.25em]">
                DAILY ENERGY TARGET
              </p>


              <div className="flex items-end gap-3 mt-5">

                <p className="text-7xl md:text-8xl font-black text-[#ccff00]">
                  2400
                </p>

                <p className="text-[#7f8579] text-lg mb-3">
                  KCAL
                </p>

              </div>


              <div className="grid grid-cols-3 gap-4 mt-10">

                <MacroPreview
                  label="PROTEIN"
                  value="160G"
                />

                <MacroPreview
                  label="CARBS"
                  value="285G"
                />

                <MacroPreview
                  label="FATS"
                  value="70G"
                />

              </div>

            </div>


            <div className="lg:col-span-5 grid gap-5">

              <FeatureCard
                number="A"
                title="Goal-Aware"
                description="Fat loss, muscle gain, strength or general fitness."
              />

              <FeatureCard
                number="B"
                title="Diet-Aware"
                description="Vegetarian, non-vegetarian and vegan protocols."
                highlight
              />

            </div>

          </div>

        </SectionContainer>

      </section>


      {/* ==================================================
          PROGRESS DNA
      ================================================== */}

      <section
        id="dna"
        className="relative py-28 md:py-36"
      >

        <SectionContainer>

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div className="relative flex justify-center">

              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-[330px] h-[330px] md:w-[430px] md:h-[430px] rounded-full border border-[#ccff00]/25 relative"
              >

                <div className="absolute inset-[40px] rounded-full border border-[#ccff00]/15" />

                <div className="absolute inset-[90px] rounded-full border border-[#ccff00]/10" />

              </motion.div>


              <div className="absolute inset-0 flex items-center justify-center text-center">

                <div>

                  <p className="text-[#6d7367] text-xs tracking-[0.25em]">
                    PROGRESS DNA
                  </p>

                  <p className="text-8xl font-black text-[#ccff00] mt-2">
                    84
                  </p>

                  <p className="text-[#8a9082]">
                    /100
                  </p>

                </div>

              </div>

            </div>


            <SectionHeader
              eyebrow="04 / PROGRESS DNA"
              title="BECOME"
              accent="MEASURABLE."
              description="Technique, consistency and performance progress combine into one evolving athlete intelligence score."
            />

          </div>

        </SectionContainer>

      </section>


      {/* ==================================================
          FINAL CTA
      ================================================== */}

      <section className="relative py-32 md:py-40">

        <SectionContainer>

          <div className="relative overflow-hidden border border-[#ccff00]/20 rounded-[36px] bg-white/[0.025] p-10 md:p-16 text-center">

            <div className="absolute left-1/2 top-[-200px] -translate-x-1/2 w-[600px] h-[500px] bg-[#ccff00]/10 blur-[150px] rounded-full" />


            <div className="relative z-10">

              <p className="text-[#ccff00] text-xs tracking-[0.3em]">
                YOUR NEXT VERSION STARTS HERE
              </p>


              <h2 className="text-5xl md:text-8xl font-black tracking-[-0.05em] mt-6">

                ENTER

                <br />

                <span className="text-[#ccff00]">
                  X-FIT.
                </span>

              </h2>


              <p className="text-[#9ca292] max-w-xl mx-auto mt-6 text-lg">
                Create your athlete profile and let X-Fit
                engineer your training system.
              </p>


              <button
                onClick={() =>
                  navigate(
                    "/register"
                  )
                }
                className="mt-9 bg-[#ccff00] text-black font-black px-10 py-5 rounded-full hover:scale-[1.04] transition"
              >
                CREATE YOUR ACCOUNT →
              </button>

            </div>

          </div>

        </SectionContainer>

      </section>


      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="border-t border-white/5 py-10">

        <SectionContainer>

          <div className="flex flex-col md:flex-row justify-between gap-5">

            <p className="text-[#ccff00] font-black text-2xl">
              X-FIT
            </p>

            <p className="text-[#62685e] text-sm">
              AI Performance Operating System
            </p>

          </div>

        </SectionContainer>

      </footer>

    </div>
  );
}


/* ==================================================
   SECTION CONTAINER
================================================== */

function SectionContainer({
  children,
}) {
  return (
    <div className="max-w-[1500px] mx-auto px-6 md:px-10">
      {children}
    </div>
  );
}


/* ==================================================
   SECTION HEADER
================================================== */

function SectionHeader({
  eyebrow,
  title,
  accent,
  description,
}) {
  return (
    <div>

      <p className="text-[#ccff00] text-xs tracking-[0.27em]">
        {eyebrow}
      </p>

      <h2 className="text-5xl md:text-7xl xl:text-8xl leading-[0.95] font-black tracking-[-0.05em] mt-5">

        {title}

        <br />

        <span className="text-[#ccff00]">
          {accent}
        </span>

      </h2>

      <p className="text-[#969c8e] text-lg leading-relaxed max-w-2xl mt-6">
        {description}
      </p>

    </div>
  );
}


/* ==================================================
   HERO METRIC
================================================== */

function HeroMetric({
  value,
  label,
}) {
  return (
    <div className="border-t border-white/10 pt-4">

      <p className="text-[#ccff00] text-2xl font-black">
        {value}
      </p>

      <p className="text-[#696f65] text-xs mt-1 tracking-wider">
        {label}
      </p>

    </div>
  );
}


/* ==================================================
   HUD CARD
================================================== */

function HudCard({
  label,
  value,
}) {
  return (
    <div className="min-w-[130px] px-4 py-3 rounded-xl bg-black/35 backdrop-blur-xl border border-white/10">

      <p className="text-[#62685e] text-[8px] tracking-[0.2em]">
        {label}
      </p>

      <p className="text-[#ccff00] text-xs font-black mt-2">
        {value}
      </p>

    </div>
  );
}


/* ==================================================
   FEATURE CARD
================================================== */

function FeatureCard({
  number,
  title,
  description,
  highlight = false,
}) {
  return (
    <motion.div
      whileHover={{
        y: -6,
      }}
      className={`rounded-[26px] p-7 md:p-8 border transition ${
        highlight
          ? "bg-[#ccff00]/8 border-[#ccff00]/30"
          : "bg-white/[0.025] border-white/10"
      }`}
    >

      <p className="text-[#ccff00] text-xs tracking-[0.2em]">
        {number}
      </p>

      <h3 className="text-2xl font-black mt-8">
        {title}
      </h3>

      <p className="text-[#8e9487] leading-relaxed mt-4">
        {description}
      </p>

    </motion.div>
  );
}


/* ==================================================
   SYSTEM ROW
================================================== */

function SystemRow({
  number,
  title,
  text,
}) {
  return (
    <div className="grid grid-cols-[55px_1fr] gap-4 border-t border-white/10 pt-5">

      <p className="text-[#ccff00] text-xs">
        {number}
      </p>

      <div>

        <p className="text-white font-bold">
          {title}
        </p>

        <p className="text-[#858b7f] mt-1">
          {text}
        </p>

      </div>

    </div>
  );
}


/* ==================================================
   MINI METRIC
================================================== */

function MiniMetric({
  label,
  value,
}) {
  return (
    <div className="bg-black/40 backdrop-blur border border-white/10 rounded-xl p-4">

      <p className="text-[#686e63] text-[9px] tracking-widest">
        {label}
      </p>

      <p className="text-[#ccff00] font-black mt-2">
        {value}
      </p>

    </div>
  );
}


/* ==================================================
   MACRO PREVIEW
================================================== */

function MacroPreview({
  label,
  value,
}) {
  return (
    <div className="border-t border-white/10 pt-4">

      <p className="text-[#686e63] text-[9px] tracking-[0.18em]">
        {label}
      </p>

      <p className="text-white text-2xl font-black mt-2">
        {value}
      </p>

    </div>
  );
}


export default Landing;