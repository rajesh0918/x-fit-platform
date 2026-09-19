import { useLocation, useNavigate } from "react-router-dom";

function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      label: "Today",
      path: "/dashboard",
    },
    {
      label: "Training",
      path: "/workout-plan",
    },
    {
      label: "MotionCheck",
      path: "/motioncheck",
    },
    {
      label: "Nutrition",
      path: "/diet-plan",
    },
    {
      label: "Safe Mode",
      path: "/safe-mode",
    },
    {
      label: "Progress DNA",
      path: "/progress-dna",
    },
  ];

  const isActive = (path) => {
    if (
      path === "/motioncheck" &&
      location.pathname === "/motioncheck-history"
    ) {
      return true;
    }

    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-white/5 bg-black/35 backdrop-blur-2xl">
      <div className="max-w-[1500px] mx-auto h-full px-5 md:px-10 flex items-center justify-between">

        {/* LOGO */}

        <button
          onClick={() => navigate("/dashboard")}
          className="text-[#ccff00] text-4xl font-black tracking-[-0.06em]"
        >
          X-FIT
        </button>


        {/* DESKTOP NAV */}

        <div className="hidden lg:flex items-center gap-8 h-full">
          {navItems.map((item) => {
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`h-full flex items-center text-sm transition ${
                  active
                    ? "text-white font-bold border-b-2 border-[#ccff00]"
                    : "text-[#92998c] hover:text-white"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>


        {/* PROFILE */}

        <div className="flex items-center gap-3">

          <div className="hidden md:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff95] shadow-[0_0_8px_#00ff95]" />

            <span className="text-[#62695f] text-[8px] tracking-[0.18em]">
              SYSTEM ONLINE
            </span>
          </div>

          <button
            onClick={() => navigate("/profile")}
            title="Athlete Profile"
            className="w-10 h-10 rounded-full border border-white/10 bg-black/30 text-[#ccff00] hover:bg-[#ccff00] hover:text-black transition"
          >
            ◉
          </button>

        </div>

      </div>
    </nav>
  );
}

export default AppNavbar;