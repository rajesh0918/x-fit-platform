import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import apiFetch from "../services/api";
import CinematicBackground from "../components/futuristic/CinematicBackground";


function SafeMode() {
  const navigate =
    useNavigate();

  const [
    progress,
    setProgress,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    activeModule,
    setActiveModule,
  ] = useState(null);

  const [
    selectedAnswers,
    setSelectedAnswers,
  ] = useState({});


  // ==================================================
  // SAFE MODE MODULES
  // ==================================================

  const modules = useMemo(
    () => [
      {
        id: "warmup",
        number: "01",
        title:
          "Warm-Up Protocol",
        subtitle:
          "Prepare before loading",

        description:
          "Understand why a proper warm-up matters before strength training.",

        lesson: [
          "Increase body temperature before heavy training.",
          "Use light movement before loading a joint.",
          "Perform exercise-specific warm-up sets.",
          "Do not begin maximal lifts immediately after entering the gym.",
        ],

        question:
          "What is the best approach before a heavy working set?",

        options: [
          "Immediately use your maximum weight",
          "Perform progressive warm-up sets",
          "Skip warm-up to conserve energy",
          "Only stretch after training",
        ],

        correctAnswer:
          "Perform progressive warm-up sets",

        icon: "◢",
      },

      {
        id: "technique",
        number: "02",
        title:
          "Technique First",
        subtitle:
          "Quality before load",

        description:
          "Learn why movement quality should come before increasing weight.",

        lesson: [
          "Use a load you can control throughout the movement.",
          "Maintain stable technique instead of chasing numbers.",
          "Poor form can reduce training quality.",
          "Increase resistance gradually when technique remains consistent.",
        ],

        question:
          "When should you increase the training load?",

        options: [
          "Every workout regardless of form",
          "When technique remains controlled",
          "Only when someone else lifts more",
          "Whenever the weight feels intimidating",
        ],

        correctAnswer:
          "When technique remains controlled",

        icon: "◇",
      },

      {
        id: "spotting",
        number: "03",
        title:
          "Spotter Safety",
        subtitle:
          "Train with protection",

        description:
          "Understand when support or safety equipment should be used.",

        lesson: [
          "Use appropriate safety equipment when available.",
          "For challenging lifts, know how to safely exit the movement.",
          "A competent spotter can help during certain heavy exercises.",
          "Do not depend on an unprepared person for safety.",
        ],

        question:
          "For a challenging lift where failure could trap you, what is safest?",

        options: [
          "Train without any safety setup",
          "Use appropriate safeties or a competent spotter",
          "Ask someone distracted to watch",
          "Always attempt the lift alone",
        ],

        correctAnswer:
          "Use appropriate safeties or a competent spotter",

        icon: "△",
      },

      {
        id: "pain",
        number: "04",
        title:
          "Pain Awareness",
        subtitle:
          "Know when to stop",

        description:
          "Learn the difference between normal effort and warning signs.",

        lesson: [
          "Training discomfort and sharp pain are not the same.",
          "Stop an exercise if you experience sudden or sharp pain.",
          "Do not force a painful movement just to complete the set.",
          "Persistent pain should be evaluated appropriately.",
        ],

        question:
          "What should you do if an exercise causes sudden sharp pain?",

        options: [
          "Continue until the set is complete",
          "Increase the weight",
          "Stop the movement",
          "Ignore it completely",
        ],

        correctAnswer:
          "Stop the movement",

        icon: "!",
      },

      {
        id: "recovery",
        number: "05",
        title:
          "Recovery Protocol",
        subtitle:
          "Adapt outside the gym",

        description:
          "Understand why recovery is part of the training process.",

        lesson: [
          "Training creates a stimulus; recovery supports adaptation.",
          "Sleep and nutrition affect training readiness.",
          "Repeated hard sessions without enough recovery can reduce performance.",
          "Rest days can be a productive part of a training program.",
        ],

        question:
          "Which statement about recovery is correct?",

        options: [
          "Rest days always reduce progress",
          "Recovery is part of the training process",
          "Sleep has no relationship to training",
          "Every workout should be maximal",
        ],

        correctAnswer:
          "Recovery is part of the training process",

        icon: "◷",
      },

      {
        id: "equipment",
        number: "06",
        title:
          "Equipment Check",
        subtitle:
          "Inspect before training",

        description:
          "Learn basic equipment awareness before starting an exercise.",

        lesson: [
          "Check that weights and attachments are secured.",
          "Inspect equipment for obvious damage.",
          "Adjust seats, pads and handles before loading heavily.",
          "Report damaged equipment instead of continuing to use it.",
        ],

        question:
          "What should you do if gym equipment appears damaged?",

        options: [
          "Use it carefully anyway",
          "Increase the load to test it",
          "Stop using it and report it",
          "Ignore the damage",
        ],

        correctAnswer:
          "Stop using it and report it",

        icon: "◫",
      },
    ],
    []
  );


  // ==================================================
  // LOAD SAFE MODE PROGRESS
  // ==================================================

  useEffect(() => {
    const fetchProgress =
      async () => {

        try {
          setLoading(true);
          setError("");

          const response =
            await apiFetch(
              "/safe-mode/progress/"
            );

          if (!response) {
            return;
          }

          const data =
            await response.json();

          if (response.ok) {
            setProgress(data);
            return;
          }

          setError(
            data.error ||
              data.detail ||
              "Could not load Safe Mode progress."
          );

        } catch (err) {
          console.error(
            "Safe Mode load error:",
            err
          );

          setError(
            "Could not load Safe Mode."
          );

        } finally {
          setLoading(false);
        }
      };

    fetchProgress();

  }, []);


  // ==================================================
  // COMPLETE MODULE
  // ==================================================

  const completeModule =
    async (module) => {

      const answer =
        selectedAnswers[
          module.id
        ];

      if (!answer) {
        setError(
          "Select an answer before completing this module."
        );

        return;
      }


      const isCorrect =
        answer ===
        module.correctAnswer;


      const alreadyCompleted =
        progress?.completed_modules?.includes(
          module.id
        );


      if (alreadyCompleted) {
        setMessage(
          "You already completed this module."
        );

        return;
      }


      try {
        setSaving(true);
        setError("");
        setMessage("");


        const newCompletedModules = [
          ...(
            progress?.completed_modules ||
            []
          ),
          module.id,
        ];


        const newTotalQuestions =
          (
            progress?.total_questions ||
            0
          ) + 1;


        const newTotalCorrect =
          (
            progress?.total_correct ||
            0
          ) +
          (
            isCorrect
              ? 1
              : 0
          );


        const newKnowledgeScore =
          newTotalQuestions > 0
            ? Math.round(
                (
                  newTotalCorrect /
                  newTotalQuestions
                ) * 100
              )
            : 0;


        const response =
          await apiFetch(
            "/safe-mode/progress/",
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  completed_modules:
                    newCompletedModules,

                  total_correct:
                    newTotalCorrect,

                  total_questions:
                    newTotalQuestions,

                  knowledge_score:
                    newKnowledgeScore,
                }),
            }
          );


        if (!response) {
          return;
        }


        const data =
          await response.json();


        if (response.ok) {
          setProgress(data);

          setMessage(
            isCorrect
              ? "Correct. Safety module completed."
              : "Module completed. Review the lesson before moving forward."
          );

          return;
        }


        setError(
          data.error ||
            data.detail ||
            "Could not save Safe Mode progress."
        );

      } catch (err) {
        console.error(
          "Safe Mode update error:",
          err
        );

        setError(
          "Could not save your Safe Mode progress."
        );

      } finally {
        setSaving(false);
      }
    };


  // ==================================================
  // ANSWER CHANGE
  // ==================================================

  const selectAnswer = (
    moduleId,
    answer
  ) => {

    setSelectedAnswers(
      (current) => ({
        ...current,

        [moduleId]:
          answer,
      })
    );

    setError("");
    setMessage("");
  };


  // ==================================================
  // DATA
  // ==================================================

  const completedModules =
    progress?.completed_modules ||
    [];

  const completedCount =
    completedModules.length;

  const completionPercent =
    modules.length > 0
      ? Math.min(
          100,
          Math.round(
            (
              completedCount /
              modules.length
            ) * 100
          )
        )
      : 0;

  const knowledgeScore =
    Number(
      progress?.knowledge_score
    ) || 0;

  const totalQuestions =
    Number(
      progress?.total_questions
    ) || 0;

  const totalCorrect =
    Number(
      progress?.total_correct
    ) || 0;

  const accuracy =
    totalQuestions > 0
      ? Math.round(
          (
            totalCorrect /
            totalQuestions
          ) * 100
        )
      : 0;


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#050505] text-white flex items-center justify-center overflow-hidden">

        <CinematicBackground />

        <div className="relative z-20 text-center">

          <div className="w-16 h-16 border-2 border-[#ccff00]/20 border-t-[#ccff00] rounded-full animate-spin mx-auto" />

          <p className="text-[#ccff00] mt-6 tracking-[0.28em] text-[10px]">
            INITIALIZING SAFE MODE
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
              onClick={() =>
                navigate(
                  "/diet-plan"
                )
              }
            />

            <NavButton
              text="Safe Mode"
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

                <span className="text-[#ccff00]">
                  △
                </span>

                <span className="text-[#ccff00] text-[10px] tracking-[0.24em]">
                  TRAINING SAFETY SYSTEM
                </span>

              </div>


              <h1 className="text-5xl md:text-7xl xl:text-8xl font-black tracking-[-0.055em] leading-[0.92] mt-6">

                SAFE

                <br />

                <span className="text-[#ccff00]">
                  MODE.
                </span>

              </h1>


              <p className="text-[#92998c] text-lg max-w-3xl mt-6 leading-relaxed">
                Build the knowledge required to train with
                better awareness, preparation, recovery and
                technique.
              </p>

            </div>


            <div className="grid grid-cols-2 gap-3">

              <HeaderMetric
                label="MODULES"
                value={`${completedCount}/${modules.length}`}
              />

              <HeaderMetric
                label="KNOWLEDGE"
                value={`${knowledgeScore}%`}
              />

            </div>

          </div>

        </motion.header>


        {/* ==================================================
            ERROR / MESSAGE
        ================================================== */}

        {error && (

          <motion.div
            initial={{
              opacity: 0,
              y: -8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-6 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-4"
          >
            {error}
          </motion.div>

        )}


        {message && (

          <motion.div
            initial={{
              opacity: 0,
              y: -8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-6 bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] rounded-xl p-4"
          >
            {message}
          </motion.div>

        )}


        {/* ==================================================
            SAFETY COMMAND CENTER
        ================================================== */}

        <section className="grid xl:grid-cols-12 gap-5 mb-8">


          {/* ==================================================
              CERTIFICATION CORE
          ================================================== */}

          <div className="xl:col-span-5 relative overflow-hidden rounded-[30px] border border-[#ccff00]/20 bg-black/40 backdrop-blur-xl p-8">

            <div className="absolute left-1/2 top-1/2 w-[430px] h-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ccff00]/7 blur-[140px]" />


            <div className="relative z-10">

              <p className="text-[#5f665c] text-[9px] tracking-[0.24em]">
                SAFETY CERTIFICATION
              </p>


              <div className="relative w-[270px] h-[270px] mx-auto mt-8">

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
                  className="absolute inset-[-9px] rounded-full border border-dashed border-[#ccff00]/25"
                />


                <motion.div
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 42,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-[28px] rounded-full border border-[#ccff00]/15"
                />


                <div className="absolute inset-0 flex flex-col items-center justify-center">

                  <p className="text-7xl font-black text-[#ccff00]">
                    {completionPercent}
                  </p>

                  <p className="text-[#62695f] text-[9px] tracking-[0.2em] mt-1">
                    % COMPLETE
                  </p>

                  <p className="font-black mt-4">
                    {completionPercent === 100
                      ? "CERTIFIED"
                      : "IN PROGRESS"}
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
                      `${completionPercent}%`,
                  }}
                  transition={{
                    duration: 0.7,
                  }}
                  className="h-full bg-[#ccff00] rounded-full shadow-[0_0_14px_rgba(204,255,0,0.6)]"
                />

              </div>


              <p className="text-[#7f867b] text-sm text-center mt-5">
                {completedCount} of{" "}
                {modules.length} safety
                modules completed.
              </p>

            </div>

          </div>


          {/* ==================================================
              KNOWLEDGE PANEL
          ================================================== */}

          <div className="xl:col-span-7 grid gap-5">


            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <SafeStat
                label="MODULES"
                value={`${completedCount}/${modules.length}`}
              />

              <SafeStat
                label="COMPLETION"
                value={`${completionPercent}%`}
                highlight
              />

              <SafeStat
                label="CORRECT"
                value={totalCorrect}
              />

              <SafeStat
                label="KNOWLEDGE"
                value={`${knowledgeScore}%`}
                highlight
              />

            </div>


            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/35 backdrop-blur-xl p-7">

              <div className="absolute right-[-120px] top-[-120px] w-[300px] h-[300px] rounded-full bg-[#ccff00]/5 blur-[110px]" />


              <div className="relative z-10">

                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

                  <div>

                    <p className="text-[#ccff00] text-[9px] tracking-[0.24em]">
                      KNOWLEDGE ENGINE
                    </p>

                    <h2 className="text-3xl font-black mt-2">
                      Safety Intelligence
                    </h2>

                    <p className="text-[#7f867b] mt-3 max-w-2xl">
                      Your safety score improves as you complete
                      modules and answer training-awareness
                      questions.
                    </p>

                  </div>


                  <div className="md:text-right">

                    <p className="text-5xl font-black text-[#ccff00]">
                      {accuracy}%
                    </p>

                    <p className="text-[#5f665c] text-[9px] tracking-[0.18em] mt-1">
                      QUIZ ACCURACY
                    </p>

                  </div>

                </div>


                <div className="grid md:grid-cols-3 gap-3 mt-7">

                  <KnowledgeMetric
                    label="QUESTIONS"
                    value={totalQuestions}
                  />

                  <KnowledgeMetric
                    label="CORRECT"
                    value={totalCorrect}
                  />

                  <KnowledgeMetric
                    label="KNOWLEDGE"
                    value={`${knowledgeScore}%`}
                    highlight
                  />

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            MODULE HEADER
        ================================================== */}

        <section>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">

            <div>

              <p className="text-[#ccff00] text-[9px] tracking-[0.24em]">
                SAFETY ARCHITECTURE
              </p>

              <h2 className="text-3xl md:text-4xl font-black mt-2">
                Training Modules
              </h2>

            </div>


            <p className="text-[#747b70] text-sm">
              Select a module to begin.
            </p>

          </div>


          {/* ==================================================
              MODULE GRID
          ================================================== */}

          <div className="grid xl:grid-cols-2 gap-5">

            {modules.map(
              (
                module,
                moduleIndex
              ) => {

                const completed =
                  completedModules.includes(
                    module.id
                  );

                const open =
                  activeModule ===
                  module.id;

                const selectedAnswer =
                  selectedAnswers[
                    module.id
                  ];


                return (
                  <motion.article
                    key={
                      module.id
                    }
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        moduleIndex *
                        0.04,
                    }}
                    className={`relative overflow-hidden rounded-[26px] border backdrop-blur-xl transition ${
                      completed
                        ? "bg-[#00ff95]/5 border-[#00ff95]/20"
                        : open
                        ? "bg-[#ccff00]/5 border-[#ccff00]/35"
                        : "bg-black/35 border-white/10 hover:border-[#ccff00]/25"
                    }`}
                  >

                    <div className="absolute right-[-100px] top-[-100px] w-[230px] h-[230px] rounded-full bg-[#ccff00]/5 blur-[90px]" />


                    {/* HEADER */}

                    <button
                      type="button"
                      onClick={() =>
                        setActiveModule(
                          open
                            ? null
                            : module.id
                        )
                      }
                      className="relative z-10 w-full p-6 text-left"
                    >

                      <div className="flex items-start justify-between gap-5">

                        <div className="flex gap-4">

                          <div
                            className={`w-14 h-14 rounded-xl border flex items-center justify-center font-black flex-shrink-0 ${
                              completed
                                ? "bg-[#00ff95] border-[#00ff95] text-black"
                                : open
                                ? "bg-[#ccff00] border-[#ccff00] text-black"
                                : "bg-[#ccff00]/5 border-[#ccff00]/20 text-[#ccff00]"
                            }`}
                          >
                            {completed
                              ? "✓"
                              : module.number}
                          </div>


                          <div>

                            <p className="text-[#62695f] text-[9px] tracking-[0.18em] uppercase">
                              {module.subtitle}
                            </p>

                            <h3 className="text-xl md:text-2xl font-black mt-1">
                              {module.title}
                            </h3>

                          </div>

                        </div>


                        <div className="flex flex-col items-end gap-3">

                          <span className="text-[#ccff00] text-xl">
                            {module.icon}
                          </span>

                          <span
                            className={`text-[8px] font-black tracking-[0.15em] ${
                              completed
                                ? "text-[#00ff95]"
                                : open
                                ? "text-[#ccff00]"
                                : "text-[#50564e]"
                            }`}
                          >
                            {completed
                              ? "COMPLETE"
                              : open
                              ? "ACTIVE"
                              : "READY"}
                          </span>

                        </div>

                      </div>


                      <p className="text-[#858c80] mt-5 leading-relaxed">
                        {module.description}
                      </p>


                      <div className="flex items-center justify-between mt-5">

                        <p className="text-[#5f665c] text-[9px] tracking-[0.15em]">
                          SAFETY MODULE{" "}
                          {module.number}
                        </p>

                        <span className="text-[#ccff00] font-bold">
                          {open
                            ? "−"
                            : "+"}
                        </span>

                      </div>

                    </button>


                    {/* ==================================================
                        EXPANDED MODULE
                    ================================================== */}

                    <AnimatePresence>

                      {open && (

                        <motion.div
                          initial={{
                            opacity: 0,
                            height: 0,
                          }}
                          animate={{
                            opacity: 1,
                            height:
                              "auto",
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                          }}
                          transition={{
                            duration:
                              0.3,
                          }}
                          className="relative z-10 overflow-hidden"
                        >

                          <div className="border-t border-white/5 p-6">


                            {/* LESSON */}

                            <p className="text-[#ccff00] text-[9px] tracking-[0.22em]">
                              SAFETY PROTOCOL
                            </p>


                            <div className="grid gap-3 mt-5">

                              {module.lesson.map(
                                (
                                  item,
                                  index
                                ) => (

                                  <div
                                    key={
                                      index
                                    }
                                    className="flex gap-4 rounded-xl border border-white/5 bg-black/25 p-4"
                                  >

                                    <div className="w-8 h-8 flex-shrink-0 rounded-lg border border-[#ccff00]/15 bg-[#ccff00]/5 flex items-center justify-center text-[#ccff00] text-xs">
                                      ◈
                                    </div>

                                    <p className="text-[#b6bbb2] leading-relaxed">
                                      {item}
                                    </p>

                                  </div>

                                )
                              )}

                            </div>


                            {/* ==================================================
                                KNOWLEDGE CHECK
                            ================================================== */}

                            <div className="mt-7 rounded-2xl border border-white/10 bg-black/35 p-5 md:p-6">

                              <div className="flex items-start justify-between gap-5">

                                <div>

                                  <p className="text-[#62695f] text-[9px] tracking-[0.22em]">
                                    KNOWLEDGE CHECK
                                  </p>

                                  <p className="font-bold text-lg mt-3">
                                    {module.question}
                                  </p>

                                </div>


                                <div className="w-10 h-10 rounded-lg border border-[#ccff00]/20 bg-[#ccff00]/5 flex items-center justify-center text-[#ccff00]">
                                  ?
                                </div>

                              </div>


                              <div className="grid gap-3 mt-6">

                                {module.options.map(
                                  (
                                    option,
                                    optionIndex
                                  ) => {

                                    const selected =
                                      selectedAnswer ===
                                      option;


                                    return (
                                      <button
                                        key={
                                          option
                                        }
                                        type="button"
                                        disabled={
                                          completed
                                        }
                                        onClick={() =>
                                          selectAnswer(
                                            module.id,
                                            option
                                          )
                                        }
                                        className={`w-full text-left rounded-xl border p-4 transition disabled:cursor-not-allowed ${
                                          selected
                                            ? "border-[#ccff00] bg-[#ccff00]/10 text-white"
                                            : "border-white/10 bg-black/20 text-[#a6ada1] hover:border-[#ccff00]/30"
                                        } ${
                                          completed
                                            ? "opacity-60"
                                            : ""
                                        }`}
                                      >

                                        <div className="flex gap-4">

                                          <span
                                            className={`w-8 h-8 flex-shrink-0 rounded-lg border flex items-center justify-center text-xs font-black ${
                                              selected
                                                ? "bg-[#ccff00] border-[#ccff00] text-black"
                                                : "border-white/10 text-[#6d746a]"
                                            }`}
                                          >
                                            {String.fromCharCode(
                                              65 +
                                                optionIndex
                                            )}
                                          </span>

                                          <span className="pt-1">
                                            {option}
                                          </span>

                                        </div>

                                      </button>
                                    );
                                  }
                                )}

                              </div>


                              {!completed ? (

                                <motion.button
                                  whileHover={{
                                    scale:
                                      1.01,
                                  }}
                                  whileTap={{
                                    scale:
                                      0.99,
                                  }}
                                  type="button"
                                  disabled={
                                    saving
                                  }
                                  onClick={() =>
                                    completeModule(
                                      module
                                    )
                                  }
                                  className="w-full mt-6 bg-[#ccff00] text-black font-black py-4 rounded-xl hover:bg-[#b8e600] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >

                                  {saving ? (

                                    <span className="flex items-center justify-center gap-3">

                                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />

                                      SAVING PROGRESS

                                    </span>

                                  ) : (
                                    "COMPLETE MODULE →"
                                  )}

                                </motion.button>

                              ) : (

                                <div className="mt-6 bg-[#00ff95]/10 border border-[#00ff95]/30 text-[#00ff95] rounded-xl p-4 font-black flex items-center gap-3">

                                  <span>
                                    ✓
                                  </span>

                                  MODULE COMPLETE

                                </div>

                              )}

                            </div>

                          </div>

                        </motion.div>

                      )}

                    </AnimatePresence>

                  </motion.article>
                );
              }
            )}

          </div>

        </section>


        {/* ==================================================
            COMPLETE SYSTEM
        ================================================== */}

        {completionPercent ===
          100 && (

          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-10 relative overflow-hidden rounded-[30px] border border-[#00ff95]/30 bg-[#00ff95]/5 backdrop-blur-xl p-8 md:p-10"
          >

            <div className="absolute right-[-100px] top-[-100px] w-[350px] h-[350px] bg-[#00ff95]/10 blur-[120px] rounded-full" />


            <div className="relative z-10 grid lg:grid-cols-[1fr_auto] gap-7 items-center">

              <div>

                <div className="inline-flex items-center gap-3">

                  <span className="w-2 h-2 rounded-full bg-[#00ff95] shadow-[0_0_10px_#00ff95]" />

                  <p className="text-[#00ff95] text-[10px] tracking-[0.24em]">
                    SAFETY SYSTEM COMPLETE
                  </p>

                </div>


                <h2 className="text-3xl md:text-4xl font-black mt-4">
                  X-Fit Safety Protocol Completed
                </h2>


                <p className="text-[#9ca398] mt-4 max-w-2xl leading-relaxed">
                  You completed all available Safe Mode learning
                  modules and built your training-safety
                  knowledge base.
                </p>

              </div>


              <div className="w-24 h-24 rounded-full border border-[#00ff95]/30 bg-[#00ff95]/10 flex items-center justify-center text-[#00ff95] text-4xl">
                ✓
              </div>

            </div>

          </motion.section>

        )}


        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div className="grid md:grid-cols-4 gap-4 mt-10">

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


          <button
            onClick={() =>
              navigate(
                "/workout-plan"
              )
            }
            className="border border-[#ccff00]/40 text-[#ccff00] font-bold py-4 rounded-xl hover:bg-[#ccff00]/10 transition"
          >
            WORKOUT PLAN
          </button>


          <button
            onClick={() =>
              navigate(
                "/motioncheck"
              )
            }
            className="bg-[#ccff00] text-black font-black py-4 rounded-xl hover:bg-[#b8e600] transition"
          >
            MOTIONCHECK
          </button>


          <button
            onClick={() =>
              navigate(
                "/progress-dna"
              )
            }
            className="border border-white/10 text-white font-bold py-4 rounded-xl hover:border-[#ccff00]/40 transition"
          >
            PROGRESS DNA
          </button>

        </div>

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
   SAFE STAT
================================================== */

function SafeStat({
  label,
  value,
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

      <p className="text-[#62695f] text-[8px] tracking-[0.18em]">
        {label}
      </p>

      <p
        className={`text-3xl font-black mt-4 ${
          highlight
            ? "text-[#ccff00]"
            : "text-white"
        }`}
      >
        {value}
      </p>

    </motion.div>
  );
}


/* ==================================================
   KNOWLEDGE METRIC
================================================== */

function KnowledgeMetric({
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


export default SafeMode;