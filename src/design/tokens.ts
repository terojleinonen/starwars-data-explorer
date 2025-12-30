export const colorTokens = {
  // Core neutrals
  surface: {
    light: "rgba(255,255,255,0.04)",
    dark: "rgba(15,23,42,0.55)",
  },

  border: {
    subtle: "rgba(148,163,184,0.22)",
    focus: "rgba(56,189,248,0.55)",
  },

  text: {
    primary: "rgba(255,255,255,0.95)",
    secondary: "rgba(255,255,255,0.65)",
    muted: "rgba(255,255,255,0.45)",
  },

  accent: {
    primary: "rgba(56,189,248,1)",   // cyan-blue
    soft: "rgba(56,189,248,0.35)",
    glow: "rgba(56,189,248,0.18)",
  },
};

export const depthTokens = {
  blur: {
    panel: "blur(18px)",
    subtle: "blur(10px)",
  },

  shadow: {
    panel: "0 20px 40px rgba(0,0,0,0.25)",
    hover: "0 26px 60px rgba(0,0,0,0.35)",
  },

  glow: {
    focus: "0 0 40px rgba(56,189,248,0.35)",
    ambient: "0 0 80px rgba(56,189,248,0.15)",
  },
};

export const gridTokens = {
  unit: 8, // base spacing unit

  radius: {
    card: 16,
    panel: 28,
    pill: 999,
  },

  grid: {
    fine: "1px 24px",
    coarse: "1px 36px",
  },
};

export const motionTokens = {
  duration: {
    fast: 0.12,
    medium: 0.35,
    slow: 0.6,
  },

  easing: {
    standard: "easeOut",
    soft: [0.25, 0.46, 0.45, 0.94],
  },

  loop: {
    slow: 18,
    medium: 12,
  },
};

export const interactionTokens = {
  hover: {
    lift: -4,
    glow: 0.4,
  },

  focus: {
    scale: 1.02,
  },

  active: {
    scale: 0.98,
  },
};

export const tokens = {
  color: {
    surface: {
      glass: "rgba(255,255,255,0.04)",
      glassDark: "rgba(15,23,42,0.55)",
    },
    border: {
      subtle: "rgba(148,163,184,0.22)",
      focus: "rgba(56,189,248,0.55)",
    },
    accent: {
      primary: "#38bdf8",
      soft: "rgba(56,189,248,0.35)",
      glow: "rgba(56,189,248,0.18)",
    },
    text: {
      primary: "rgba(255,255,255,0.95)",
      secondary: "rgba(255,255,255,0.65)",
      muted: "rgba(255,255,255,0.45)",
    },
  },

  depth: {
    blur: {
      panel: "blur(18px)",
      soft: "blur(10px)",
    },
    shadow: {
      panel: "0 20px 40px rgba(0,0,0,0.25)",
      hover: "0 26px 60px rgba(0,0,0,0.35)",
    },
    glow: {
      focus: "0 0 40px rgba(56,189,248,0.35)",
    },
  },

  radius: {
    card: 16,
    panel: 28,
  },

  motion: {
    fast: 0.15,
    medium: 0.35,
    slow: 0.6,
    idle: 18,
  },
};