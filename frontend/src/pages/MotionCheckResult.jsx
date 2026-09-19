import { useLocation, useNavigate } from "react-router-dom";

function MotionCheckResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const result = location.state?.result;
  const selectedExercise =
    location.state?.exercise || result?.exercise;

  // If user directly opens this page without analysis data
  if (!result) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center px-6">

        <div className="bg-[#1c1b1b] border border-[#444933] rounded-xl p-8 max-w-lg w-full text-center">

          <h1 className="text-3xl font-bold mb-3">
            No Analysis Found
          </h1>

          <p className="text-[#c4c9ac] mb-6">
            Run MotionCheck first to generate an analysis result.
          </p>

          <button
            onClick={() =>
              navigate("/motioncheck")
            }
            className="w-full bg-[#ccff00] text-black font-bold py-4 rounded-lg"
          >
            OPEN MOTIONCHECK
          </button>

        </div>

      </div>
    );
  }

  const formatExerciseName = (name) => {
    if (name === "bicep_curl") {
      return "Bicep Curl";
    }

    if (name === "pushup") {
      return "Push-Up";
    }

    return "Squat";
  };

  const exerciseName =
    formatExerciseName(
      result.exercise
    );

  const breakdown =
    result.metric_breakdown || {};

  const repQuality =
    breakdown.rep_quality || [];

  const processedFrames =
    breakdown.processed_frames ?? 0;

  const skippedFrames =
    breakdown.skipped_frames ?? 0;

  const selectedArm =
    breakdown.selected_arm || null;

  const feedback =
    result.feedback || [];

  const videoUrl =
    result.video_url ||
    result.video ||
    null;

  const getQualityLabel = (quality) => {
    if (!quality) {
      return "N/A";
    }

    return quality
      .replaceAll("_", " ")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#e5e2e1]">

      {/* ==================================================
          DESKTOP SIDEBAR
      ================================================== */}

      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-[#0e0e0e] border-r border-[#444933]/30 z-40 flex-col py-6">

        <div className="px-6 mb-10">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="text-[#ccff00] text-2xl font-black"
          >
            ATHLETE_DNA
          </button>

          <p className="text-xs text-[#c4c9ac] mt-2">
            X-Fit Motion Intelligence
          </p>

        </div>


        <div className="flex-1 px-4 space-y-2">

          <SideButton
            text="Dashboard"
            onClick={() =>
              navigate("/dashboard")
            }
          />

          <SideButton
            text="Workouts"
            onClick={() =>
              navigate("/workout-plan")
            }
          />

          <SideButton
            text="Analysis"
            active
            onClick={() =>
              navigate("/motioncheck")
            }
          />

          <SideButton
            text="History"
            onClick={() =>
              navigate(
                "/motioncheck-history"
              )
            }
          />

          <SideButton
            text="Progress DNA"
            onClick={() =>
              navigate("/progress-dna")
            }
          />

        </div>


        <div className="px-6 mt-auto">

          <button
            onClick={() =>
              navigate("/motioncheck")
            }
            className="w-full bg-[#ccff00] text-black py-3 rounded-lg font-bold"
          >
            NEW ANALYSIS
          </button>

        </div>

      </aside>


      {/* ==================================================
          MOBILE HEADER
      ================================================== */}

      <header className="md:hidden fixed top-0 left-0 w-full h-20 z-50 bg-[#0e0e0e]/95 backdrop-blur-xl border-b border-[#444933]/30 px-5 flex items-center justify-between">

        <button
          onClick={() =>
            navigate("/dashboard")
          }
          className="text-[#ccff00] text-3xl font-black"
        >
          X-FIT
        </button>

        <button
          onClick={() =>
            navigate("/profile")
          }
          className="text-[#ccff00]"
        >
          PROFILE
        </button>

      </header>


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="md:ml-64 pt-28 md:pt-12 pb-28 px-5 md:px-10 min-h-screen">

        <div className="max-w-7xl mx-auto">

          {/* HEADER */}

          <header className="mb-10">

            <p className="text-[#ccff00] text-sm font-bold flex items-center gap-2 mb-2">

              <span className="w-2 h-2 bg-[#ccff00] rounded-full" />

              MOTIONCHECK RESULTS

            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              {exerciseName} Analysis
            </h1>

          </header>


          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

            {/* ==================================================
                LEFT COLUMN
            ================================================== */}

            <div className="xl:col-span-5 flex flex-col gap-5">

              {/* SCORE CARD */}

              <section className="bg-[#201f1f] p-6 rounded-xl border border-[#444933]/40 relative overflow-hidden">

                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#ccff00]/5 to-transparent pointer-events-none" />

                <div className="relative flex justify-between items-start gap-4 mb-7">

                  <div>

                    <p className="text-xs text-[#c4c9ac] tracking-[0.2em] mb-2">
                      FORM SCORE
                    </p>

                    <p className="text-6xl md:text-7xl font-extrabold text-[#ccff00] drop-shadow-[0_0_15px_rgba(204,255,0,0.25)]">
                      {result.form_score}
                    </p>

                    <p className="text-[#656464] mt-1">
                      / 100
                    </p>

                  </div>


                  <div className="bg-[#2a2a2a] border border-[#444933] rounded-lg px-5 py-3 text-center">

                    <p className="text-xs text-[#c4c9ac] tracking-widest">
                      REPS
                    </p>

                    <p className="text-3xl font-bold text-white mt-1">
                      {result.rep_count}
                    </p>

                  </div>

                </div>


                {/* TECHNICAL DATA */}

                <p className="text-xs text-[#c4c9ac] tracking-[0.2em] border-b border-[#444933]/40 pb-3 mb-4">
                  ANALYSIS DATA
                </p>

                <DataRow
                  label="Processed Frames"
                  value={processedFrames}
                />

                <DataRow
                  label="Skipped Frames"
                  value={skippedFrames}
                />

                <DataRow
                  label="Exercise"
                  value={exerciseName}
                />

                {selectedArm && (
                  <DataRow
                    label="Detected Arm"
                    value={
                      selectedArm.toUpperCase()
                    }
                    highlight
                  />
                )}

              </section>


              {/* FEEDBACK */}

              {feedback.length > 0 && (
                <section className="bg-[#2a2a2a] p-6 rounded-xl border border-[#ff3b3b]/30">

                  <div className="flex justify-between items-start mb-5">

                    <p className="text-xs text-[#ff3b3b] tracking-[0.2em]">
                      MOTION FEEDBACK
                    </p>

                    <span className="text-[#ff3b3b]">
                      ⚠
                    </span>

                  </div>


                  <div className="space-y-6">

                    {feedback.map(
                      (item, index) => (

                        <div
                          key={index}
                          className={
                            index > 0
                              ? "border-t border-[#444933]/40 pt-5"
                              : ""
                          }
                        >

                          <div className="mb-4">

                            <p className="text-xs text-[#c4c9ac] tracking-widest">
                              WHAT
                            </p>

                            <p className="text-white mt-1">
                              {item.what}
                            </p>

                          </div>


                          <div className="mb-4">

                            <p className="text-xs text-[#c4c9ac] tracking-widest">
                              WHY
                            </p>

                            <p className="text-[#c8c6c5] mt-1">
                              {item.why}
                            </p>

                          </div>


                          <div className="bg-[#0e0e0e] border-l-2 border-[#ccff00] p-4 rounded-lg">

                            <p className="text-xs text-[#ccff00] tracking-widest">
                              HOW TO IMPROVE
                            </p>

                            <p className="text-white mt-2">
                              {item.how}
                            </p>

                          </div>

                        </div>
                      )
                    )}

                  </div>

                </section>
              )}


              {/* SAVED STATUS */}

              <section className="bg-[#201f1f] p-6 rounded-xl border border-[#444933]/40">

                <p className="text-xs text-[#c4c9ac] tracking-[0.2em] mb-2">
                  PROGRESS DNA
                </p>

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <p className="text-lg font-bold text-white">
                      Analysis Saved
                    </p>

                    <p className="text-sm text-[#c4c9ac] mt-1">
                      This result is already included in your MotionCheck history and Progress DNA.
                    </p>

                  </div>

                  <span className="text-[#00ff95] text-2xl">
                    ✓
                  </span>

                </div>

              </section>

            </div>


            {/* ==================================================
                RIGHT COLUMN
            ================================================== */}

            <div className="xl:col-span-7 flex flex-col gap-5">

              {/* VIDEO ANALYSIS PANEL */}

              <section className="bg-[#0e0e0e] rounded-xl border border-[#444933]/40 overflow-hidden relative min-h-[430px]">

                {/* GRID */}

                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(204,255,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(204,255,0,0.05) 1px, transparent 1px)",
                    backgroundSize:
                      "40px 40px",
                  }}
                />


                {videoUrl ? (
                  <video
                    src={videoUrl}
                    controls
                    className="absolute inset-0 w-full h-full object-contain bg-black"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">

                    <div className="w-28 h-28 rounded-full border border-[#ccff00]/30 flex items-center justify-center">

                      <span className="text-[#ccff00] text-5xl">
                        ◉
                      </span>

                    </div>

                    <p className="text-[#c4c9ac] mt-5">
                      Motion analysis complete
                    </p>

                  </div>
                )}


                {/* HUD */}

                <div className="absolute top-4 left-4 right-4 flex justify-between gap-3 pointer-events-none">

                  <span className="bg-[#201f1f]/90 backdrop-blur-md text-[#ccff00] text-xs px-3 py-2 rounded-full border border-[#ccff00]/30">

                    ● ANALYZED

                  </span>

                  <span className="bg-[#201f1f]/90 backdrop-blur-md text-white text-xs px-3 py-2 rounded-full border border-[#444933]">

                    {result.rep_count} REPS

                  </span>

                </div>


                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-[#201f1f]/90 backdrop-blur-md border border-[#ccff00]/40 text-[#ccff00] px-4 py-2 rounded-lg text-xs tracking-widest whitespace-nowrap">

                  FORM SCORE {result.form_score}/100

                </div>

              </section>


              {/* REP BREAKDOWN */}

              {repQuality.length > 0 && (
                <section className="bg-[#1c1b1b] border border-[#444933]/40 rounded-xl p-6">

                  <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold text-white">
                      Rep Breakdown
                    </h2>

                    <span className="text-xs text-[#c4c9ac] tracking-widest">
                      {repQuality.length} ANALYZED
                    </span>

                  </div>


                  <div className="space-y-3">

                    {repQuality.map(
                      (rep) => (

                        <div
                          key={rep.rep}
                          className="bg-[#2a2a2a] border border-[#444933]/30 rounded-lg p-4"
                        >

                          <div className="flex justify-between items-center gap-3">

                            <p className="font-bold text-white">
                              REP {rep.rep}
                            </p>

                            <span
                              className={`text-xs px-3 py-1 rounded-full border ${
                                rep.quality ===
                                  "good_depth" ||
                                rep.quality ===
                                  "full_rom"
                                  ? "text-[#00ff95] border-[#00ff95]/30"
                                  : rep.quality ===
                                    "partial_lockout"
                                  ? "text-[#ffb4ab] border-[#ff3b3b]/30"
                                  : "text-[#ccff00] border-[#ccff00]/30"
                              }`}
                            >
                              {getQualityLabel(
                                rep.quality
                              )}
                            </span>

                          </div>


                          <div className="grid sm:grid-cols-2 gap-3 mt-4">

                            {rep.minimum_knee_angle !==
                              undefined && (
                              <RepMetric
                                label="MIN KNEE ANGLE"
                                value={`${rep.minimum_knee_angle}°`}
                              />
                            )}

                            {rep.minimum_elbow_angle !==
                              undefined && (
                              <RepMetric
                                label="MIN ELBOW ANGLE"
                                value={`${rep.minimum_elbow_angle}°`}
                              />
                            )}

                            {rep.maximum_elbow_angle !==
                              undefined && (
                              <RepMetric
                                label="MAX ELBOW ANGLE"
                                value={`${rep.maximum_elbow_angle}°`}
                              />
                            )}

                          </div>

                        </div>
                      )
                    )}

                  </div>

                </section>
              )}


              {/* ACTIONS */}

              <div className="flex flex-col sm:flex-row gap-4">

                <button
                  onClick={() =>
                    navigate(
                      "/motioncheck",
                      {
                        state: {
                          exercise:
                            selectedExercise,
                        },
                      }
                    )
                  }
                  className="flex-1 bg-[#ccff00] text-black py-4 rounded-lg font-bold text-lg hover:bg-[#abd600] transition active:scale-[0.98]"
                >
                  ↻ RETRY EXERCISE
                </button>


                <button
                  onClick={() =>
                    navigate(
                      "/progress-dna"
                    )
                  }
                  className="flex-1 bg-transparent border border-[#ccff00] text-[#ccff00] py-4 rounded-lg font-bold text-lg hover:bg-[#ccff00]/10 transition active:scale-[0.98]"
                >
                  VIEW PROGRESS DNA
                </button>

              </div>


              <button
                onClick={() =>
                  navigate(
                    "/motioncheck-history"
                  )
                }
                className="w-full border border-[#444933] text-white py-4 rounded-lg font-bold hover:border-[#ccff00]/50 transition"
              >
                VIEW MOTIONCHECK HISTORY
              </button>

            </div>

          </div>

        </div>

      </main>


      {/* ==================================================
          MOBILE BOTTOM NAV
      ================================================== */}

      <nav className="md:hidden fixed bottom-0 left-0 z-50 w-full bg-[#2a2a2a]/95 backdrop-blur-md border-t border-[#444933] px-3 py-3">

        <div className="grid grid-cols-4">

          <MobileNav
            label="Today"
            onClick={() =>
              navigate("/dashboard")
            }
          />

          <MobileNav
            label="Workouts"
            onClick={() =>
              navigate("/workout-plan")
            }
          />

          <MobileNav
            label="Motion"
            active
            onClick={() =>
              navigate("/motioncheck")
            }
          />

          <MobileNav
            label="DNA"
            onClick={() =>
              navigate("/progress-dna")
            }
          />

        </div>

      </nav>

    </div>
  );
}


