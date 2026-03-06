/**
 * Aviation training video library.
 * Organized by FAA ACS topic area to match the Airman Knowledge question bank.
 * All video IDs are verified from curated flight school resource lists.
 *
 * @typedef {{ id: string, title: string }} VideoEntry
 * @typedef {{ id: string, title: string, icon: string, acsArea: string, desc: string, videos: VideoEntry[] }} VideoTopic
 */

/** @type {VideoTopic[]} */
export const VIDEO_TOPICS = [
  // ─── Weather ───────────────────────────────────────────────────────────────
  {
    id: 'weather-basics',
    title: 'Weather Fundamentals',
    icon: '🌤️',
    acsArea: 'PA.I.C',
    desc: 'Atmosphere, clouds, fog types, air masses & stability',
    videos: [
      { id: 'A4eIGJrntXg', title: 'Weather BASICS Explained' },
      { id: 'o4lg8UfY5DM', title: 'Air Masses & Weather Fronts for Pilots' },
      { id: 'FMagDRCpJ14', title: 'Cloud Types: A Visual Tutorial' },
      { id: 'Ysf3dfVPZk4', title: 'Temperature, Dewpoint & Fog Formation' },
    ],
  },
  {
    id: 'thunderstorms',
    title: 'Thunderstorms & Microbursts',
    icon: '⛈️',
    acsArea: 'PA.I.C',
    desc: 'Thunderstorm stages, microburst hazards & avoidance',
    videos: [
      { id: 'RKzu-0JgKaI', title: 'Thunderstorm Life Cycle' },
      { id: 'Q3Sr2F_xxLo', title: 'Microburst: What Every Pilot Must Know' },
      { id: 'NnGJQqc4Pfc', title: 'Private Pilot Weather — Full Review' },
    ],
  },
  {
    id: 'weather-reports',
    title: 'Reading Weather Reports',
    icon: '📡',
    acsArea: 'PA.I.C',
    desc: 'Decode METARs, TAFs, and winds aloft forecasts',
    videos: [
      { id: 'Nq7yzDA1zOk', title: 'METARs Explained in Under 5 Minutes' },
      { id: 'WI1CaJjVeOA', title: 'How to Decode a METAR — Step by Step' },
      { id: 'NvqeJM9uFEI', title: 'How to Decode and Read a TAF' },
    ],
  },

  // ─── Airspace ──────────────────────────────────────────────────────────────
  {
    id: 'airspace',
    title: 'National Airspace System',
    icon: '🗺️',
    acsArea: 'PA.I.E',
    desc: 'Classes A–G, special-use airspace, VFR weather minimums',
    videos: [
      { id: 'c6ZieuNvjHw', title: 'Airspace Classes Explained (Lesson 1)' },
      { id: 'kmpA6ZPtRuE', title: 'Airports & Airspace Overview' },
    ],
  },

  // ─── Performance ───────────────────────────────────────────────────────────
  {
    id: 'performance',
    title: 'Aircraft Performance',
    icon: '📊',
    acsArea: 'PA.I.F',
    desc: 'Density altitude, performance charts, takeoff & landing distances',
    videos: [
      { id: '5yFIRHvoy4k', title: 'Density Altitude Explained' },
      { id: 'GDgzFyo4Ozg', title: 'POH Performance Charts — Part 1' },
      { id: '7p4EXhTpDcM', title: 'POH Performance Charts — Part 2' },
      { id: 'DnUyUuY0iHM', title: 'Aircraft Performance — Full Review' },
    ],
  },
  {
    id: 'weight-balance',
    title: 'Weight & Balance',
    icon: '⚖️',
    acsArea: 'PA.I.F',
    desc: 'W&B calculations, CG limits, loading envelopes',
    videos: [
      { id: 'KH4UD4OlbAQ', title: 'Weight & Balance Calculation Tutorial' },
      { id: 'MlWUsiq_G90', title: 'Aircraft Weight & Balance — Part 1' },
      { id: 'X2OvpzO9gyk', title: 'Aircraft Weight & Balance — Part 2' },
    ],
  },

  // ─── Instruments ───────────────────────────────────────────────────────────
  {
    id: 'instruments',
    title: 'Flight Instruments',
    icon: '🎛️',
    acsArea: 'PA.I.F',
    desc: 'Airspeed indicator arcs, pitot-static system, gyroscopic instruments',
    videos: [
      { id: 'kdFGbUouE_4', title: 'Pitot-Static Instruments Explained' },
      { id: 'vICokuUAVAM', title: 'Private Pilot Flight Instruments — ASA' },
      { id: 'OaDqJjONKXM', title: 'Gyroscopic Aviation Instruments' },
    ],
  },

  // ─── Engine Systems ────────────────────────────────────────────────────────
  {
    id: 'engine-systems',
    title: 'Engine & Fuel Systems',
    icon: '🔧',
    acsArea: 'PA.II.A',
    desc: 'Carburetor ice, pre-ignition, detonation, constant-speed propeller',
    videos: [
      { id: 'ZWKRw0HmBLE', title: 'Pre-ignition & Detonation Explained' },
      { id: '5W1ucQsksSA', title: 'Carburetors & Fuel Injection Systems' },
      { id: 'GNsnXjxopJM', title: 'Constant-Speed Propeller — How It Works' },
    ],
  },

  // ─── Documents & Regulations ───────────────────────────────────────────────
  {
    id: 'documents-regs',
    title: 'Aircraft Documents & Regs',
    icon: '📋',
    acsArea: 'PA.I.B',
    desc: 'ARROW documents, annual/100-hr inspections, airworthiness certificates',
    videos: [
      { id: 'BPHNh9JO30c', title: "Understanding Your POH — Introduction" },
      { id: 'U8nNb6xT990', title: 'Private Pilot FAA Requirements Explained' },
    ],
  },

  // ─── Navigation ────────────────────────────────────────────────────────────
  {
    id: 'navigation',
    title: 'Navigation & Charts',
    icon: '🧭',
    acsArea: 'PA.VI.B',
    desc: 'VFR sectional charts, VOR, GPS/RAIM, E6B flight computer',
    videos: [
      { id: 'TMkqcorBcdU', title: 'VFR Sectional Chart Explained' },
      { id: 'U-AcHM9x2mA', title: 'VOR Navigation Made Ridiculously Easy' },
      { id: 'lun9efxCveg', title: 'How to Use the Manual E6B Flight Computer' },
      { id: '7ESZcUCKieA', title: 'What is RAIM? — GPS for Pilots' },
    ],
  },

  // ─── Aerodynamics & Stalls ─────────────────────────────────────────────────
  {
    id: 'aerodynamics-stalls',
    title: 'Aerodynamics & Stalls',
    icon: '✈️',
    acsArea: 'PA.IV.D',
    desc: 'Lift, angle of attack, stall recognition & recovery, ground effect',
    videos: [
      { id: 'zw_KU5nENys', title: 'Private Pilot Aerodynamics — Full Review' },
      { id: 'AzSZIVEQAnQ', title: 'Airflow as Angle of Attack Changes' },
      { id: 'WFcW5-1NP60', title: 'Airflow During a Stall — Visualized' },
      { id: 'as-ynfxGOHs', title: 'Power-Off Stall Demo — Cessna 172' },
    ],
  },

  // ─── ADM & Human Factors ───────────────────────────────────────────────────
  {
    id: 'adm-human-factors',
    title: 'ADM & Human Factors',
    icon: '🧠',
    acsArea: 'PA.I.A',
    desc: 'PAVE/IM SAFE checklists, hazardous attitudes, hypoxia, disorientation',
    videos: [
      { id: 'fXwRu0FsjEQ', title: 'Aeronautical Decision Making (ADM)' },
      { id: 'pQiVosXauAk', title: 'Risk-Based ADM in 57 Seconds' },
      { id: 'NrSpKUssqbA', title: 'Aeromedical Factors for Pilots' },
      { id: 'Kh-2SSYhhbA', title: 'Dangers of Spatial Disorientation' },
    ],
  },

  // ─── Wake Turbulence ───────────────────────────────────────────────────────
  {
    id: 'wake-turbulence',
    title: 'Wake Turbulence & Traffic',
    icon: '🌀',
    acsArea: 'PA.III.B',
    desc: 'Wake vortices, avoidance techniques, traffic scanning & right-of-way',
    videos: [
      { id: 'qMpNThOKTuE', title: 'Avoiding Wake Turbulence — Takeoff & Landing' },
      { id: 'l8EwvDTJeNs', title: 'Helicopter Wake Turbulence Hazards' },
    ],
  },

  // ─── Airport Operations & ATC ──────────────────────────────────────────────
  {
    id: 'airport-atc',
    title: 'Airport Ops & ATC Communications',
    icon: '🏢',
    acsArea: 'PA.III.A',
    desc: 'Runway markings, light gun signals, radio phraseology, LAHSO',
    videos: [
      { id: 'wbOGCdChl7I', title: 'Airport Signage & Runway Markings' },
      { id: 'xuvtYzwznhE', title: 'Class D Tower Operations — Full Pattern' },
      { id: 'NAKAabmD2dA', title: "VFR Radio Communications — Sporty's Guide" },
      { id: 'yCfxT-M75LY', title: 'ATC Basic Phrases & Communications' },
    ],
  },

  // ─── Emergency Procedures ──────────────────────────────────────────────────
  {
    id: 'emergency',
    title: 'Emergency Procedures',
    icon: '🚨',
    acsArea: 'PA.IX.A',
    desc: 'Engine-out emergencies, forced landings, mayday calls',
    videos: [
      { id: 'wVXV6RCHbwA', title: 'Engine-Out Procedures Explained' },
      { id: 'Ox63vDht5k0', title: 'Forced Landing Procedures — Step by Step' },
    ],
  },
];

export const TOTAL_VIDEOS = VIDEO_TOPICS.reduce((sum, t) => sum + t.videos.length, 0);
