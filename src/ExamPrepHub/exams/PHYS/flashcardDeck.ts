// Flashcard deck for PHYS — SC 11th-grade Physics.
// Concept cards used by the Flashcards tab with SM-2 spaced repetition.

export interface Flashcard {
  id: string;
  topic: string;
  front: string;
  back: string;
}

export const flashcards: Flashcard[] = [
  // === Kinematics ===
  {
    id: 'kin-fc-1',
    topic: 'Kinematics',
    front: 'What is the difference between displacement and distance?',
    back: 'Distance is the total path length traveled (scalar — always positive). Displacement is the straight-line change in position from start to finish (vector — has direction, can be zero or negative). A runner completing a full lap has 400 m distance but 0 m displacement.',
  },
  {
    id: 'kin-fc-2',
    topic: 'Kinematics',
    front: 'What is the difference between velocity and speed?',
    back: 'Speed = distance / time (scalar, always ≥ 0). Velocity = displacement / time (vector, includes direction). A car driving in circles at 60 mph has constant speed but continuously changing velocity because direction changes.',
  },
  {
    id: 'kin-fc-3',
    topic: 'Kinematics',
    front: 'State the four SUVAT (kinematic) equations.',
    back: '1. v = u + at\n2. s = ut + ½at²\n3. v² = u² + 2as\n4. s = (u + v)/2 · t\n\nWhere s = displacement, u = initial velocity, v = final velocity, a = acceleration, t = time. Each equation omits one variable — pick the one that matches what you know and need.',
  },
  {
    id: 'kin-fc-4',
    topic: 'Kinematics',
    front: 'What is free fall, and what is the acceleration due to gravity near Earth\'s surface?',
    back: 'Free fall is motion under gravity alone (no air resistance). All objects fall with the same acceleration g = 9.8 m/s² downward, regardless of mass — Galileo proved this. In equations, use a = −9.8 m/s² if upward is positive.',
  },
  {
    id: 'kin-fc-5',
    topic: 'Kinematics',
    front: 'In projectile motion, how do horizontal and vertical motions relate?',
    back: 'They are completely independent. Horizontal: constant velocity (no acceleration, ignoring air resistance). Vertical: constant acceleration g = 9.8 m/s² downward. Horizontal velocity never changes; vertical velocity increases downward the whole flight.',
  },
  {
    id: 'kin-fc-6',
    topic: 'Kinematics',
    front: 'On a velocity-time graph, what does slope represent? What does area represent?',
    back: 'Slope = acceleration (Δv/Δt). Area under the curve = displacement. A horizontal line (slope 0) means constant velocity (zero acceleration). A steep positive slope means rapid acceleration. These graph interpretations appear on almost every physics exam.',
  },
  {
    id: 'kin-fc-7',
    topic: 'Kinematics',
    front: 'A ball is thrown upward. Describe its velocity and acceleration at the peak.',
    back: 'At the peak: velocity = 0 (momentarily stopped). Acceleration = 9.8 m/s² downward (unchanged — gravity never stops). The common error is thinking acceleration is zero at the peak. Gravity acts at every point of the flight, including the instant of zero velocity.',
  },

  // === Energy & Momentum ===
  {
    id: 'ener-fc-1',
    topic: 'Energy & Momentum',
    front: 'State the formulas for kinetic energy, gravitational potential energy, and elastic potential energy.',
    back: 'KE = ½mv²\nGPE = mgh\nElastic PE = ½kx²\n\nAll energy is measured in Joules (J). Notice the ½ in KE and elastic PE. GPE depends on height h above a reference point. Elastic PE is stored in a spring stretched or compressed by x.',
  },
  {
    id: 'ener-fc-2',
    topic: 'Energy & Momentum',
    front: 'What does the conservation of mechanical energy state, and when does it apply?',
    back: 'When only conservative forces act (no friction, no air resistance), total mechanical energy is conserved: KE + PE = constant. Energy converts between forms (KE ↔ PE) but the total never changes. A falling ball trades PE for KE as it falls.',
  },
  {
    id: 'ener-fc-3',
    topic: 'Energy & Momentum',
    front: 'State the work-energy theorem.',
    back: 'W_net = ΔKE = KE_f − KE_i. The net work done on an object equals its change in kinetic energy. Positive net work speeds the object up; negative net work slows it down. A perpendicular force (like normal force or centripetal force) does zero work because cos 90° = 0.',
  },
  {
    id: 'ener-fc-4',
    topic: 'Energy & Momentum',
    front: 'What is momentum? State the formula and its conservation condition.',
    back: 'Momentum p = mv (vector, units: kg·m/s). Conservation of momentum: in an isolated system (no net external force), total momentum before = total momentum after. Applies to ALL collisions — elastic and inelastic. It is the single most powerful tool for collision problems.',
  },
  {
    id: 'ener-fc-5',
    topic: 'Energy & Momentum',
    front: 'What is impulse, and how does it relate to momentum?',
    back: 'Impulse J = FΔt = Δp. Force multiplied by the time over which it acts equals the change in momentum. Airbags increase collision time, reducing force for the same momentum change (same Δp spread over longer Δt → smaller F). Units: N·s = kg·m/s.',
  },
  {
    id: 'ener-fc-6',
    topic: 'Energy & Momentum',
    front: 'What is the difference between elastic and perfectly inelastic collisions?',
    back: 'Elastic: both momentum AND kinetic energy are conserved. Objects bounce off each other. Perfectly inelastic: momentum is conserved, but kinetic energy is NOT — maximum KE is lost. Objects stick together after the collision. All collisions conserve momentum; only elastic ones conserve KE.',
  },
  {
    id: 'ener-fc-7',
    topic: 'Energy & Momentum',
    front: 'State the formula for power and give its units.',
    back: 'Power P = W/t = Fv (for constant force). Units: Watts (W) = J/s. Power measures how quickly work is done. A more powerful engine does the same work in less time. 1 horsepower ≈ 746 W. Also: P = IV for electrical power.',
  },

  // === Waves & Sound ===
  {
    id: 'wave-fc-1',
    topic: 'Waves & Sound',
    front: 'State the wave equation and define each variable.',
    back: 'v = fλ\nv = wave speed (m/s)\nf = frequency (Hz = cycles per second)\nλ = wavelength (m = distance per cycle)\n\nFor sound in air at 20°C: v ≈ 343 m/s. For light in vacuum: v = 3×10⁸ m/s. Frequency and wavelength are inversely related at constant speed.',
  },
  {
    id: 'wave-fc-2',
    topic: 'Waves & Sound',
    front: 'What is the difference between transverse and longitudinal waves? Give one example of each.',
    back: 'Transverse: particle oscillation is PERPENDICULAR to wave travel direction. Example: light, water surface waves. Longitudinal: particle oscillation is PARALLEL to wave travel direction (compressions and rarefactions). Example: sound. Transverse waves can be polarized; longitudinal waves cannot.',
  },
  {
    id: 'wave-fc-3',
    topic: 'Waves & Sound',
    front: 'What are the four key wave properties: wavelength, frequency, amplitude, and speed?',
    back: 'Wavelength (λ): distance between two successive identical points (e.g., crest to crest). Frequency (f): number of cycles per second. Amplitude (A): maximum displacement from equilibrium — determines energy/intensity. Speed (v): how fast the wave pattern moves — set by the medium, not the source. Intensity ∝ A².',
  },
  {
    id: 'wave-fc-4',
    topic: 'Waves & Sound',
    front: 'What are nodes and antinodes in a standing wave?',
    back: 'Nodes: points of ZERO displacement — caused by destructive interference. In a string fixed at both ends, the endpoints are always nodes. Antinodes: points of MAXIMUM displacement — caused by constructive interference. The fundamental (1st harmonic) has 2 nodes (the ends) and 1 antinode in the middle.',
  },
  {
    id: 'wave-fc-5',
    topic: 'Waves & Sound',
    front: 'Explain the Doppler Effect for sound.',
    back: 'When a source moves toward you, sound waves are compressed → shorter wavelength → higher frequency → higher pitch. When it moves away, waves are stretched → lower pitch. The observer hears a pitch change even though the source emits a constant frequency. The "neeeooooww" of a passing race car is a classic example.',
  },
  {
    id: 'wave-fc-6',
    topic: 'Waves & Sound',
    front: 'What is the relationship between period T and frequency f?',
    back: 'T = 1/f and f = 1/T. They are reciprocals. Period is measured in seconds (time per cycle); frequency is measured in Hz (cycles per second). A wave with f = 100 Hz has T = 0.01 s. High frequency = short period; low frequency = long period.',
  },

  // === Light & Optics ===
  {
    id: 'opt-fc-1',
    topic: 'Light & Optics',
    front: 'State the law of reflection.',
    back: 'Angle of incidence = angle of reflection (θᵢ = θᵣ). Both angles are measured from the NORMAL (perpendicular to the surface), not from the surface itself. This holds for all surfaces — flat, concave, and convex mirrors — and for all wavelengths.',
  },
  {
    id: 'opt-fc-2',
    topic: 'Light & Optics',
    front: 'State Snell\'s Law and describe what happens when light enters a denser medium.',
    back: 'Snell\'s Law: n₁ sin θ₁ = n₂ sin θ₂. When light enters a DENSER medium (higher n), it slows down and bends TOWARD the normal (angle decreases). When entering a LESS dense medium, it bends AWAY from the normal. The frequency doesn\'t change, but speed and wavelength do.',
  },
  {
    id: 'opt-fc-3',
    topic: 'Light & Optics',
    front: 'What is total internal reflection, and what condition is required for it?',
    back: 'Total internal reflection occurs when: (1) light travels from a denser medium to a less dense medium (higher n → lower n), AND (2) the angle of incidence exceeds the critical angle θc where sin θc = n₂/n₁. No light escapes — 100% reflects back. Fiber optic cables use this principle.',
  },
  {
    id: 'opt-fc-4',
    topic: 'Light & Optics',
    front: 'Compare concave and convex mirrors: what types of images does each produce?',
    back: 'Concave (converging) mirror: if object is beyond focal point → real, inverted image. If object is between focal point and mirror → virtual, upright, magnified image (like a makeup mirror). Convex (diverging) mirror: ALWAYS produces virtual, upright, smaller images. Wide field of view → used for security cameras and car side mirrors.',
  },
  {
    id: 'opt-fc-5',
    topic: 'Light & Optics',
    front: 'State the order of the electromagnetic spectrum from lowest to highest frequency.',
    back: 'Radio → Microwave → Infrared → Visible → Ultraviolet → X-ray → Gamma ray\n\nHigher frequency = shorter wavelength = more energy per photon. Visible light is a tiny sliver in the middle. Mnemonic: "Really Made In Visible UV eXtra Gamma."',
  },
  {
    id: 'opt-fc-6',
    topic: 'Light & Optics',
    front: 'What is the index of refraction n, and what does it tell you about light speed in a material?',
    back: 'n = c/v where c = 3×10⁸ m/s (speed of light in vacuum) and v = speed in the material. Higher n = slower light = more bending at interfaces. Air: n ≈ 1.00. Water: n ≈ 1.33. Glass: n ≈ 1.5. Diamond: n ≈ 2.42 (slows light a lot → brilliant sparkle).',
  },

  // === Electricity & Circuits ===
  {
    id: 'elec-fc-1',
    topic: 'Electricity & Circuits',
    front: 'State Ohm\'s Law and define each variable with its unit.',
    back: 'V = IR\nV = voltage (Volts, V) — the "pressure" pushing charges\nI = current (Amperes, A) — the flow rate of charge\nR = resistance (Ohms, Ω) — opposition to flow\n\nMore voltage → more current. More resistance → less current. Rearrangements: I = V/R, R = V/I.',
  },
  {
    id: 'elec-fc-2',
    topic: 'Electricity & Circuits',
    front: 'Compare series and parallel circuits: how do current and voltage behave in each?',
    back: 'Series: current is THE SAME through all components; voltage DIVIDES among components (V_total = V₁ + V₂ + …). R_total = R₁ + R₂ + …\n\nParallel: voltage is THE SAME across all branches; current DIVIDES among branches. 1/R_total = 1/R₁ + 1/R₂ + …',
  },
  {
    id: 'elec-fc-3',
    topic: 'Electricity & Circuits',
    front: 'State the three electrical power formulas.',
    back: 'P = IV\nP = I²R\nP = V²/R\n\nAll measured in Watts (W). Use whichever matches what you know: if you have I and R, use P = I²R. If you have V and R, use P = V²/R. Energy used = P × t (in Joules if t is in seconds).',
  },
  {
    id: 'elec-fc-4',
    topic: 'Electricity & Circuits',
    front: 'State Kirchhoff\'s two laws.',
    back: 'Junction Rule (KCL): the sum of currents INTO a junction equals the sum OUT. (Conservation of charge — no charge accumulates.)\n\nLoop Rule (KVL): the sum of voltage gains and drops around any closed loop equals zero. (Conservation of energy — energy put in = energy used up.)',
  },
  {
    id: 'elec-fc-5',
    topic: 'Electricity & Circuits',
    front: 'What is the formula for equivalent resistance of resistors in parallel?',
    back: '1/R_total = 1/R₁ + 1/R₂ + 1/R₃ + …\n\nParallel resistance is ALWAYS less than the smallest individual resistor. Analogy: adding more pipes in parallel gives more paths for water → less total resistance. Two equal resistors in parallel = half the resistance of one.',
  },
  {
    id: 'elec-fc-6',
    topic: 'Electricity & Circuits',
    front: 'State Coulomb\'s Law and describe how distance affects electric force.',
    back: 'F = kq₁q₂/r² where k ≈ 9×10⁹ N·m²/C². Electric force follows an inverse square law: double the distance → force drops to 1/4. Triple the distance → force drops to 1/9. Like charges repel; unlike charges attract. Analogous in form to Newton\'s Law of Gravitation.',
  },
  {
    id: 'elec-fc-7',
    topic: 'Electricity & Circuits',
    front: 'What is electric potential (voltage), and how does it differ from electric field?',
    back: 'Electric potential (V) is the energy per unit charge at a point (measured in Volts = J/C). Electric field (E) is the force per unit charge at a point (measured in N/C or V/m). Electric field points from HIGH potential to LOW potential — in the direction a positive charge would naturally move (downhill energetically).',
  },

  // === Magnetism ===
  {
    id: 'mag-fc-1',
    topic: 'Magnetism',
    front: 'Describe magnetic field lines around a bar magnet.',
    back: 'Outside the magnet: field lines run from NORTH pole to SOUTH pole. Inside the magnet: field lines run from South to North (forming closed loops). Lines are densest near the poles (strongest field). Lines never cross each other. The direction is defined as where a free North pole would travel.',
  },
  {
    id: 'mag-fc-2',
    topic: 'Magnetism',
    front: 'State the formula for the magnetic force on a moving charge.',
    back: 'F = qvB sin θ\nq = charge (C), v = speed (m/s), B = magnetic field (Tesla), θ = angle between v and B.\nMaximum force when θ = 90° (perpendicular). Zero force when θ = 0° (parallel). Direction: right-hand rule (point fingers in v direction, curl toward B, thumb = force on positive charge).',
  },
  {
    id: 'mag-fc-3',
    topic: 'Magnetism',
    front: 'State Faraday\'s Law of electromagnetic induction.',
    back: 'EMF = −NΔΦ/Δt\nN = number of turns, ΔΦ = change in magnetic flux (Wb), Δt = time interval.\nAn EMF is induced whenever the magnetic flux through a coil changes. Flux can change by changing B, area, or angle. The negative sign represents Lenz\'s Law: the induced current opposes the change.',
  },
  {
    id: 'mag-fc-4',
    topic: 'Magnetism',
    front: 'What does Lenz\'s Law state, and why does it make physical sense?',
    back: 'The induced current always flows in a direction that OPPOSES the change in magnetic flux that caused it. This makes sense from energy conservation: if induced current reinforced the change, you\'d get self-amplifying energy — a perpetual motion machine. Lenz\'s Law is a statement that you can\'t get something for nothing.',
  },
  {
    id: 'mag-fc-5',
    topic: 'Magnetism',
    front: 'State the transformer equation and explain the trade-off between voltage and current.',
    back: 'V₁/V₂ = N₁/N₂ and V₁I₁ = V₂I₂ (power is conserved).\nStep-up transformer: more secondary turns → higher voltage, lower current.\nStep-down transformer: fewer secondary turns → lower voltage, higher current.\nPower companies step voltage up to ~500,000 V for efficient long-distance transmission (less I → less I²R loss).',
  },
  {
    id: 'mag-fc-6',
    topic: 'Magnetism',
    front: 'What is the right-hand rule for a current-carrying solenoid?',
    back: 'Curl the right-hand fingers in the direction of current flow around the coil. The extended thumb points toward the NORTH pole of the solenoid. A solenoid with current flowing acts exactly like a bar magnet. When current stops, the magnetic field collapses — this is the principle of electromagnets.',
  },
  {
    id: 'mag-fc-7',
    topic: 'Magnetism',
    front: 'Describe what creates a magnetic field (sources of magnetism).',
    back: 'Magnetic fields are produced by: (1) moving electric charges (electric current), (2) permanent magnets (aligned magnetic domains from electron spin). A STATIONARY electric charge creates only an electric field, not a magnetic field. Maxwell unified this: changing E creates B, and changing B creates E — electromagnetic waves.',
  },
];
