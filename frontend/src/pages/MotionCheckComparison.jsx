import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function MotionCheckComparison() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentFromState = location.state?.currentAnalysis || null;

  const [analyses, setAnalyses] = useState([]);
  const [current, setCurrent] = useState(currentFromState);
  const [previous, setPrevious] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const accessToken = localStorage.getItem("access");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/motioncheck/history/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");

          navigate("/login");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          setError("Could not load MotionCheck history.");
          return;
        }

        const history = Array.isArray(data) ? data : [];

        setAnalyses(history);

        let selectedCurrent = currentFromState;

        if (!selectedCurrent && history.length > 0) {
          selectedCurrent = history[0];
          setCurrent(history[0]);
        }

        if (selectedCurrent) {
          const sameExercise = history
            .filter(
              (item) =>
                item.exercise === selectedCurrent.exercise &&
                item.id !== selectedCurrent.id
            )
            .sort(
              (a, b) =>
                new Date(b.created_at) -
                new Date(a.created_at)
            );

          if (sameExercise.length > 0) {
            setPrevious(sameExercise[0]);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Backend connection failed.");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [accessToken, currentFromState, navigate]);

  const formatExercise = (name) => {
    if (name === "bicep_curl") {
      return "Bicep Curl";
    }

    if (name === "pushup") {
      return "Push-Up";
    }

    return "Squat";
  };

  const scoreDelta = useMemo(() => {
    if (!current || !previous) {
      return 0;
    }

    return Number(current.form_score) - Number(previous.form_score);
  }, [current, previous]);

  const improvementDetected =
    previous && scoreDelta > 0;

  const declineDetected =
    previous && scoreDelta < 0;

  const getRepQuality = (analysis) => {
    return (
      analysis?.metric_breakdown?.rep_quality || []
    );
  };

  const currentReps = getRepQuality(current);
  const previousReps = getRepQuality(previous);

  const currentGoodReps = currentReps.filter((rep) =>
    ["good_depth", "acceptable_depth", "full_rom"].includes(
      rep.quality
    )
  ).length;

  const previousGoodReps = previousReps.filter((rep) =>
    ["good_depth", "acceptable_depth", "full_rom"].includes(
      rep.quality
    )
  ).length;

  const repDelta =
    currentGoodReps - previousGoodReps;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center">
        <p className="text-[#ccff00] text-xl">
          Loading Comparison...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center px-6">
        <div className="max-w-lg w-full bg-[#1c1b1b] border border-red-500/30 rounded-xl p-8">
          <p className="text-red-400">
            {error}
          </p>

          <button
            onClick={() =>
              navigate("/motioncheck-history")
            }
            className="mt-5 text-[#ccff00] font-bold"
          >
            ← Back to History
          </button>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center px-6">
        <div className="max-w-lg w-full bg-[#1c1b1b] border border-[#444933] rounded-xl p-8 text-center">

          <h1 className="text-3xl font-bold">
            No Analysis Available
          </h1>

          <p className="text-[#c4c9ac] mt-3">
            Run a MotionCheck analysis first.
          </p>

          <button
            onClick={() =>
              navigate("/motioncheck")
            }
            className="mt-6 w-full bg-[#ccff00] text-black font-bold py-4 rounded-lg"
          >
            OPEN MOTIONCHECK
          </button>

        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#0e0e0e] text-[#e5e2e1]"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(204,255,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(204,255,0,0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >

      {/* SIDEBAR */}

      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-[#0e0e0e] border-r border-[#444933]/30 z-40 flex-col py-8">

        <div className="px-7 mb-10">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="text-[#ccff00] text-4xl font-black tracking-tighter"
          >
            X-FIT
          </button>

          <p className="text-white text-xl font-bold mt-8">
            Athlete
          </p>

          <p className="text-[#ccff00] text-sm">
            Motion Intelligence
          </p>

        </div>

        <NavButton
          text="Dashboard"
          onClick={() =>
            navigate("/dashboard")
          }
        />

        <NavButton
          text="Workouts"
          onClick={() =>
            navigate("/workout-plan")
          }
        />

        <NavButton
          text="Analysis"
          active
          onClick={() =>
            navigate("/motioncheck-history")
          }
        />

        <NavButton
          text="Progress DNA"
          onClick={() =>
            navigate("/progress-dna")
          }
        />

        <NavButton
          text="Profile"
          onClick={() =>
            navigate("/profile")
          }
        />

        <div className="px-7 mt-auto">

          <button
            onClick={() =>
              navigate("/motioncheck")
            }
            className="w-full bg-[#ccff00] text-black font-bold py-4 rounded-lg"
          >
            START WORKOUT
          </button>

        </div>

      </aside>


      {/* MAIN */}

      <main className="md:ml-64 px-5 md:px-10 py-10 min-h-screen">

        <div className="max-w-7xl mx-auto">

          {/* HEADER */}

          <header className="mb-10">

            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              ANALYSIS COMPARISON
            </h1>

            <p className="text-[#c4c9ac] mt-3">
              Comparing latest{" "}
              <span className="text-[#ccff00]">
                {formatExercise(current.exercise)}
              </span>{" "}
              attempt
              {previous
                ? " against the previous attempt."
                : "."}
            </p>

          </header>


          {!previous ? (

            <div className="bg-[#1c1b1b] border border-[#444933] rounded-xl p-8">

              <h2 className="text-2xl font-bold text-white">
                One more attempt needed
              </h2>

              <p className="text-[#c4c9ac] mt-3">
                You currently have only one saved{" "}
                {formatExercise(current.exercise)} analysis.
                Complete another analysis to compare improvement.
              </p>

              <button
                onClick={() =>
                  navigate("/motioncheck")
                }
                className="mt-6 bg-[#ccff00] text-black font-bold px-6 py-4 rounded-lg"
              >
                RUN ANOTHER ANALYSIS
              </button>

            </div>

          ) : (

            <>
              {/* TOP COMPARISON */}

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 mb-5">

                <section className="xl:col-span-8 bg-[#2a2a2a] border border-[#444933]/40 rounded-xl p-8">

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

                    <ScoreBlock
                      label="PREVIOUS"
                      score={previous.form_score}
                      muted
                    />

                    <div className="text-center">

                      <p
                        className={`text-sm font-bold ${
                          scoreDelta > 0
                            ? "text-[#ccff00]"
                            : scoreDelta < 0
                            ? "text-[#ff3b3b]"
                            : "text-white"
                        }`}
                      >
                        {scoreDelta > 0 ? "+" : ""}
                        {scoreDelta} SCORE CHANGE
                      </p>

                      <div className="h-px bg-gradient-to-r from-transparent via-[#ccff00] to-transparent mt-4" />

                    </div>

                    <ScoreBlock
                      label="CURRENT"
                      score={current.form_score}
                      highlight
                    />

                  </div>

                </section>


                {/* IMPROVEMENT CARD */}

                <section className="xl:col-span-4 bg-[#1c1b1b] border border-[#444933]/40 rounded-xl p-6">

                  <p
                    className={`text-2xl font-bold ${
                      improvementDetected
                        ? "text-[#00ff95]"
                        : declineDetected
                        ? "text-[#ff3b3b]"
                        : "text-[#ccff00]"
                    }`}
                  >
                    {improvementDetected
                      ? "IMPROVEMENT DETECTED"
                      : declineDetected
                      ? "PERFORMANCE DROP"
                      : "NO SCORE CHANGE"}
                  </p>

                  <p className="text-[#c4c9ac] mt-4 leading-relaxed">
                    Current score is{" "}
                    <span className="text-white font-bold">
                      {current.form_score}
                    </span>{" "}
                    compared with{" "}
                    <span className="text-white font-bold">
                      {previous.form_score}
                    </span>{" "}
                    previously.
                  </p>

                  <p className="text-[#c4c9ac] mt-3">
                    Quality reps changed from{" "}
                    {previousGoodReps} to{" "}
                    {currentGoodReps}.
                  </p>

                  <button
                    onClick={() =>
                      navigate("/progress-dna")
                    }
                    className="mt-6 w-full bg-[#ccff00] text-black font-bold py-4 rounded-lg"
                  >
                    VIEW PROGRESS DNA
                  </button>

                  <button
                    onClick={() =>
                      navigate("/motioncheck-history")
                    }
                    className="mt-3 w-full border border-[#444933] text-white font-bold py-4 rounded-lg"
                  >
                    BACK TO HISTORY
                  </button>

                </section>

              </div>


              {/* METRICS */}

              <div className="grid md:grid-cols-3 gap-4 mb-6">

                <ComparisonMetric
                  label="FORM SCORE"
                  current={current.form_score}
                  previous={previous.form_score}
                />

                <ComparisonMetric
                  label="TOTAL REPS"
                  current={current.rep_count}
                  previous={previous.rep_count}
                />

                <ComparisonMetric
                  label="QUALITY REPS"
                  current={currentGoodReps}
                  previous={previousGoodReps}
                />

              </div>


              {/* REP BREAKDOWN */}

              <section className="bg-[#2a2a2a] border border-[#444933]/40 rounded-xl p-6">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-8">

                  <h2 className="text-2xl font-bold text-white">
                    REP BREAKDOWN ANALYSIS
                  </h2>

                  <p
                    className={`font-bold ${
                      repDelta >= 0
                        ? "text-[#00ff95]"
                        : "text-[#ff3b3b]"
                    }`}
                  >
                    {repDelta > 0 ? "+" : ""}
                    {repDelta} QUALITY REP CHANGE
                  </p>

                </div>


                <RepRow
                  label="PREVIOUS ATTEMPT"
                  reps={previousReps}
                />

                <div className="h-px bg-[#444933]/30 my-8" />

                <RepRow
                  label="CURRENT ATTEMPT"
                  reps={currentReps}
                  current
                />

              </section>

            </>
          )}

        </div>

      </main>

    </div>
  );
}


function ScoreBlock({
  label,
  score,
  highlight = false,
  muted = false,
}) {
  return (
    <div className="text-center">

      <p className="text-xs tracking-[0.2em] text-[#c4c9ac]">
        {label}
      </p>

      <p
        className={`text-6xl md:text-7xl font-extrabold mt-3 ${
          highlight
            ? "text-white"
            : muted
            ? "text-[#8e9379]"
            : "text-[#ccff00]"
        }`}
      >
        {score}
      </p>

      <p className="text-[#c4c9ac] mt-2">
        Overall Score
      </p>

    </div>
  );
}


function ComparisonMetric({
  label,
  current,
  previous,
}) {
  const delta =
    Number(current) -
    Number(previous);

  return (
    <div className="bg-[#2a2a2a] border border-[#444933]/40 rounded-xl p-5">

      <div className="flex justify-between">

        <p className="text-xs tracking-widest text-[#c4c9ac]">
          {label}
        </p>

        <span
          className={`text-xs font-bold ${
            delta > 0
              ? "text-[#00ff95]"
              : delta < 0
              ? "text-[#ff3b3b]"
              : "text-[#c4c9ac]"
          }`}
        >
          {delta > 0 ? "+" : ""}
          {delta}
        </span>

      </div>

      <div className="mt-6">

        <div className="flex justify-between mb-2">
          <span className="text-white">
            Current
          </span>

          <span className="text-[#ccff00] font-bold">
            {current}
          </span>
        </div>

        <div className="h-1.5 bg-[#131313] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#ccff00]"
            style={{
              width: `${Math.min(
                Number(current) || 0,
                100
              )}%`,
            }}
          />
        </div>

      </div>

      <div className="mt-5">

        <div className="flex justify-between mb-2">
          <span className="text-[#8e9379]">
            Previous
          </span>

          <span className="text-[#8e9379]">
            {previous}
          </span>
        </div>

        <div className="h-1.5 bg-[#131313] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#8e9379]"
            style={{
              width: `${Math.min(
                Number(previous) || 0,
                100
              )}%`,
            }}
          />
        </div>

      </div>

    </div>
  );
}


function RepRow({
  label,
  reps,
  current = false,
}) {
  return (
    <div>

      <p
        className={`text-xs tracking-widest mb-5 ${
          current
            ? "text-[#ccff00]"
            : "text-[#c4c9ac]"
        }`}
      >
        {label}
      </p>

      {reps.length === 0 ? (
        <p className="text-[#656464]">
          No rep-quality data available.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">

          {reps.map((rep) => {
            const good = [
              "good_depth",
              "acceptable_depth",
              "full_rom",
            ].includes(rep.quality);

            return (
              <div
                key={rep.rep}
                className="text-center"
              >
                <div
                  className={`w-10 h-10 mx-auto border flex items-center justify-center ${
                    good
                      ? "border-[#00ff95] text-[#00ff95]"
                      : "border-[#ff3b3b] text-[#ff3b3b]"
                  }`}
                >
                  {good ? "✓" : "×"}
                </div>

                <p className="text-xs text-white mt-3">
                  REP {rep.rep}
                </p>

                <p
                  className={`text-[10px] uppercase mt-1 ${
                    good
                      ? "text-[#00ff95]"
                      : "text-[#ff3b3b]"
                  }`}
                >
                  {rep.quality?.replaceAll("_", " ")}
                </p>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}


function NavButton({
  text,
  onClick,
  active = false,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-7 py-4 border-r-4 transition ${
        active
          ? "bg-[#2a2a2a] text-white border-[#ccff00] font-bold"
          : "text-[#c4c9ac] border-transparent hover:bg-[#1c1b1b] hover:text-white"
      }`}
    >
      {text}
    </button>
  );
}


export default MotionCheckComparison;