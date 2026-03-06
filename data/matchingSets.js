/**
 * Matching game data for the Airman Knowledge tab.
 *
 * Structure:
 *   matchingCategories: Array of { id, name, color, icon, sets }
 *   Each set: { id, name, pairs: [{ id, term, definition }] }
 *
 * Rules:
 *   - Exactly 3 sets per category
 *   - Exactly 8 pairs per set
 *   - Pair ids are unique within a set (used to match left/right columns)
 */

export const matchingCategories = [
  // ─── Airspace ─────────────────────────────────────────────────────────────
  {
    id: 'airspace',
    name: 'Airspace',
    icon: '✈',
    color: '#06b6d4',
    sets: [
      {
        id: 'airspace-classes',
        name: 'Airspace Classes',
        pairs: [
          { id: 1, term: 'Class A',   definition: 'FL180 to FL600 — IFR only, ATC clearance required' },
          { id: 2, term: 'Class B',   definition: 'Surrounding the busiest airports — clearance required' },
          { id: 3, term: 'Class C',   definition: 'Around airports with approach control — two-way radio required' },
          { id: 4, term: 'Class D',   definition: 'Around airports with a control tower — two-way radio required' },
          { id: 5, term: 'Class E',   definition: 'Controlled airspace not classified A, B, C, or D' },
          { id: 6, term: 'Class G',   definition: 'Uncontrolled airspace — no ATC clearance required' },
          { id: 7, term: 'MOA',       definition: 'Military Operations Area — military training, non-participating IFR aircraft separated' },
          { id: 8, term: 'Prohibited area', definition: 'Flight of aircraft is prohibited — e.g. P-56 over the White House' },
        ],
      },
      {
        id: 'airspace-vfr-minimums',
        name: 'VFR Weather Minimums',
        pairs: [
          { id: 1, term: 'Class B — visibility',   definition: '3 statute miles' },
          { id: 2, term: 'Class B — cloud clearance', definition: 'Clear of clouds' },
          { id: 3, term: 'Class C & D — visibility', definition: '3 statute miles' },
          { id: 4, term: 'Class C & D — cloud clearance', definition: '500 below, 1,000 above, 2,000 horizontal' },
          { id: 5, term: 'Class E below 10,000 MSL — visibility', definition: '3 statute miles' },
          { id: 6, term: 'Class E below 10,000 MSL — cloud clearance', definition: '500 below, 1,000 above, 2,000 horizontal' },
          { id: 7, term: 'Class G day, ≤1,200 AGL — visibility', definition: '1 statute mile' },
          { id: 8, term: 'Class G night, ≤1,200 AGL — visibility', definition: '3 statute miles' },
        ],
      },
      {
        id: 'airspace-altitudes',
        name: 'Altitude & Speed Rules',
        pairs: [
          { id: 1, term: 'Transition area floor',        definition: '700 ft AGL — where Class E extends down to meet airports' },
          { id: 2, term: 'Class E default floor',        definition: '1,200 ft AGL — where no lower designation exists' },
          { id: 3, term: 'Class A floor',                definition: 'FL180 (18,000 ft MSL)' },
          { id: 4, term: 'Speed limit below 10,000 MSL', definition: '250 knots IAS' },
          { id: 5, term: 'Speed limit in Class C or D',  definition: '200 knots IAS' },
          { id: 6, term: 'Speed limit under Class B',    definition: '200 knots IAS' },
          { id: 7, term: 'Cruising altitude VFR east (0°–179°)', definition: 'Odd thousands + 500 ft (3,500; 5,500…)' },
          { id: 8, term: 'Cruising altitude VFR west (180°–359°)', definition: 'Even thousands + 500 ft (4,500; 6,500…)' },
        ],
      },
    ],
  },

  // ─── Weather ───────────────────────────────────────────────────────────────
  {
    id: 'weather',
    name: 'Weather',
    icon: '⛅',
    color: '#60a5fa',
    sets: [
      {
        id: 'weather-metar-codes',
        name: 'METAR Sky & Present Weather',
        pairs: [
          { id: 1, term: 'FEW',   definition: '1–2 oktas (1/8–2/8) sky coverage' },
          { id: 2, term: 'SCT',   definition: '3–4 oktas (3/8–4/8) sky coverage' },
          { id: 3, term: 'BKN',   definition: '5–7 oktas (5/8–7/8) sky coverage' },
          { id: 4, term: 'OVC',   definition: '8 oktas — overcast, full sky coverage' },
          { id: 5, term: 'RA',    definition: 'Rain' },
          { id: 6, term: 'SN',    definition: 'Snow' },
          { id: 7, term: 'TS',    definition: 'Thunderstorm' },
          { id: 8, term: 'BR',    definition: 'Mist — visibility 5/8 to 6 SM' },
        ],
      },
      {
        id: 'weather-advisories',
        name: 'Weather Advisories',
        pairs: [
          { id: 1, term: 'SIGMET',        definition: 'Significant Meteorological Information — severe/extreme conditions' },
          { id: 2, term: 'Convective SIGMET', definition: 'Issued for severe thunderstorms, embedded TS, or tornado' },
          { id: 3, term: 'AIRMET Sierra', definition: 'IFR conditions and mountain obscuration' },
          { id: 4, term: 'AIRMET Tango',  definition: 'Turbulence, strong surface winds, low-level wind shear' },
          { id: 5, term: 'AIRMET Zulu',   definition: 'Icing and freezing levels' },
          { id: 6, term: 'PIREP',         definition: 'Pilot Report — actual in-flight conditions from a pilot' },
          { id: 7, term: 'TAF',           definition: 'Terminal Aerodrome Forecast — 24–30 hr airport forecast' },
          { id: 8, term: 'FA',            definition: 'Area Forecast — weather over a large geographic area' },
        ],
      },
      {
        id: 'weather-phenomena',
        name: 'Weather Phenomena',
        pairs: [
          { id: 1, term: 'Standard lapse rate',     definition: '2°C per 1,000 ft (3.5°F per 1,000 ft)' },
          { id: 2, term: 'Dew point spread closes', definition: '2–3°C or less — fog or low clouds likely' },
          { id: 3, term: 'Stable air characteristics', definition: 'Stratiform clouds, smooth air, poor visibility, steady precipitation' },
          { id: 4, term: 'Unstable air characteristics', definition: 'Cumuliform clouds, turbulent air, good visibility, showery precipitation' },
          { id: 5, term: 'Wind shear',              definition: 'Rapid change in wind speed or direction over a short distance' },
          { id: 6, term: 'Mountain wave',           definition: 'Standing wave downwind of a ridge — lenticular clouds form at crests' },
          { id: 7, term: 'Radiation fog',           definition: 'Ground cools overnight, air near surface reaches dew point' },
          { id: 8, term: 'Advection fog',           definition: 'Warm moist air moves over a cooler surface — common along coasts' },
        ],
      },
    ],
  },

  // ─── ATC Phraseology ───────────────────────────────────────────────────────
  {
    id: 'atc',
    name: 'ATC Phraseology',
    icon: '📡',
    color: '#38bdf8',
    sets: [
      {
        id: 'atc-clearances',
        name: 'Clearance Components',
        pairs: [
          { id: 1, term: 'Cleared to',       definition: 'Destination airport or clearance limit' },
          { id: 2, term: 'Via',              definition: 'Route of flight (airways, fixes, direct)' },
          { id: 3, term: 'Maintain',         definition: 'Assigned altitude — fly at and stay at this altitude' },
          { id: 4, term: 'Expect',           definition: 'Advisory altitude to plan for — not a clearance to climb/descend' },
          { id: 5, term: 'Departure frequency', definition: 'Frequency to contact after takeoff' },
          { id: 6, term: 'Squawk',           definition: 'Transponder code assignment' },
          { id: 7, term: 'Void time',        definition: 'IFR clearance expires if not airborne by this time' },
          { id: 8, term: 'CRAFT',            definition: 'Clearance, Route, Altitude, Frequency, Transponder — memory aid' },
        ],
      },
      {
        id: 'atc-terminology',
        name: 'Standard Terminology',
        pairs: [
          { id: 1, term: 'Roger',         definition: 'I have received all of your last transmission' },
          { id: 2, term: 'Wilco',         definition: 'I understand and will comply' },
          { id: 3, term: 'Affirmative',   definition: 'Yes' },
          { id: 4, term: 'Negative',      definition: 'No, or permission not granted' },
          { id: 5, term: 'Say again',     definition: 'Repeat your last transmission' },
          { id: 6, term: 'Standby',       definition: 'I must pause for a few seconds — wait for me' },
          { id: 7, term: 'Ident',         definition: 'Activate the special identification feature of the transponder' },
          { id: 8, term: 'Niner',         definition: 'Spoken digit for 9 — avoids confusion with German "nein" (no)' },
        ],
      },
      {
        id: 'atc-transponder',
        name: 'Transponder Codes',
        pairs: [
          { id: 1, term: '1200',  definition: 'VFR flight — discrete code not assigned' },
          { id: 2, term: '7500',  definition: 'Hijacking in progress' },
          { id: 3, term: '7600',  definition: 'Lost communications' },
          { id: 4, term: '7700',  definition: 'Emergency' },
          { id: 5, term: 'ALT',   definition: 'Mode C — transmits pressure altitude to ATC' },
          { id: 6, term: 'SBY',   definition: 'Standby — transponder warm but not replying to interrogations' },
          { id: 7, term: 'ADS-B Out', definition: 'Required in Class A, B, C airspace and above 10,000 MSL' },
          { id: 8, term: 'TCAS',  definition: 'Traffic Collision Avoidance System — issues resolution advisories' },
        ],
      },
    ],
  },

  // ─── Regulations ──────────────────────────────────────────────────────────
  {
    id: 'regulations',
    name: 'Regulations',
    icon: '📖',
    color: '#a78bfa',
    sets: [
      {
        id: 'regulations-far',
        name: 'Key FARs',
        pairs: [
          { id: 1, term: 'FAR 61.3',   definition: 'Requirement for certificates, ratings, and photo ID' },
          { id: 2, term: 'FAR 61.23',  definition: 'Medical certificate requirements and durations' },
          { id: 3, term: 'FAR 61.57',  definition: 'Recent flight experience requirements' },
          { id: 4, term: 'FAR 91.3',   definition: 'Pilot in command responsibility and authority' },
          { id: 5, term: 'FAR 91.7',   definition: 'Civil aircraft airworthiness — PIC must ensure' },
          { id: 6, term: 'FAR 91.103', definition: 'Preflight action — review all available information' },
          { id: 7, term: 'FAR 91.119', definition: 'Minimum safe altitudes (congested = 1,000 ft, others = 500 ft)' },
          { id: 8, term: 'FAR 91.151', definition: 'Fuel requirements for VFR flight (30 min day, 45 min night reserve)' },
        ],
      },
      {
        id: 'regulations-equipment',
        name: 'Required Equipment',
        pairs: [
          { id: 1, term: 'A-TOMATO FLAMES', definition: 'VFR day equipment memory aid' },
          { id: 2, term: 'FLAPS',           definition: 'Night VFR additions — Fuses, Landing light, Anti-collision, Position, Source (electrical)' },
          { id: 3, term: 'Altimeter',       definition: 'Required for VFR — must be set to local altimeter setting' },
          { id: 4, term: 'ELT',             definition: 'Emergency Locator Transmitter — required except for ferry, test, or display flights' },
          { id: 5, term: 'Annual inspection', definition: 'Required every 12 calendar months — FAR 91.409' },
          { id: 6, term: '100-hour inspection', definition: 'Required for hire operations — FAR 91.409(b)' },
          { id: 7, term: 'VOR check',       definition: 'Required every 30 days for IFR flight — logged in aircraft records' },
          { id: 8, term: 'Transponder check', definition: 'Required every 24 calendar months — FAR 91.413' },
        ],
      },
      {
        id: 'regulations-currency',
        name: 'Currency & Certificates',
        pairs: [
          { id: 1, term: '3 takeoffs & landings',  definition: 'Currency requirement to carry passengers — within 90 days' },
          { id: 2, term: 'Night currency',         definition: '3 takeoffs/landings to a full stop between 1 hour after sunset and 1 hour before sunrise' },
          { id: 3, term: 'Flight review',          definition: 'Required every 24 calendar months — 1 hr ground, 1 hr flight minimum' },
          { id: 4, term: '3rd class medical',      definition: 'Valid 60 months under age 40, 24 months at age 40 and over' },
          { id: 5, term: '2nd class medical',      definition: 'Valid 12 months for commercial privileges' },
          { id: 6, term: '1st class medical',      definition: 'Valid 12 months under age 40, 6 months at age 40 and over for ATP' },
          { id: 7, term: 'Student pilot solo XC',  definition: 'Requires instructor endorsement within 90 days' },
          { id: 8, term: 'BasicMed',               definition: 'Alternative to medical — requires AOPA online course every 24 months + physician visit every 48 months' },
        ],
      },
    ],
  },

  // ─── Instruments ──────────────────────────────────────────────────────────
  {
    id: 'instruments',
    name: 'Instruments',
    icon: '🎛',
    color: '#34d399',
    sets: [
      {
        id: 'instruments-six-pack',
        name: 'The Six Pack',
        pairs: [
          { id: 1, term: 'Airspeed Indicator', definition: 'Pitot-static — measures impact pressure vs. ambient pressure' },
          { id: 2, term: 'Attitude Indicator',  definition: 'Gyroscopic — shows pitch and bank relative to artificial horizon' },
          { id: 3, term: 'Altimeter',           definition: 'Pitot-static — measures absolute pressure to show altitude MSL' },
          { id: 4, term: 'Turn Coordinator',    definition: 'Gyroscopic — shows rate of turn and coordination (ball)' },
          { id: 5, term: 'Heading Indicator',   definition: 'Gyroscopic — shows magnetic heading; must be set to compass' },
          { id: 6, term: 'VSI',                 definition: 'Pitot-static — shows rate of climb/descent in fpm; lags 6–9 seconds' },
          { id: 7, term: 'Pitot tube',          definition: 'Collects ram air for airspeed indicator; heated to prevent icing' },
          { id: 8, term: 'Static port',         definition: 'Senses ambient pressure for altimeter, ASI, and VSI' },
        ],
      },
      {
        id: 'instruments-vspeeds',
        name: 'V-Speeds',
        pairs: [
          { id: 1, term: 'Vso', definition: 'Stall speed in landing configuration — bottom of white arc' },
          { id: 2, term: 'Vs1', definition: 'Stall speed in clean configuration — bottom of green arc' },
          { id: 3, term: 'Vfe', definition: 'Maximum flap extended speed — top of white arc' },
          { id: 4, term: 'Vno', definition: 'Normal operating (max structural cruise) speed — top of green arc' },
          { id: 5, term: 'Vne', definition: 'Never-exceed speed — top of red arc' },
          { id: 6, term: 'Va',  definition: 'Maneuvering speed — max speed for full control deflection' },
          { id: 7, term: 'Vx',  definition: 'Best angle of climb — greatest altitude gain per distance' },
          { id: 8, term: 'Vy',  definition: 'Best rate of climb — greatest altitude gain per time' },
        ],
      },
      {
        id: 'instruments-errors',
        name: 'Instrument Errors',
        pairs: [
          { id: 1, term: 'Magnetic dip error',      definition: 'Compass error in turns — UNOS: undershoot N, overshoot S' },
          { id: 2, term: 'Acceleration error',      definition: 'Compass shows turn when accelerating on E/W headings — ANDS' },
          { id: 3, term: 'Gyroscopic precession',   definition: 'Applied force on a gyro acts 90° ahead in direction of rotation' },
          { id: 4, term: 'Attitude indicator error', definition: 'Precesses up to 3°/hr — re-align to compass in straight/level flight' },
          { id: 5, term: 'Blocked pitot tube',      definition: 'Airspeed reads zero (or like an altimeter if drain hole also blocked)' },
          { id: 6, term: 'Blocked static port',     definition: 'Altimeter freezes, VSI reads zero, ASI reads erroneously' },
          { id: 7, term: 'Alternate static source', definition: 'Inside cabin — slightly lower pressure → altimeter reads high' },
          { id: 8, term: 'Density altitude effect', definition: 'High DA = aircraft performs as if at higher altitude — longer takeoff roll' },
        ],
      },
    ],
  },

  // ─── Navigation ────────────────────────────────────────────────────────────
  {
    id: 'navigation',
    name: 'Navigation',
    icon: '🧭',
    color: '#f59e0b',
    sets: [
      {
        id: 'navigation-sectional',
        name: 'Sectional Chart Symbols',
        pairs: [
          { id: 1, term: 'Blue airport symbol',   definition: 'Airport with control tower' },
          { id: 2, term: 'Magenta airport symbol', definition: 'Airport without control tower' },
          { id: 3, term: 'Solid blue line',        definition: 'Class B airspace boundary' },
          { id: 4, term: 'Solid magenta line',     definition: 'Class C airspace boundary' },
          { id: 5, term: 'Dashed blue line',       definition: 'Class D airspace boundary' },
          { id: 6, term: 'Dashed magenta line',    definition: 'Class E airspace starting at 700 ft AGL' },
          { id: 7, term: 'Victor airway',          definition: 'Low-altitude airway — V + number, 1,200 ft AGL to FL180' },
          { id: 8, term: 'MEF (Maximum Elevation Figure)', definition: 'Highest obstacle in quadrant + 100 ft (or 200 ft for man-made)' },
        ],
      },
      {
        id: 'navigation-vor',
        name: 'VOR & Navigation',
        pairs: [
          { id: 1, term: 'Radial',            definition: 'Magnetic bearing FROM a VOR station (360 radials total)' },
          { id: 2, term: 'OBS',               definition: 'Omni Bearing Selector — dial that sets the course to track' },
          { id: 3, term: 'CDI',               definition: 'Course Deviation Indicator — needle deflects to show left/right of course' },
          { id: 4, term: 'TO flag',           definition: 'Station is ahead — fly the OBS setting to reach the station' },
          { id: 5, term: 'FROM flag',         definition: 'Station is behind — OBS setting is the radial you are on' },
          { id: 6, term: 'Full CDI deflection', definition: '10° from course (most VORs) — 5 dots × 2°' },
          { id: 7, term: 'VORTAK',            definition: 'VOR + TACAN collocated — provides VOR and UHF DME' },
          { id: 8, term: 'DME arc',           definition: 'Path of constant distance from a VORTAC — flown with repeated intercepts' },
        ],
      },
      {
        id: 'navigation-performance',
        name: 'Performance & Weight/Balance',
        pairs: [
          { id: 1, term: 'Density altitude', definition: 'Pressure altitude corrected for non-standard temperature' },
          { id: 2, term: 'Pressure altitude', definition: 'Altimeter reading with 29.92 in Hg set' },
          { id: 3, term: 'True altitude',     definition: 'Actual height above mean sea level' },
          { id: 4, term: 'Indicated altitude', definition: 'Altimeter reading with local altimeter setting' },
          { id: 5, term: 'CG',               definition: 'Center of Gravity — must remain within forward and aft limits' },
          { id: 6, term: 'Moment',           definition: 'Weight × Arm (lever arm from datum)' },
          { id: 7, term: 'Gross weight',     definition: 'Total weight of aircraft — must not exceed MTOW for departure' },
          { id: 8, term: 'Stall speed and load factor', definition: 'Stall speed increases with square root of load factor (60° bank = 2G = Vs × √2)' },
        ],
      },
    ],
  },
];

/** Total number of matching sets across all categories */
export const TOTAL_SETS = matchingCategories.reduce((sum, cat) => sum + cat.sets.length, 0);

/** Flat list of all sets with category info attached */
export const allMatchingSets = matchingCategories.flatMap(cat =>
  cat.sets.map(set => ({ ...set, categoryId: cat.id, categoryName: cat.name, color: cat.color }))
);