function DataRow({
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-[#444933]/20 last:border-0">

      <span className="text-sm text-[#c8c6c5]">
        {label}
      </span>

      <span
        className={`font-bold ${
          highlight
            ? "text-[#ccff00]"
            : "text-white"
        }`}
      >
        {value}
      </span>

    </div>
  );
}


function RepMetric({
  label,
  value,
}) {
  return (
    <div className="bg-[#131313] rounded p-3">

      <p className="text-[10px] text-[#c4c9ac] tracking-widest">
        {label}
      </p>

      <p className="font-bold text-white mt-1">
        {value}
      </p>

    </div>
  );
}


function SideButton({
  text,
  onClick,
  active = false,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg border-r-4 transition ${
        active
          ? "bg-[#474746] text-[#ccff00] border-[#ccff00] font-bold"
          : "text-[#c4c9ac] border-transparent hover:bg-[#2a2a2a] hover:text-white"
      }`}
    >
      {text}
    </button>
  );
}


function MobileNav({
  label,
  onClick,
  active = false,
}) {
  return (
    <button
      onClick={onClick}
      className={`py-2 rounded-full text-xs ${
        active
          ? "bg-[#ccff00] text-black font-bold"
          : "text-[#c4c9ac]"
      }`}
    >
      {label}
    </button>
  );
}


export default MotionCheckResult;