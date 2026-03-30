/**
 * @fileoverview FAA Part 107 (Remote Pilot – Small Unmanned Aircraft Systems)
 * knowledge test question bank.
 *
 * ACS codes follow the pattern:  UA.<RomanNumeral>.<Task>.<KnowledgeElement>
 * Questions are based on 14 CFR Part 107, FAA-CT-8080-2 (UAG), and related
 * FAA guidance materials.
 */

/** @type {Array<import('../lib/validators').ParQuestion>} */
export const part107Questions = [

  // ─── UA.I  Applicable Regulations ─────────────────────────────────────────

  {
    id: 1,
    question: 'Under 14 CFR Part 107, what is the maximum groundspeed allowed for a small unmanned aircraft system (sUAS) during operations?',
    figures: [],
    options: [
      { letter: 'A', text: '87 knots (100 mph)', correct: true },
      { letter: 'B', text: '100 knots (115 mph)', correct: false },
      { letter: 'C', text: '55 knots (63 mph)', correct: false },
    ],
    explanation: 'Under 14 CFR 107.51(a), a remote pilot may not operate an sUAS at a groundspeed exceeding 87 knots (100 mph). This limit is intended to reduce collision risk and give the remote pilot adequate reaction time.',
    acsCode: 'UA.I.B.K1',
  },

  {
    id: 2,
    question: 'Under Part 107, what is the maximum altitude at which a small UAS may be operated above ground level (AGL) in uncontrolled airspace?',
    figures: [],
    options: [
      { letter: 'A', text: '500 ft AGL', correct: false },
      { letter: 'B', text: '400 ft AGL', correct: true },
      { letter: 'C', text: '1,200 ft AGL', correct: false },
    ],
    explanation: 'Per 14 CFR 107.51(b), operations may not exceed 400 ft AGL unless the sUAS is flown within a 400-ft radius of a structure and does not fly higher than 400 ft above that structure\'s immediate uppermost limit.',
    acsCode: 'UA.I.B.K1',
  },

  {
    id: 3,
    question: 'A remote pilot in command (RPIC) wishes to operate a 60-pound sUAS for a commercial aerial photography job. Under Part 107, which of the following is correct?',
    figures: [],
    options: [
      { letter: 'A', text: 'Operations are permitted because the aircraft weighs less than 55 kg.', correct: false },
      { letter: 'B', text: 'Operations are not permitted under Part 107 because the aircraft exceeds the 55-lb limit.', correct: true },
      { letter: 'C', text: 'Operations are permitted with a COA from the FAA.', correct: false },
    ],
    explanation: 'Part 107 applies to sUAS weighing less than 55 pounds (including payload) at takeoff. A 60-lb aircraft exceeds this limit and cannot be operated under Part 107; the operator would need to seek an exemption under 14 CFR 91.1 or apply for a special airworthiness certificate.',
    acsCode: 'UA.I.A.K1',
  },

  {
    id: 4,
    question: 'Under Part 107, how long before a remote pilot may resume operations after consuming alcohol?',
    figures: [],
    options: [
      { letter: 'A', text: '4 hours', correct: false },
      { letter: 'B', text: '8 hours', correct: true },
      { letter: 'C', text: '12 hours', correct: false },
    ],
    explanation: 'Per 14 CFR 107.57, a person may not act as a remote pilot within 8 hours of consuming alcohol, while having a blood alcohol concentration of 0.04% or greater, while under the influence of alcohol, or while using any drug that affects the person\'s faculties. The "8 hours bottle to throttle" rule mirrors the manned aircraft standard in 14 CFR 91.17.',
    acsCode: 'UA.I.C.K1',
  },

  {
    id: 5,
    question: 'Which of the following actions must a remote pilot take if an sUAS operation results in serious injury to any person or causes property damage of at least $500?',
    figures: [],
    options: [
      { letter: 'A', text: 'File a report with the FAA within 10 days of the accident.', correct: true },
      { letter: 'B', text: 'File a report with the NTSB within 48 hours of the accident.', correct: false },
      { letter: 'C', text: 'Notify local law enforcement immediately.', correct: false },
    ],
    explanation: 'Under 14 CFR 107.9, a remote pilot in command must report an accident to the FAA within 10 calendar days when the operation results in at least serious injury to any person, loss of consciousness, or property damage (other than to the UAS itself) of at least $500.',
    acsCode: 'UA.I.D.K1',
  },

  {
    id: 6,
    question: 'A remote pilot must have their remote pilot certificate available during sUAS operations. Under Part 107, what is the correct way to comply with this requirement?',
    figures: [],
    options: [
      { letter: 'A', text: 'The certificate must be physically present at the location of the operation or on the pilot\'s person.', correct: true },
      { letter: 'B', text: 'The certificate number must be painted on the aircraft.', correct: false },
      { letter: 'C', text: 'A digital photo of the certificate stored on a phone is sufficient.', correct: false },
    ],
    explanation: 'Per 14 CFR 107.7, a remote pilot must present the remote pilot certificate and any medical certificate when requested by the FAA or law enforcement. The physical certificate (or a digital copy accepted by the FAA) must be available at the control station.',
    acsCode: 'UA.I.A.K2',
  },

  {
    id: 7,
    question: 'Under Part 107, which of the following operations requires a waiver from the FAA?',
    figures: [],
    options: [
      { letter: 'A', text: 'Operating at night with anti-collision lighting visible for 3 statute miles.', correct: false },
      { letter: 'B', text: 'Operating from a moving vehicle in a sparsely populated area.', correct: false },
      { letter: 'C', text: 'Operating beyond visual line of sight (BVLOS).', correct: true },
    ],
    explanation: 'Part 107.31 requires the remote pilot and visual observer to maintain visual line of sight (VLOS) with the sUAS at all times. Flying BVLOS is a prohibited operation under standard Part 107 rules and requires an FAA-issued waiver (107.200). Night operations no longer require a waiver as long as the aircraft has anti-collision lighting visible for 3 SM.',
    acsCode: 'UA.I.B.K2',
  },

  {
    id: 8,
    question: 'Under 14 CFR Part 107, a remote pilot in command must ensure the unmanned aircraft is registered if it weighs more than:',
    figures: [],
    options: [
      { letter: 'A', text: '0.55 pounds (250 grams)', correct: true },
      { letter: 'B', text: '1.0 pound (453 grams)', correct: false },
      { letter: 'C', text: '55 pounds (25 kg)', correct: false },
    ],
    explanation: 'Under 14 CFR Part 48, sUAS weighing more than 0.55 lb (250 g) and less than 55 lb must be registered with the FAA before flight. The registration number must be marked on the aircraft and available for inspection.',
    acsCode: 'UA.I.A.K3',
  },

  {
    id: 9,
    question: 'Part 107 permits a remote pilot to operate an sUAS from a moving vehicle when:',
    figures: [],
    options: [
      { letter: 'A', text: 'The vehicle is traveling at less than 25 mph.', correct: false },
      { letter: 'B', text: 'The operation is over a sparsely populated area.', correct: true },
      { letter: 'C', text: 'The vehicle has hazard lights activated.', correct: false },
    ],
    explanation: 'Per 14 CFR 107.25, operating an sUAS from a moving land or water-borne vehicle is only permitted over a sparsely populated area. Operations from moving aircraft are never permitted under Part 107.',
    acsCode: 'UA.I.B.K3',
  },

  {
    id: 10,
    question: 'Under Part 107, what minimum flight visibility is required at the sUAS control station during operations?',
    figures: [],
    options: [
      { letter: 'A', text: '1 statute mile', correct: false },
      { letter: 'B', text: '3 statute miles', correct: true },
      { letter: 'C', text: '5 statute miles', correct: false },
    ],
    explanation: 'Per 14 CFR 107.51(c), the remote pilot in command must maintain a minimum ground visibility of 3 statute miles at the control station. This is measured as prevailing visibility, the same standard used in aviation weather reports.',
    acsCode: 'UA.I.B.K4',
  },

  {
    id: 11,
    question: 'Under Part 107, what is the minimum distance a sUAS must maintain from clouds?',
    figures: [],
    options: [
      { letter: 'A', text: '500 ft below and 2,000 ft horizontally', correct: true },
      { letter: 'B', text: '1,000 ft below and 1,000 ft horizontally', correct: false },
      { letter: 'C', text: 'Clear of clouds only', correct: false },
    ],
    explanation: 'Per 14 CFR 107.51(d), an sUAS must remain at least 500 ft below and 2,000 ft horizontally from clouds. These minimums are identical to the Class G daytime requirements for manned aircraft and ensure separation from IFR traffic descending through cloud bases.',
    acsCode: 'UA.I.B.K4',
  },

  {
    id: 12,
    question: 'A remote pilot is operating an sUAS and a manned aircraft enters the area. Under Part 107, the remote pilot must:',
    figures: [],
    options: [
      { letter: 'A', text: 'Land immediately if the manned aircraft is below 500 ft AGL.', correct: false },
      { letter: 'B', text: 'Yield right of way to the manned aircraft.', correct: true },
      { letter: 'C', text: 'Maintain altitude and notify the aircraft by radio.', correct: false },
    ],
    explanation: 'Per 14 CFR 107.37, the remote pilot must yield the right of way to all manned aircraft. The sUAS may not be operated in a manner that creates a collision hazard with any aircraft.',
    acsCode: 'UA.I.B.K5',
  },

  // ─── UA.II  Airspace Classification & Requirements ─────────────────────────

  {
    id: 13,
    question: 'A remote pilot wants to fly an sUAS at 300 ft AGL within the lateral boundaries of Class D airspace. Under Part 107, what must the remote pilot do before beginning operations?',
    figures: [],
    options: [
      { letter: 'A', text: 'File a NOTAM with the FAA.', correct: false },
      { letter: 'B', text: 'Obtain authorization from ATC.', correct: true },
      { letter: 'C', text: 'Notify the local airport manager.', correct: false },
    ],
    explanation: 'Part 107.41 prohibits sUAS operations in Class B, C, D, and surface Class E airspace without ATC authorization. Pilots can use FAA\'s Low Altitude Authorization and Notification Capability (LAANC) system for near real-time authorization in many areas.',
    acsCode: 'UA.II.A.K1',
  },

  {
    id: 14,
    question: 'In which class of airspace is a remote pilot NOT permitted to operate an sUAS under Part 107, regardless of any authorization?',
    figures: [],
    options: [
      { letter: 'A', text: 'Class B', correct: false },
      { letter: 'B', text: 'Class E', correct: false },
      { letter: 'C', text: 'Class A', correct: true },
    ],
    explanation: 'Class A airspace begins at 18,000 ft MSL and extends to FL600. It is entirely IFR airspace and sUAS operations are never permitted there. Class B, C, D, and surface E require ATC authorization; Class G requires no authorization.',
    acsCode: 'UA.II.A.K2',
  },

  {
    id: 15,
    question: 'An sUAS remote pilot notices a Temporary Flight Restriction (TFR) in the area of intended operations. Which statement is correct?',
    figures: [],
    options: [
      { letter: 'A', text: 'sUAS are exempt from TFRs because they fly below 400 ft AGL.', correct: false },
      { letter: 'B', text: 'The remote pilot must comply with all TFR restrictions unless issued a specific exemption.', correct: true },
      { letter: 'C', text: 'TFRs only apply to manned aircraft operating under IFR.', correct: false },
    ],
    explanation: 'TFRs issued under 14 CFR 91.137, 91.138, 91.141, and 91.145 apply to all aircraft including sUAS. Remote pilots must check for active TFRs before operations using tools such as the FAA\'s B4UFLY app, NOTAM system, or 1800wxbrief.com.',
    acsCode: 'UA.II.B.K1',
  },

  {
    id: 16,
    question: 'Which FAA system allows remote pilots to quickly obtain airspace authorization to operate in controlled airspace in areas where the FAA has pre-approved altitudes?',
    figures: [],
    options: [
      { letter: 'A', text: 'NOTAM system', correct: false },
      { letter: 'B', text: 'LAANC (Low Altitude Authorization and Notification Capability)', correct: true },
      { letter: 'C', text: 'DroneZone portal', correct: false },
    ],
    explanation: 'LAANC is an FAA system that provides near real-time automated authorization for remote pilots to operate in controlled airspace at or below pre-approved altitudes (depicted on LAANC-enabled UAS Facility Maps). DroneZone is used for manual waiver/authorization applications when LAANC is unavailable.',
    acsCode: 'UA.II.A.K3',
  },

  {
    id: 17,
    question: 'Class B airspace typically extends from the surface to what upper limit?',
    figures: [],
    options: [
      { letter: 'A', text: '10,000 ft MSL', correct: true },
      { letter: 'B', text: '4,000 ft AGL', correct: false },
      { letter: 'C', text: '18,000 ft MSL', correct: false },
    ],
    explanation: 'Class B airspace surrounds the nation\'s busiest airports and typically extends from the surface to 10,000 ft MSL in layers. It has a generally upside-down wedding cake shape. All aircraft, including sUAS, need ATC clearance to operate within Class B without a waiver.',
    acsCode: 'UA.II.A.K2',
  },

  {
    id: 18,
    question: 'A remote pilot plans to operate near a stadium during a college football game. What airspace restriction is likely in effect?',
    figures: [],
    options: [
      { letter: 'A', text: 'A Notice to Air Missions (NOTAM) TFR extends 3 NM and 3,000 ft AGL for one hour before and after the game.', correct: true },
      { letter: 'B', text: 'Only Class D restrictions apply; no TFR is needed.', correct: false },
      { letter: 'C', text: 'No restriction applies to sUAS since they fly below 400 ft AGL.', correct: false },
    ],
    explanation: 'Per 14 CFR 91.145, a TFR is established for large sporting events within a 3 NM radius up to 3,000 ft AGL, starting 1 hour before and ending 1 hour after the event. This applies to all aircraft, including sUAS. Remote pilots must check NOTAMs before any flight near stadiums.',
    acsCode: 'UA.II.B.K2',
  },

  // ─── UA.III  Weather & Weather Services ───────────────────────────────────

  {
    id: 19,
    question: 'Which aviation weather product provides observed surface weather conditions at an airport, including wind direction and speed, visibility, sky conditions, temperature, dewpoint, and altimeter setting?',
    figures: [],
    options: [
      { letter: 'A', text: 'TAF (Terminal Aerodrome Forecast)', correct: false },
      { letter: 'B', text: 'METAR (Meteorological Aerodrome Report)', correct: true },
      { letter: 'C', text: 'SIGMET (Significant Meteorological Information)', correct: false },
    ],
    explanation: 'A METAR is a routine weather observation issued at least once per hour that reports current surface conditions at an airport: wind, visibility, sky conditions, temperature, dewpoint, and altimeter setting. A TAF provides a 24- or 30-hour forecast. SIGMETs warn of significant en-route hazards.',
    acsCode: 'UA.III.A.K1',
  },

  {
    id: 20,
    question: 'What does the term "density altitude" describe, and how does it affect sUAS performance?',
    figures: [],
    options: [
      { letter: 'A', text: 'Density altitude is pressure altitude corrected for nonstandard temperature. High density altitude reduces sUAS lift and motor efficiency.', correct: true },
      { letter: 'B', text: 'Density altitude equals the MSL elevation of the flight area and has no effect on sUAS.', correct: false },
      { letter: 'C', text: 'Density altitude increases battery life because cooler air is denser.', correct: false },
    ],
    explanation: 'Density altitude is pressure altitude corrected for nonstandard temperature. High density altitude (hot, humid, high-elevation conditions) means less dense air, reducing propeller and rotor efficiency. An sUAS that performs well at sea level on a cool day may have degraded hover performance and reduced payload capacity at high-altitude or high-temperature locations.',
    acsCode: 'UA.III.B.K1',
  },

  {
    id: 21,
    question: 'A METAR for a nearby airport shows winds as 270° at 18 knots gusting to 30 knots. What does this mean for sUAS operations?',
    figures: [],
    options: [
      { letter: 'A', text: 'Wind is from 270° (west) at 18 knots with gusts to 30 knots; the gusts may reduce flight time and challenge controllability.', correct: true },
      { letter: 'B', text: 'Wind is toward 270° at 18 knots; gusts are beneficial to lift.', correct: false },
      { letter: 'C', text: 'Wind at 30 knots is below Part 107 limits, so no special consideration is needed.', correct: false },
    ],
    explanation: 'Weather reports express wind direction as the direction FROM which the wind is blowing relative to true north. 270° = from the west. Gusty conditions can stress the flight control system and reduce battery endurance significantly. The remote pilot must assess whether conditions are within the sUAS manufacturer\'s operating limits.',
    acsCode: 'UA.III.A.K2',
  },

  {
    id: 22,
    question: 'Which condition is associated with the greatest hazard to sUAS operations?',
    figures: [],
    options: [
      { letter: 'A', text: 'Clear skies and calm winds at sunset', correct: false },
      { letter: 'B', text: 'Rapidly building convective (cumulonimbus) clouds', correct: true },
      { letter: 'C', text: 'Scattered cumulus clouds at 3,000 ft AGL', correct: false },
    ],
    explanation: 'Cumulonimbus (CB) clouds indicate active thunderstorm activity with associated hazards including severe turbulence, wind shear, hail, lightning, and heavy precipitation. These conditions are extremely dangerous and can quickly overwhelm or destroy an sUAS. Remote pilots must not fly near developing or active thunderstorms.',
    acsCode: 'UA.III.C.K1',
  },

  {
    id: 23,
    question: 'How does high relative humidity affect sUAS battery and motor performance?',
    figures: [],
    options: [
      { letter: 'A', text: 'High humidity has no effect on sUAS performance.', correct: false },
      { letter: 'B', text: 'High humidity can reduce battery capacity and cause motor overheating due to reduced cooling efficiency.', correct: true },
      { letter: 'C', text: 'High humidity increases air density, improving lift.', correct: false },
    ],
    explanation: 'Moist air is actually less dense than dry air at the same pressure and temperature (water vapor displaces heavier nitrogen and oxygen molecules). High humidity reduces air density (raises density altitude), decreasing rotor efficiency. Moisture can also corrode electrical connections, reduce battery capacity, and impede cooling airflow through motor windings.',
    acsCode: 'UA.III.B.K2',
  },

  {
    id: 24,
    question: 'Which weather phenomenon creates an invisible hazard of most concern to low-altitude sUAS operations?',
    figures: [],
    options: [
      { letter: 'A', text: 'Surface fog limiting visibility', correct: false },
      { letter: 'B', text: 'Wind shear and microbursts near convective activity', correct: true },
      { letter: 'C', text: 'High cloud bases above 6,000 ft AGL', correct: false },
    ],
    explanation: 'Wind shear — a sudden change in wind direction or speed over a short distance — is particularly hazardous because it is often invisible. Microbursts (intense downdrafts) from thunderstorms can produce wind shear strong enough to overwhelm an sUAS flight controller or rapidly drain the battery. Surface fog is visible and would prevent operations under the 3 SM visibility minimum.',
    acsCode: 'UA.III.C.K2',
  },

  // ─── UA.IV  Loading & Performance ─────────────────────────────────────────

  {
    id: 25,
    question: 'How does adding payload weight to a multirotor sUAS affect its flight performance?',
    figures: [],
    options: [
      { letter: 'A', text: 'Additional weight increases stability and extends battery life.', correct: false },
      { letter: 'B', text: 'Additional weight requires motors to work harder, reducing flight time and maximum altitude.', correct: true },
      { letter: 'C', text: 'Payload weight only affects fixed-wing sUAS, not multirotors.', correct: false },
    ],
    explanation: 'Increasing total aircraft weight requires rotors to generate more thrust to maintain hover, which draws more current from the battery. This reduces total available flight time and the aircraft\'s ability to maintain altitude in thin air. The remote pilot must calculate that the total weight (aircraft + payload) remains below 55 lb and within the manufacturer\'s specified maximum takeoff weight.',
    acsCode: 'UA.IV.A.K1',
  },

  {
    id: 26,
    question: 'A remote pilot notices that the sUAS battery appears swollen (puffed). What is the correct action?',
    figures: [],
    options: [
      { letter: 'A', text: 'Fly with the battery but monitor voltage closely during the flight.', correct: false },
      { letter: 'B', text: 'Do not fly; a swollen LiPo battery is a fire and safety hazard.', correct: true },
      { letter: 'C', text: 'Puncture the battery to release internal pressure before flight.', correct: false },
    ],
    explanation: 'Lithium polymer (LiPo) batteries swell when cells are damaged, over-discharged, or have internal shorts. A swollen battery is at risk of thermal runaway, fire, or explosion — especially under the stress of flight discharge rates. The battery must be removed from service, stored in a fireproof bag, and disposed of per the manufacturer\'s guidance. Never puncture a LiPo battery.',
    acsCode: 'UA.IV.B.K1',
  },

  {
    id: 27,
    question: 'Under what conditions will an sUAS have the longest possible flight time?',
    figures: [],
    options: [
      { letter: 'A', text: 'Hot, humid, high-altitude conditions with a full payload', correct: false },
      { letter: 'B', text: 'Cool, dry conditions at low altitude with minimal payload', correct: true },
      { letter: 'C', text: 'Cold temperatures below freezing improve battery efficiency', correct: false },
    ],
    explanation: 'Cool, dry air at low altitude is denser, reducing rotor workload and current draw. Low payload weight further reduces the thrust required. Very cold temperatures actually degrade LiPo battery capacity, so there is an optimal temperature range. The combination of low density altitude and light weight yields maximum endurance.',
    acsCode: 'UA.IV.A.K2',
  },

  // ─── UA.V  Emergency Procedures ───────────────────────────────────────────

  {
    id: 28,
    question: 'During flight, a remote pilot loses orientation of the sUAS and cannot determine its position or heading. What is the recommended first action?',
    figures: [],
    options: [
      { letter: 'A', text: 'Immediately activate the "Return to Home" feature if available, or hover in place while regaining orientation.', correct: true },
      { letter: 'B', text: 'Fly the aircraft in a wide circle to locate it visually.', correct: false },
      { letter: 'C', text: 'Increase altitude to 400 ft to get a better visual.', correct: false },
    ],
    explanation: 'Loss of orientation (spatial disorientation) is one of the most common causes of sUAS accidents. If the aircraft has a Return to Home (RTH) function, activating it allows the autopilot to navigate back to the launch point. If not, the pilot should command a hover, attempt to use visual cues or the heads-up display to re-establish orientation, and descend carefully. Climbing without visual contact risks entering controlled airspace or losing the aircraft entirely.',
    acsCode: 'UA.V.A.K1',
  },

  {
    id: 29,
    question: 'A remote pilot experiences a fly-away where the sUAS flies beyond the control link range. What immediate action best mitigates risk to people on the ground?',
    figures: [],
    options: [
      { letter: 'A', text: 'Notify the FAA and wait for the aircraft to return.', correct: false },
      { letter: 'B', text: 'Attempt to reconnect the control link while ensuring bystanders clear the area below the aircraft\'s last known track.', correct: true },
      { letter: 'C', text: 'Use a second remote controller to intercept the signal.', correct: false },
    ],
    explanation: 'During a fly-away, the remote pilot\'s primary duty is to protect people on the ground. This means alerting anyone below or near the expected trajectory to move clear while simultaneously attempting to recover the link. Most modern sUAS have a programmed failsafe (RTH or land) that activates on link loss. The pilot should report the accident to the FAA if the aircraft causes property damage exceeding $500 or results in injury.',
    acsCode: 'UA.V.B.K1',
  },

  {
    id: 30,
    question: 'A remote pilot discovers a radio frequency (RF) interference problem that causes erratic control response during a pre-flight check. The correct action is to:',
    figures: [],
    options: [
      { letter: 'A', text: 'Proceed with flight since the interference may clear once airborne.', correct: false },
      { letter: 'B', text: 'Cancel or postpone the flight and investigate the source of interference.', correct: true },
      { letter: 'C', text: 'Switch to a backup frequency and launch immediately.', correct: false },
    ],
    explanation: 'RF interference can cause loss of control or unexpected behavior. Pre-flight detection is an opportunity to avoid an in-flight emergency. The remote pilot must not commence flight until the root cause is identified and eliminated. Investigating nearby RF sources (other remote controllers, cell towers, jamming devices) is the first step. Simply switching frequencies may not resolve the underlying problem.',
    acsCode: 'UA.V.A.K2',
  },

  // ─── UA.VI  Crew Resource Management ──────────────────────────────────────

  {
    id: 31,
    question: 'Under Part 107, what is the role of a visual observer (VO) during an sUAS operation?',
    figures: [],
    options: [
      { letter: 'A', text: 'The VO serves as pilot in command and must hold a remote pilot certificate.', correct: false },
      { letter: 'B', text: 'The VO assists the RPIC by maintaining visual contact with the sUAS and watching for hazards, allowing the RPIC to focus on the payload or control inputs.', correct: true },
      { letter: 'C', text: 'The VO is required for all Part 107 operations.', correct: false },
    ],
    explanation: 'A visual observer (VO) is optional under Part 107 but is useful when the task (e.g., camera operation) divides the RPIC\'s attention. The VO must maintain visual contact with the sUAS and communicate traffic, airspace, or hazard information to the RPIC. The VO does not need a remote pilot certificate but must be in communication with the RPIC at all times.',
    acsCode: 'UA.VI.A.K1',
  },

  {
    id: 32,
    question: 'What is the most significant threat to safe sUAS operations that is related to crew resource management?',
    figures: [],
    options: [
      { letter: 'A', text: 'Complacency and task saturation leading to loss of situational awareness', correct: true },
      { letter: 'B', text: 'Flying with an untrained visual observer', correct: false },
      { letter: 'C', text: 'Operating in Class G airspace without a plan', correct: false },
    ],
    explanation: 'Complacency (assuming routine operations are safe without active vigilance) and task saturation (being overwhelmed by multiple simultaneous demands such as payload control, navigation, and hazard avoidance) are leading CRM-related causes of sUAS accidents. Loss of situational awareness — not knowing where the aircraft is, what is around it, or what will happen next — is the common outcome. Thorough pre-flight planning, crew briefings, and clear task allocation help mitigate these risks.',
    acsCode: 'UA.VI.B.K1',
  },

  {
    id: 33,
    question: 'Before beginning an sUAS mission, the RPIC should conduct a crew briefing that includes:',
    figures: [],
    options: [
      { letter: 'A', text: 'Expected weather, airspace boundaries, emergency procedures, and task assignments for each crew member.', correct: true },
      { letter: 'B', text: 'The flight plan only; emergency procedures are handled ad hoc.', correct: false },
      { letter: 'C', text: 'Battery voltage readings; all other items are the VO\'s responsibility.', correct: false },
    ],
    explanation: 'An effective pre-flight crew briefing covers: weather conditions, airspace constraints, mission objectives, emergency procedures (lost link, fly-away, medical emergency), role assignments, communication protocols, and abort criteria. This ensures all crew members share the same situational picture and can respond effectively to emergencies without the RPIC having to issue new instructions under stress.',
    acsCode: 'UA.VI.A.K2',
  },

  // ─── UA.VII  Radio Communications ─────────────────────────────────────────

  {
    id: 34,
    question: 'A remote pilot is operating near an uncontrolled airport. Which radio action, while not legally required, is considered best practice?',
    figures: [],
    options: [
      { letter: 'A', text: 'Broadcast sUAS position and intentions on the Common Traffic Advisory Frequency (CTAF).', correct: true },
      { letter: 'B', text: 'File a flight plan on 122.8 MHz.', correct: false },
      { letter: 'C', text: 'Monitor 121.5 MHz for any ATC clearances.', correct: false },
    ],
    explanation: 'Although remote pilots are not required to hold radio equipment or communicate on ATC frequencies, broadcasting sUAS position and intentions on the airport\'s CTAF is a strongly recommended best practice. It alerts manned traffic of sUAS activity and increases the overall safety of the traffic pattern. 121.5 MHz is the emergency/guard frequency, not the standard CTAF.',
    acsCode: 'UA.VII.A.K1',
  },

  {
    id: 35,
    question: 'When must a remote pilot notify ATC before operating in Class D airspace?',
    figures: [],
    options: [
      { letter: 'A', text: 'At least 72 hours before the operation.', correct: false },
      { letter: 'B', text: 'Before entering the airspace — authorization must be obtained before operations begin.', correct: true },
      { letter: 'C', text: 'Notification is only required for operations above 200 ft AGL in Class D.', correct: false },
    ],
    explanation: 'Per 14 CFR 107.41, prior authorization is required before operating in Class B, C, D, or surface Class E airspace — not just notification. In most areas, LAANC provides near real-time authorization. If LAANC is unavailable, a manual request through FAA DroneZone must be approved before flight begins.',
    acsCode: 'UA.VII.B.K1',
  },

  // ─── UA.VIII  Airport & Heliport Operations ────────────────────────────────

  {
    id: 36,
    question: 'A remote pilot plans to operate an sUAS near a non-towered airport. Which publication provides information about the traffic pattern altitude and any special procedures at that airport?',
    figures: [],
    options: [
      { letter: 'A', text: 'Chart Supplement (Airport/Facility Directory)', correct: true },
      { letter: 'B', text: 'Sectional aeronautical chart legend only', correct: false },
      { letter: 'C', text: 'ATIS broadcast', correct: false },
    ],
    explanation: 'The FAA Chart Supplement (formerly Airport/Facility Directory) provides detailed information for each airport including traffic pattern altitude, runways, lighting, frequencies, remarks, and any special procedures. ATIS is only available at airports with an operational control tower. The sectional chart shows the airport symbol and some data but not the full operational details.',
    acsCode: 'UA.VIII.A.K1',
  },

  {
    id: 37,
    question: 'When operating an sUAS within 5 nautical miles of an airport that lacks an air traffic control tower, the remote pilot should:',
    figures: [],
    options: [
      { letter: 'A', text: 'Obtain authorization via LAANC or FAA DroneZone if operating in controlled airspace, and contact the airport manager or FBO to advise them of planned operations.', correct: true },
      { letter: 'B', text: 'File a notice with the FSDO before any operation.', correct: false },
      { letter: 'C', text: 'No special action is required because non-towered airports have no associated airspace restrictions.', correct: false },
    ],
    explanation: 'Non-towered airports may have Class E surface area airspace (or Class G) extending from the surface. If the airport has associated controlled airspace, LAANC or manual authorization is required. Even in Class G, contacting the airport manager or FBO to advise of sUAS operations is a best-practice courtesy that improves awareness among local manned aircraft operators.',
    acsCode: 'UA.VIII.B.K1',
  },

  {
    id: 38,
    question: 'Which airport marking indicates a runway that is closed?',
    figures: [],
    options: [
      { letter: 'A', text: 'Yellow X painted on the runway threshold', correct: true },
      { letter: 'B', text: 'A red circle painted at the runway end', correct: false },
      { letter: 'C', text: 'Cones placed along the runway centerline', correct: false },
    ],
    explanation: 'A large yellow X (or multiple Xs) painted on the runway surface is the standard FAA marking for a permanently or temporarily closed runway. Runway lighting may also be turned off on a closed runway. Remote pilots must be aware of closed runways as this can indicate construction or hazardous conditions near the sUAS operational area.',
    acsCode: 'UA.VIII.A.K2',
  },

  // ─── UA.IX  Maintenance & Inspection ──────────────────────────────────────

  {
    id: 39,
    question: 'Under Part 107, who is responsible for ensuring the sUAS is in a safe condition for flight?',
    figures: [],
    options: [
      { letter: 'A', text: 'The sUAS manufacturer', correct: false },
      { letter: 'B', text: 'The remote pilot in command', correct: true },
      { letter: 'C', text: 'A certificated aviation mechanic', correct: false },
    ],
    explanation: 'Per 14 CFR 107.15, the remote pilot in command is responsible for conducting a pre-flight inspection and ensuring that the sUAS is in a condition for safe operation. Unlike manned aircraft which require FAA-certificated maintenance, sUAS maintenance can be performed by anyone — but the RPIC must verify airworthiness before each flight.',
    acsCode: 'UA.IX.A.K1',
  },

  {
    id: 40,
    question: 'What action should a remote pilot take after a hard landing or crash that appears to have caused no visible damage to the sUAS?',
    figures: [],
    options: [
      { letter: 'A', text: 'Resume operations immediately because no visible damage means the aircraft is airworthy.', correct: false },
      { letter: 'B', text: 'Conduct a thorough inspection of frame, motors, propellers, and electronics before resuming flight.', correct: true },
      { letter: 'C', text: 'Fly a short test hop at low altitude to check aircraft response.', correct: false },
    ],
    explanation: 'Impact forces can crack frames, bend motor shafts, weaken propeller roots, and cause loose electrical connections that are not visible on a casual inspection. Flying a damaged aircraft risks in-flight failure. The remote pilot must inspect the aircraft thoroughly — and if uncertain, bench-test motors and flight controller calibration before returning to flight.',
    acsCode: 'UA.IX.B.K1',
  },

  {
    id: 41,
    question: 'A pre-flight checklist for an sUAS should include checking:',
    figures: [],
    options: [
      { letter: 'A', text: 'Battery charge level, propeller condition, airspace restrictions, and GPS/compass calibration status.', correct: true },
      { letter: 'B', text: 'Battery charge level only, since all other systems are monitored automatically.', correct: false },
      { letter: 'C', text: 'Only regulatory compliance items; mechanical checks are optional for small sUAS.', correct: false },
    ],
    explanation: 'A thorough sUAS pre-flight checklist includes: battery charge (aircraft and controller), propeller condition (cracks, chips, secure attachment), firmware/software status, GPS satellite count and compass calibration, airspace authorization, weather conditions, obstacle survey of the flight area, and emergency procedure review. Automated monitoring supplements — but does not replace — a physical pre-flight inspection.',
    acsCode: 'UA.IX.A.K2',
  },

  {
    id: 42,
    question: 'How should a remote pilot maintain records of sUAS maintenance and inspections?',
    figures: [],
    options: [
      { letter: 'A', text: 'Part 107 does not require a formal maintenance record, but keeping a maintenance log is strongly recommended.', correct: true },
      { letter: 'B', text: 'Records must be filed with the FAA within 30 days of each maintenance event.', correct: false },
      { letter: 'C', text: 'Maintenance records must be kept in the same format as 14 CFR Part 43 records for manned aircraft.', correct: false },
    ],
    explanation: 'Unlike manned aircraft, Part 107 does not mandate a formal maintenance log for sUAS. However, maintaining a voluntary logbook of inspections, battery cycles, repairs, and firmware updates is strongly recommended. A maintenance log helps identify recurring problems, satisfies insurance requirements, and demonstrates due diligence if an accident occurs.',
    acsCode: 'UA.IX.A.K3',
  },

  // ─── UA.X  Aeronautical Decision-Making ───────────────────────────────────

  {
    id: 43,
    question: 'A remote pilot experiences pressure from a client to complete a commercial sUAS operation despite deteriorating weather conditions. Which decision-making principle should guide the pilot?',
    figures: [],
    options: [
      { letter: 'A', text: '"Get-there-itis" is acceptable if the client has paid for the service.', correct: false },
      { letter: 'B', text: 'The remote pilot has final authority as RPIC and must prioritize safety over schedule or financial pressure.', correct: true },
      { letter: 'C', text: 'Proceed at reduced altitude to stay below the weather.', correct: false },
    ],
    explanation: 'External pressure from clients, supervisors, or schedules is a recognized hazard in aviation ADM. The RPIC has final authority over flight decisions and is legally responsible for operating safely. Succumbing to "get-there-itis" or pressure to complete a mission despite unsafe conditions is a known accident cause. The correct action is to postpone or cancel the operation and communicate the safety rationale clearly to the client.',
    acsCode: 'UA.X.A.K1',
  },

  {
    id: 44,
    question: 'Which hazardous attitude is described as a pilot believing that rules and regulations do not apply to them personally?',
    figures: [],
    options: [
      { letter: 'A', text: 'Invulnerability', correct: false },
      { letter: 'B', text: 'Anti-authority', correct: true },
      { letter: 'C', text: 'Impulsivity', correct: false },
    ],
    explanation: 'The FAA identifies five hazardous attitudes: Anti-authority ("Don\'t tell me"), Impulsivity ("Do it quickly"), Invulnerability ("It won\'t happen to me"), Macho ("I can do it"), and Resignation ("What\'s the use"). Anti-authority describes pilots who resent and disregard rules, regulations, and authority figures. The antidote is "Follow the rules — they are usually right."',
    acsCode: 'UA.X.B.K1',
  },

  {
    id: 45,
    question: 'What is the 3P model of aeronautical decision-making?',
    figures: [],
    options: [
      { letter: 'A', text: 'Perceive, Process, Perform', correct: false },
      { letter: 'B', text: 'Perceive, Process, Proceed', correct: false },
      { letter: 'C', text: 'Perceive, Process, Perform — a continuous cycle of identifying hazards, analyzing risk, and acting.', correct: true },
    ],
    explanation: 'The FAA\'s 3P model (Perceive-Process-Perform) is a systematic approach to ADM: (1) Perceive hazards in the environment; (2) Process by evaluating the effect on flight safety using tools like the PAVE checklist (Pilot, Aircraft, enVironment, External pressures); (3) Perform the best available action. The cycle repeats continuously throughout the flight.',
    acsCode: 'UA.X.A.K2',
  },

  {
    id: 46,
    question: 'A remote pilot intends to conduct operations near a hospital helipad. Which of the following is the most important pre-flight consideration?',
    figures: [],
    options: [
      { letter: 'A', text: 'Coordinate with hospital staff and check for active NOTAMs or TFRs over the helipad area.', correct: true },
      { letter: 'B', text: 'Helipad operations are only relevant to manned rotorcraft; sUAS operations nearby require no special action.', correct: false },
      { letter: 'C', text: 'Operate at the maximum allowable 400 ft AGL to maintain separation from helicopter operations.', correct: false },
    ],
    explanation: 'Hospital helipads can be very active and may have associated TFRs (especially during trauma emergencies). Helicopter approaches and departures to helipads can occur at any time, often at low altitude and without radio calls. Coordinating with the hospital and checking for active NOTAMs is essential. The RPIC should also establish a clear emergency abort procedure in case a helicopter approaches unexpectedly.',
    acsCode: 'UA.X.A.K3',
  },

  {
    id: 47,
    question: 'Under Part 107, is a remote pilot permitted to act as RPIC for two sUAS simultaneously?',
    figures: [],
    options: [
      { letter: 'A', text: 'Yes, as long as both aircraft remain within visual line of sight.', correct: false },
      { letter: 'B', text: 'No, a remote pilot may only act as RPIC for one sUAS at a time.', correct: true },
      { letter: 'C', text: 'Yes, with an approved waiver for multi-aircraft operations.', correct: false },
    ],
    explanation: 'Per 14 CFR 107.35, a person may only act as remote pilot in command or visual observer for one unmanned aircraft at a time. Managing two aircraft simultaneously would create unacceptable workload and divide the attention needed to maintain safe visual contact. There is no waiver provision that allows a single RPIC to command two aircraft simultaneously.',
    acsCode: 'UA.I.B.K6',
  },

  {
    id: 48,
    question: 'A remote pilot is planning to operate over a highway to photograph traffic flow. Under Part 107, this operation:',
    figures: [],
    options: [
      { letter: 'A', text: 'Is permitted as long as the sUAS stays at or below 400 ft AGL.', correct: false },
      { letter: 'B', text: 'Is prohibited because it involves operations over moving vehicles, unless a Part 107 waiver is obtained.', correct: true },
      { letter: 'C', text: 'Is permitted if the highway is in uncontrolled airspace.', correct: false },
    ],
    explanation: 'Per 14 CFR 107.39, sUAS may not be operated over any person who is not directly participating in the operation and is not located under a covered structure or inside a stationary vehicle that can provide reasonable protection. Operating over a highway with moving vehicles violates this rule. A waiver (107.200) is required to conduct operations over moving vehicles.',
    acsCode: 'UA.I.B.K7',
  },

  {
    id: 49,
    question: 'What is a "sterile cockpit" concept as applied to sUAS operations?',
    figures: [],
    options: [
      { letter: 'A', text: 'The remote controller must be cleaned before each flight to prevent contamination.', correct: false },
      { letter: 'B', text: 'During critical phases of flight (launch, landing, navigation through congested airspace), non-essential conversation and distractions should be minimized.', correct: true },
      { letter: 'C', text: 'Remote pilots must wear sterile gloves to prevent electrostatic discharge.', correct: false },
    ],
    explanation: 'Borrowed from manned aviation, the sterile cockpit concept means that during critical phases — launch, approach, landing, and operations in complex airspace — all non-essential conversation and distracting activities should stop. Distractions during these phases are a leading cause of accidents. In sUAS operations, this means the RPIC should not be handling a phone, talking non-critically, or operating payload controls during launch and recovery.',
    acsCode: 'UA.VI.B.K2',
  },

  {
    id: 50,
    question: 'A remote pilot certificate issued by the FAA is valid for how long?',
    figures: [],
    options: [
      { letter: 'A', text: '2 years, then must be renewed by retaking the knowledge test.', correct: false },
      { letter: 'B', text: '24 calendar months from the date the knowledge test was passed; privileges require a recurrent test or online training every 24 months.', correct: true },
      { letter: 'C', text: 'The certificate is permanent and never expires.', correct: false },
    ],
    explanation: 'A remote pilot certificate does not expire, but the operational privileges it conveys require the pilot to maintain currency. Per 14 CFR 107.65, a remote pilot must pass a recurrent aeronautical knowledge test (or complete the FAA\'s free online recurrent training) every 24 calendar months to maintain currency. An expired currency means the pilot cannot legally exercise the privileges of the certificate.',
    acsCode: 'UA.I.A.K4',
  },

  {
    id: 51,
    question: 'Which of the following sUAS operations is permitted under standard Part 107 rules without a waiver?',
    figures: [],
    options: [
      { letter: 'A', text: 'Operating at night with the sUAS equipped with anti-collision lighting visible for 3 statute miles', correct: true },
      { letter: 'B', text: 'Flying over a populated area without visual line of sight', correct: false },
      { letter: 'C', text: 'Conducting operations inside Class A airspace', correct: false },
    ],
    explanation: 'The FAA amended Part 107 in 2021 to allow night operations without a waiver provided the sUAS is equipped with anti-collision lighting visible for at least 3 statute miles and the remote pilot has completed night operations training. BVLOS and Class A airspace operations remain prohibited under standard rules.',
    acsCode: 'UA.I.B.K8',
  },

  {
    id: 52,
    question: 'When operating in Class E airspace that begins at the surface (around some non-towered airports), a remote pilot must:',
    figures: [],
    options: [
      { letter: 'A', text: 'Obtain ATC authorization before operations.', correct: true },
      { letter: 'B', text: 'Operate only during daylight hours.', correct: false },
      { letter: 'C', text: 'File a NOTAM at least 72 hours before operations.', correct: false },
    ],
    explanation: 'Surface Class E airspace (depicted on sectional charts with a dashed magenta line) requires ATC authorization just like Class B, C, and D. Many non-towered airports with instrument approaches have Class E surface areas. LAANC typically covers these areas; where LAANC is unavailable, a manual DroneZone authorization is required.',
    acsCode: 'UA.II.A.K4',
  },

  {
    id: 53,
    question: 'A remote pilot wants to fly at 50 ft AGL directly over a moving crowd at an outdoor festival. This operation is:',
    figures: [],
    options: [
      { letter: 'A', text: 'Permitted because the operation is below 400 ft AGL.', correct: false },
      { letter: 'B', text: 'Prohibited unless a Part 107 waiver for operations over people is obtained.', correct: true },
      { letter: 'C', text: 'Permitted if each person in the crowd signs a liability waiver.', correct: false },
    ],
    explanation: 'Per 14 CFR 107.39, sUAS may not be operated over any person who is not directly participating in the operation unless the aircraft is in one of the Part 107.110–107.140 categories (Category 1 weighing ≤0.55 lb with no exposed rotating parts, Category 2 or 3 with declared compliance, or Category 4 with airworthiness certificate). A liability waiver from attendees has no legal standing under federal aviation regulations.',
    acsCode: 'UA.I.B.K9',
  },

  {
    id: 54,
    question: 'A METAR for a nearby airport includes the remark "TS OVHD." What does this indicate and how should a remote pilot respond?',
    figures: [],
    options: [
      { letter: 'A', text: '"TS OVHD" means thunderstorms overhead; the remote pilot should not fly and should wait for the storm to pass.', correct: true },
      { letter: 'B', text: '"TS OVHD" means temperature/sea-level pressure is overhead and poses no hazard.', correct: false },
      { letter: 'C', text: '"TS OVHD" means the ATIS is temporarily suspended; operations may continue.', correct: false },
    ],
    explanation: 'In METAR remarks, "TS" stands for thunderstorm and "OVHD" means overhead. A thunderstorm directly overhead produces extreme hazards: lightning, hail, microburst wind shear, and severe turbulence. No sUAS should be airborne under these conditions. The remote pilot should suspend operations and seek shelter until the storm has cleared and weather conditions return to within Part 107 minimums.',
    acsCode: 'UA.III.A.K3',
  },

  {
    id: 55,
    question: 'A UAS Facility Map (UASFM) shows an altitude of "0" for a grid square near an airport. What does this mean for a remote pilot using LAANC?',
    figures: [],
    options: [
      { letter: 'A', text: 'The remote pilot may fly up to 400 ft AGL in that grid square.', correct: false },
      { letter: 'B', text: 'Automated LAANC authorization is not available in that area; a manual FAA authorization is required.', correct: true },
      { letter: 'C', text: 'The area is uncontrolled airspace and no authorization is needed.', correct: false },
    ],
    explanation: 'UAS Facility Maps show the maximum altitudes the FAA has pre-approved for LAANC automated authorization in each grid square. A "0" means LAANC will not issue automated approval at any altitude in that area — typically near active runways or critical airspace. The remote pilot must apply for a manual authorization through FAA DroneZone and wait for FAA review.',
    acsCode: 'UA.II.A.K5',
  },

  {
    id: 56,
    question: 'Under Part 107, which person must hold a remote pilot certificate with an sUAS rating?',
    figures: [],
    options: [
      { letter: 'A', text: 'Any person who physically manipulates the flight controls of the sUAS.', correct: false },
      { letter: 'B', text: 'The remote pilot in command (RPIC) responsible for the operation.', correct: true },
      { letter: 'C', text: 'Every person involved in the operation, including visual observers.', correct: false },
    ],
    explanation: 'Per 14 CFR 107.12, only the remote pilot in command is required to hold a Part 107 remote pilot certificate. A visual observer (VO) and payload operators do not need to be certificated. However, the RPIC bears legal responsibility for all aspects of the operation and may delegate tasks to crew members, including allowing another qualified person to manipulate the controls under direct supervision.',
    acsCode: 'UA.I.A.K5',
  },

  {
    id: 57,
    question: 'A sectional chart shows a blue dashed circle around a non-towered airport. What does this depict?',
    figures: [],
    options: [
      { letter: 'A', text: 'Class D airspace', correct: false },
      { letter: 'B', text: 'Class E airspace that begins at 700 ft AGL (transition area)', correct: false },
      { letter: 'C', text: 'Class E airspace that begins at the surface', correct: true },
    ],
    explanation: 'On a sectional chart, a dashed blue line depicts Class E airspace that extends from the surface (surface-based Class E). This is typically found around non-towered airports with instrument approaches. A dashed magenta circle or arc also depicts surface Class E airspace at some locations. Both require ATC authorization for sUAS operations.',
    acsCode: 'UA.II.A.K6',
  },

  {
    id: 58,
    question: 'When operating in degraded visual conditions that approach the Part 107 minimum visibility of 3 statute miles, a remote pilot should:',
    figures: [],
    options: [
      { letter: 'A', text: 'Continue operations because exactly 3 SM visibility is permitted.', correct: false },
      { letter: 'B', text: 'Apply a conservative safety margin and consider suspending operations before reaching the legal minimum.', correct: true },
      { letter: 'C', text: 'Reduce altitude to 50 ft AGL where visibility is generally better.', correct: false },
    ],
    explanation: 'Flying at the edge of the regulatory minimum is poor risk management. Visibility can deteriorate rapidly, and by the time the pilot realizes conditions are below minimums, they may already be in violation — and in an unsafe situation. Applying a personal safety margin (e.g., suspending operations at 4 SM and declining rather than waiting until visibility drops to 3 SM) is sound ADM practice.',
    acsCode: 'UA.X.A.K4',
  },

  {
    id: 59,
    question: 'Which of the following best describes the concept of aeronautical decision-making (ADM) for remote pilots?',
    figures: [],
    options: [
      { letter: 'A', text: 'A systematic approach to risk identification and mitigation that promotes safe outcomes in flight operations.', correct: true },
      { letter: 'B', text: 'A required FAA checklist that must be completed before each flight.', correct: false },
      { letter: 'C', text: 'A process only relevant when flying in controlled airspace.', correct: false },
    ],
    explanation: 'ADM is a systematic approach to the mental process used by pilots to consistently determine the best course of action in response to a given set of circumstances. Good ADM involves identifying hazards, assessing risk, selecting the safest available action, and evaluating the outcome. The FAA teaches several ADM frameworks (3P, PAVE, IMSAFE) that apply to all aviation operations, including sUAS.',
    acsCode: 'UA.X.A.K5',
  },

  {
    id: 60,
    question: 'A Part 107 remote pilot plans to fly an sUAS for a real estate company to photograph homes for sale. The pilot will be paid for the service. Which of the following is correct?',
    figures: [],
    options: [
      { letter: 'A', text: 'This is a hobby operation because the pilot is not a full-time employee.', correct: false },
      { letter: 'B', text: 'This is a commercial operation requiring a Part 107 remote pilot certificate.', correct: true },
      { letter: 'C', text: 'This operation requires an FAA Section 333 exemption.', correct: false },
    ],
    explanation: 'Any sUAS operation that is conducted in furtherance of a business or for compensation is considered a commercial operation under Part 107. Photographing homes for a real estate company for pay — even as an independent contractor — is a commercial operation requiring a Part 107 remote pilot certificate. Section 333 exemptions were the pre-Part 107 process and are no longer required for operations that qualify under Part 107.',
    acsCode: 'UA.I.A.K6',
  },
];
