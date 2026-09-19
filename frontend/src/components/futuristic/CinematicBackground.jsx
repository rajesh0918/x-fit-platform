import React from "react";

export default function CinematicBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* =====================================================
          CINEMATIC GYM VIDEO
         ===================================================== */}

      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/videos/xfit-gym.mp4" type="video/mp4" />
      </video>

      {/* =====================================================
          DARK CINEMATIC VIGNETTE
         ===================================================== */}

      <div className="absolute inset-0 bg-black/55" />

      {/* Left-side darkness for typography */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/20" />

      {/* Bottom cinematic fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

      {/* =====================================================
          X-FIT LIME / CYAN LIGHT GLOW
         ===================================================== */}

      <div className="absolute left-[45%] top-[35%] w-[500px] h-[500px] rounded-full bg-[#ccff00]/8 blur-[140px]" />

      <div className="absolute right-[8%] top-[30%] w-[400px] h-[400px] rounded-full bg-[#00d1ff]/7 blur-[150px]" />

      {/* =====================================================
          TECHNICAL GRID
         ===================================================== */}

      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(204,255,0,0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(204,255,0,0.25) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* =====================================================
          SCAN LINE
         ===================================================== */}

      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#ccff00]/30 to-transparent" />

      {/* =====================================================
          CINEMATIC GRAIN
         ===================================================== */}

      <div className="absolute inset-0 pointer-events-none opacity-[0.035]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* =====================================================
          EDGE VIGNETTE
         ===================================================== */}

      <div className="absolute inset-0 shadow-[inset_0_0_180px_80px_rgba(0,0,0,0.85)]" />
    </div>
  );
}