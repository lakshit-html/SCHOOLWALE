// Official NCERT Textbooks Directory & Chapter Catalog (ncert.nic.in)

export interface NCERTChapter {
  id: string;
  chapterNumber: number;
  title: string;
  pdfUrl: string;
  summary: string;
  keyFormulas?: string[];
  highYieldPoints: string[];
}

export interface NCERTBook {
  id: string;
  classLevel: 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12';
  subject: 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology' | 'Science';
  title: string;
  code: string;
  coverColor: string;
  officialPortalUrl: string;
  chapters: NCERTChapter[];
}

export const NCERT_BOOKS: NCERTBook[] = [
  // ===================== CLASS 12 =====================
  {
    id: 'ncert-12-phy-1',
    classLevel: 'Class 12',
    subject: 'Physics',
    title: 'Physics — Part I',
    code: 'leph1',
    coverColor: '#0284c7',
    officialPortalUrl: 'https://ncert.nic.in/textbook.php?leph1=0-8',
    chapters: [
      {
        id: '12-phy-1',
        chapterNumber: 1,
        title: 'Electric Charges and Fields',
        pdfUrl: 'https://ncert.nic.in/textbook.php?leph1=1-8',
        summary: 'Coulomb’s law, electric field lines, electric dipole, Gauss’s law and its applications to line, sheet, and shell charges.',
        keyFormulas: ['F = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q_1 q_2}{r^2}', '\\oint \\vec{E} \\cdot d\\vec{A} = \\frac{q_{enc}}{\\varepsilon_0}', '\\tau = \\vec{p} \\times \\vec{E}'],
        highYieldPoints: ['Electric field inside a uniformly charged conducting spherical shell is zero.', 'Gauss law is only applicable for closed Gaussian surfaces.']
      },
      {
        id: '12-phy-2',
        chapterNumber: 2,
        title: 'Electrostatic Potential and Capacitance',
        pdfUrl: 'https://ncert.nic.in/textbook.php?leph1=2-8',
        summary: 'Electric potential, equipotential surfaces, potential energy of system of charges, parallel plate capacitors, dielectrics.',
        keyFormulas: ['V = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q}{r}', 'C = \\frac{\\varepsilon_0 A}{d}', 'U = \\frac{1}{2} C V^2'],
        highYieldPoints: ['Equipotential surfaces are always perpendicular to electric field lines.', 'Dielectric increases capacitance by factor K: C = K * C_0.']
      },
      {
        id: '12-phy-3',
        chapterNumber: 3,
        title: 'Current Electricity',
        pdfUrl: 'https://ncert.nic.in/textbook.php?leph1=3-8',
        summary: 'Electric current, drift velocity, Ohm’s law, temperature dependence of resistivity, Kirchhoff’s rules, Wheatstone bridge.',
        keyFormulas: ['I = n A e v_d', 'V = I R', 'R = \\rho \\frac{l}{A}', '\\sum I_{in} = \\sum I_{out}'],
        highYieldPoints: ['Drift velocity v_d = eE\\tau/m is proportional to applied electric field.', 'Wheatstone bridge is most sensitive when all 4 resistances are equal.']
      },
      {
        id: '12-phy-4',
        chapterNumber: 4,
        title: 'Moving Charges and Magnetism',
        pdfUrl: 'https://ncert.nic.in/textbook.php?leph1=4-8',
        summary: 'Biot-Savart law, magnetic field of circular loop, Ampere’s circuital law, solenoid, toroid, force on moving charge, moving coil galvanometer.',
        keyFormulas: ['\\vec{F} = q(\\vec{v} \\times \\vec{B})', 'dB = \\frac{\\mu_0}{4\\pi} \\frac{I dl \\sin\\theta}{r^2}', 'B_{solenoid} = \\mu_0 n I'],
        highYieldPoints: ['Magnetic force does zero work on a charged particle because F is always perpendicular to velocity.', 'Galvanometer to ammeter requires small shunt in parallel.']
      },
      {
        id: '12-phy-5',
        chapterNumber: 5,
        title: 'Magnetism and Matter',
        pdfUrl: 'https://ncert.nic.in/textbook.php?leph1=5-8',
        summary: 'Bar magnet as equivalent solenoid, magnetic dipole moment, Gauss’s law in magnetism, Earth’s magnetism, diamagnetism, paramagnetism, ferromagnetism.',
        keyFormulas: ['\\oint \\vec{B} \\cdot d\\vec{A} = 0', 'B_{axis} = \\frac{\\mu_0}{4\\pi} \\frac{2m}{r^3}'],
        highYieldPoints: ['Gauss law for magnetism implies magnetic monopoles do not exist.', 'Diamagnetic susceptibility is negative and independent of temperature.']
      },
      {
        id: '12-phy-6',
        chapterNumber: 6,
        title: 'Electromagnetic Induction',
        pdfUrl: 'https://ncert.nic.in/textbook.php?leph1=6-8',
        summary: 'Magnetic flux, Faraday’s law of induction, Lenz’s law, motional electromotive force, self-inductance, mutual inductance, AC generator.',
        keyFormulas: ['\\varepsilon = -\\frac{d\\Phi_B}{dt}', '\\varepsilon = B l v', 'L = \\frac{N \\Phi_B}{I}', 'U = \\frac{1}{2} L I^2'],
        highYieldPoints: ['Lenz law is a consequence of conservation of energy.', 'Motional EMF is produced when conductor cuts magnetic field lines.']
      },
      {
        id: '12-phy-7',
        chapterNumber: 7,
        title: 'Alternating Current',
        pdfUrl: 'https://ncert.nic.in/textbook.php?leph1=7-8',
        summary: 'AC voltage applied to resistor, inductor, capacitor, LCR series circuit, resonance, power in AC circuit, transformer.',
        keyFormulas: ['Z = \\sqrt{R^2 + (X_L - X_C)^2}', '\\omega_0 = \\frac{1}{\\sqrt{LC}}', 'P_{avg} = V_{rms} I_{rms} \\cos\\phi'],
        highYieldPoints: ['At resonance, impedance Z is purely resistive and current is maximum.', 'Power consumed in pure inductor or capacitor is zero (cos\\phi = 0).']
      },
      {
        id: '12-phy-8',
        chapterNumber: 8,
        title: 'Electromagnetic Waves',
        pdfUrl: 'https://ncert.nic.in/textbook.php?leph1=8-8',
        summary: 'Displacement current, Maxwell’s equations, characteristics of electromagnetic waves, electromagnetic spectrum from radio to gamma rays.',
        keyFormulas: ['I_d = \\varepsilon_0 \\frac{d\\Phi_E}{dt}', 'c = \\frac{1}{\\sqrt{\\mu_0 \\varepsilon_0}} = \\frac{E_0}{B_0}'],
        highYieldPoints: ['EM waves are transverse in nature and do not require material medium.', 'Accelerated charges radiate electromagnetic waves.']
      }
    ]
  },
  {
    id: 'ncert-12-chem-1',
    classLevel: 'Class 12',
    subject: 'Chemistry',
    title: 'Chemistry — Part I',
    code: 'lech1',
    coverColor: '#9333ea',
    officialPortalUrl: 'https://ncert.nic.in/textbook.php?lech1=0-5',
    chapters: [
      {
        id: '12-chem-1',
        chapterNumber: 1,
        title: 'Solutions',
        pdfUrl: 'https://ncert.nic.in/textbook.php?lech1=1-5',
        summary: 'Types of solutions, concentration terms, Raoult’s law, ideal and non-ideal solutions, colligative properties, van’t Hoff factor.',
        keyFormulas: ['p_A = p_A^\\circ x_A', '\\Delta T_b = i K_b m', '\\Delta T_f = i K_f m', '\\pi = i C R T'],
        highYieldPoints: ['Colligative properties depend only on number of solute particles, not their nature.', 'For dissociation, i > 1; for association, i < 1.']
      },
      {
        id: '12-chem-2',
        chapterNumber: 2,
        title: 'Electrochemistry',
        pdfUrl: 'https://ncert.nic.in/textbook.php?lech1=2-5',
        summary: 'Galvanic cells, Nernst equation, conductance in electrolytic solutions, Kohlrausch’s law, electrolysis, fuel cells, corrosion.',
        keyFormulas: ['E_{cell} = E^\\circ_{cell} - \\frac{0.0591}{n} \\log Q', '\\Delta G^\\circ = -n F E^\\circ_{cell}', '\\Lambda_m = \\frac{\\kappa \\times 1000}{M}'],
        highYieldPoints: ['Standard hydrogen electrode (SHE) is assigned an arbitrary potential of 0.00 V.', 'Kohlrausch law applies to calculate molar conductivity at infinite dilution.']
      },
      {
        id: '12-chem-3',
        chapterNumber: 3,
        title: 'Chemical Kinetics',
        pdfUrl: 'https://ncert.nic.in/textbook.php?lech1=3-5',
        summary: 'Rate of reaction, factors affecting rate, order and molecularity, integrated rate equations, pseudo-first order reactions, Arrhenius equation.',
        keyFormulas: ['k = \\frac{2.303}{t} \\log\\frac{[A]_0}{[A]}', 't_{1/2} = \\frac{0.693}{k}', 'k = A e^{-E_a / RT}'],
        highYieldPoints: ['Order can be zero, fraction, or integer, determined experimentally.', 'First order half-life is completely independent of initial concentration.']
      },
      {
        id: '12-chem-4',
        chapterNumber: 4,
        title: 'The d- and f-Block Elements',
        pdfUrl: 'https://ncert.nic.in/textbook.php?lech1=4-5',
        summary: 'Transition elements, electronic configurations, oxidation states, catalytic properties, magnetic properties, interstitial compounds, Lanthanoid contraction.',
        highYieldPoints: ['Lanthanoid contraction causes almost identical atomic radii for 4d and 5d elements (e.g., Zr and Hf).', 'Transition metal ions show color due to d-d electronic transitions.']
      },
      {
        id: '12-chem-5',
        chapterNumber: 5,
        title: 'Coordination Compounds',
        pdfUrl: 'https://ncert.nic.in/textbook.php?lech1=5-5',
        summary: 'Werner’s theory, ligands, IUPAC nomenclature, isomerism, Valence Bond Theory, Crystal Field Theory, spectrochemical series.',
        keyFormulas: ['\\mu = \\sqrt{n(n+2)} \\text{ BM}'],
        highYieldPoints: ['Strong field ligands (CN-, CO) cause pairing of electrons resulting in low-spin complexes.', 'Delta_t = (4/9) Delta_o (tetrahedral splitting is smaller than octahedral).']
      }
    ]
  },
  {
    id: 'ncert-12-math-1',
    classLevel: 'Class 12',
    subject: 'Mathematics',
    title: 'Mathematics — Part I',
    code: 'lemh1',
    coverColor: '#10b981',
    officialPortalUrl: 'https://ncert.nic.in/textbook.php?lemh1=0-6',
    chapters: [
      {
        id: '12-math-1',
        chapterNumber: 1,
        title: 'Relations and Functions',
        pdfUrl: 'https://ncert.nic.in/textbook.php?lemh1=1-6',
        summary: 'Reflexive, symmetric, transitive relations, equivalence relations, one-one (injective), onto (surjective), bijective functions.',
        highYieldPoints: ['A relation is an equivalence relation iff it is reflexive, symmetric, and transitive.', 'Bijective function has a unique inverse.']
      },
      {
        id: '12-math-2',
        chapterNumber: 2,
        title: 'Inverse Trigonometric Functions',
        pdfUrl: 'https://ncert.nic.in/textbook.php?lemh1=2-6',
        summary: 'Principal value branches of inverse trigonometric functions, domains, ranges, and fundamental trigonometric identities.',
        keyFormulas: ['\\sin^{-1}(x) + \\cos^{-1}(x) = \\frac{\\pi}{2}', '\\tan^{-1}(x) + \\cot^{-1}(x) = \\frac{\\pi}{2}'],
        highYieldPoints: ['Principal value branch of sin^-1 is [-pi/2, pi/2] and for cos^-1 is [0, pi].']
      },
      {
        id: '12-math-3',
        chapterNumber: 3,
        title: 'Matrices',
        pdfUrl: 'https://ncert.nic.in/textbook.php?lemh1=3-6',
        summary: 'Types of matrices, matrix addition, scalar multiplication, matrix multiplication, transpose of matrix, symmetric and skew-symmetric matrices.',
        keyFormulas: ['(AB)^T = B^T A^T', 'A = \\frac{1}{2}(A + A^T) + \\frac{1}{2}(A - A^T)'],
        highYieldPoints: ['Matrix multiplication is not commutative: AB != BA in general.', 'Diagonal elements of skew-symmetric matrix are always zero.']
      },
      {
        id: '12-math-4',
        chapterNumber: 4,
        title: 'Determinants',
        pdfUrl: 'https://ncert.nic.in/textbook.php?lemh1=4-6',
        summary: 'Properties of determinants, minors, cofactors, adjoint and inverse of a matrix, solving system of linear equations using matrix method.',
        keyFormulas: ['A^{-1} = \\frac{1}{|A|} \\text{adj}(A)', '|kA| = k^n |A|', '|\\text{adj}(A)| = |A|^{n-1}'],
        highYieldPoints: ['Matrix has an inverse iff it is non-singular (|A| != 0).', 'If any two rows or columns are identical, determinant is 0.']
      },
      {
        id: '12-math-5',
        chapterNumber: 5,
        title: 'Continuity and Differentiability',
        pdfUrl: 'https://ncert.nic.in/textbook.php?lemh1=5-6',
        summary: 'Continuity, differentiability, chain rule, implicit differentiation, logarithmic differentiation, second order derivatives, Rolle’s theorem.',
        keyFormulas: ['\\frac{d}{dx}[u \\cdot v] = u \\frac{dv}{dx} + v \\frac{du}{dx}', '\\frac{d}{dx}(\\ln x) = \\frac{1}{x}'],
        highYieldPoints: ['Every differentiable function is continuous, but the converse is not true.', 'Modulus function |x| is continuous everywhere but not differentiable at x=0.']
      },
      {
        id: '12-math-6',
        chapterNumber: 6,
        title: 'Application of Derivatives',
        pdfUrl: 'https://ncert.nic.in/textbook.php?lemh1=6-6',
        summary: 'Rate of change of quantities, increasing and decreasing functions, tangents and normals, maxima and minima, first and second derivative tests.',
        keyFormulas: ['f\'(x) > 0 \\implies \\text{strictly increasing}', 'f\'(c) = 0 \\text{ and } f\'\'(c) < 0 \\implies \\text{local maximum}'],
        highYieldPoints: ['Points where f\'(x)=0 or f\'(x) is undefined are critical points.', 'Second derivative test fails when f\'\'(c)=0; use first derivative test.']
      }
    ]
  },

  // ===================== CLASS 11 =====================
  {
    id: 'ncert-11-phy-1',
    classLevel: 'Class 11',
    subject: 'Physics',
    title: 'Physics — Part I (Class 11)',
    code: 'keph1',
    coverColor: '#0284c7',
    officialPortalUrl: 'https://ncert.nic.in/textbook.php?keph1=0-7',
    chapters: [
      {
        id: '11-phy-1',
        chapterNumber: 1,
        title: 'Units and Measurements',
        pdfUrl: 'https://ncert.nic.in/textbook.php?keph1=1-7',
        summary: 'SI units, fundamental and derived units, dimensional analysis and applications, errors in measurement and significant figures.',
        keyFormulas: ['[F] = [M L T^{-2}]', '[E] = [M L^2 T^{-2}]'],
        highYieldPoints: ['Principle of homogeneity: terms added or subtracted must have the same dimensions.', 'Angle is dimensionless but has units (radians).']
      },
      {
        id: '11-phy-2',
        chapterNumber: 2,
        title: 'Motion in a Straight Line',
        pdfUrl: 'https://ncert.nic.in/textbook.php?keph1=2-7',
        summary: 'Position-time graphs, instantaneous velocity, acceleration, kinematic equations for uniformly accelerated motion.',
        keyFormulas: ['v = u + at', 's = ut + \\frac{1}{2}at^2', 'v^2 - u^2 = 2as'],
        highYieldPoints: ['Slope of position-time graph gives velocity.', 'Area under acceleration-time graph gives change in velocity.']
      },
      {
        id: '11-phy-3',
        chapterNumber: 3,
        title: 'Motion in a Plane',
        pdfUrl: 'https://ncert.nic.in/textbook.php?keph1=3-7',
        summary: 'Scalars and vectors, vector addition, resolution of vectors, projectile motion, uniform circular motion and centripetal acceleration.',
        keyFormulas: ['R = \\frac{u^2 \\sin(2\\theta)}{g}', 'H = \\frac{u^2 \\sin^2\\theta}{2g}', 'T = \\frac{2u \\sin\\theta}{g}', 'a_c = \\frac{v^2}{r}'],
        highYieldPoints: ['Maximum range of projectile occurs at launching angle \\theta = 45^\\circ.', 'At highest point of projectile motion, vertical velocity is zero but acceleration is g downward.']
      },
      {
        id: '11-phy-4',
        chapterNumber: 4,
        title: 'Laws of Motion',
        pdfUrl: 'https://ncert.nic.in/textbook.php?keph1=4-7',
        summary: 'Newton’s three laws of motion, inertia, momentum, impulse, conservation of linear momentum, friction, circular banking.',
        keyFormulas: ['\\vec{F} = \\frac{d\\vec{p}}{dt} = m\\vec{a}', 'f_s \\le \\mu_s N', 'v_{max} = \\sqrt{\\mu r g}'],
        highYieldPoints: ['Action and reaction forces act on different bodies simultaneously.', 'Static friction is self-adjusting up to limiting friction value.']
      },
      {
        id: '11-phy-5',
        chapterNumber: 5,
        title: 'Work, Energy and Power',
        pdfUrl: 'https://ncert.nic.in/textbook.php?keph1=5-7',
        summary: 'Work done by constant and variable force, kinetic energy, work-energy theorem, potential energy of spring, conservation of mechanical energy.',
        keyFormulas: ['W = \\vec{F} \\cdot \\vec{d} = F d \\cos\\theta', 'W_{net} = \\Delta K', 'U_{spring} = \\frac{1}{2}kx^2', 'P = \\vec{F} \\cdot \\vec{v}'],
        highYieldPoints: ['Work-energy theorem is valid for all types of forces (conservative and non-conservative).', 'Conservative force work in a closed loop is always zero.']
      }
    ]
  },
  {
    id: 'ncert-11-chem-1',
    classLevel: 'Class 11',
    subject: 'Chemistry',
    title: 'Chemistry — Part I (Class 11)',
    code: 'kech1',
    coverColor: '#9333ea',
    officialPortalUrl: 'https://ncert.nic.in/textbook.php?kech1=0-6',
    chapters: [
      {
        id: '11-chem-1',
        chapterNumber: 1,
        title: 'Some Basic Concepts of Chemistry',
        pdfUrl: 'https://ncert.nic.in/textbook.php?kech1=1-6',
        summary: 'Matter, laws of chemical combination, Dalton’s atomic theory, atomic and molecular mass, mole concept, molar mass, empirical and molecular formula.',
        keyFormulas: ['n = \\frac{\\text{mass}}{\\text{molar mass}}', '\\text{Molarity} = \\frac{\\text{moles of solute}}{\\text{Volume of solution (L)}}'],
        highYieldPoints: ['One mole of any substance contains 6.022 * 10^23 entities (Avogadro number).', 'Limiting reagent decides the theoretical yield of product formed.']
      },
      {
        id: '11-chem-2',
        chapterNumber: 2,
        title: 'Structure of Atom',
        pdfUrl: 'https://ncert.nic.in/textbook.php?kech1=2-6',
        summary: 'Subatomic particles, Bohr’s model of hydrogen atom, de Broglie relation, Heisenberg uncertainty principle, quantum numbers, Aufbau principle, Hund’s rule.',
        keyFormulas: ['E = h\\nu = \\frac{hc}{\\lambda}', '\\lambda = \\frac{h}{mv}', '\\Delta x \\cdot \\Delta p \\ge \\frac{h}{4\\pi}'],
        highYieldPoints: ['Principal (n), azimuthal (l), magnetic (ml), and spin (ms) quantum numbers describe electron state.', 'Half-filled and completely filled subshells have extra stability due to symmetry and exchange energy.']
      },
      {
        id: '11-chem-3',
        chapterNumber: 3,
        title: 'Chemical Bonding and Molecular Structure',
        pdfUrl: 'https://ncert.nic.in/textbook.php?kech1=3-6',
        summary: 'Ionic and covalent bonds, Lewis structures, resonance, VSEPR theory, hybridization (sp, sp2, sp3, sp3d), Molecular Orbital Theory (MOT), hydrogen bonding.',
        keyFormulas: ['\\text{Bond Order} = \\frac{N_b - N_a}{2}'],
        highYieldPoints: ['Oxygen molecule O2 is paramagnetic according to Molecular Orbital Theory due to 2 unpaired electrons in pi* orbitals.', 'Hydrogen bonding occurs only with highly electronegative atoms: F, O, N.']
      }
    ]
  },

  // ===================== CLASS 10 =====================
  {
    id: 'ncert-10-sci',
    classLevel: 'Class 10',
    subject: 'Science',
    title: 'Science (Class 10)',
    code: 'jesc1',
    coverColor: '#059669',
    officialPortalUrl: 'https://ncert.nic.in/textbook.php?jesc1=0-13',
    chapters: [
      {
        id: '10-sci-1',
        chapterNumber: 1,
        title: 'Chemical Reactions and Equations',
        pdfUrl: 'https://ncert.nic.in/textbook.php?jesc1=1-13',
        summary: 'Chemical equations, balancing, types of reactions: combination, decomposition, displacement, double displacement, oxidation and reduction, corrosion and rancidity.',
        highYieldPoints: ['Balancing equations obeys the law of conservation of mass.', 'Respiration is an exothermic decomposition reaction.']
      },
      {
        id: '10-sci-2',
        chapterNumber: 2,
        title: 'Acids, Bases and Salts',
        pdfUrl: 'https://ncert.nic.in/textbook.php?jesc1=2-13',
        summary: 'Chemical properties of acids and bases, pH scale, importance of pH in everyday life, salts (bleaching powder, baking soda, washing soda, plaster of paris).',
        highYieldPoints: ['pH < 7 is acidic, pH = 7 is neutral, pH > 7 is basic.', 'Plaster of Paris formula is CaSO4 . 1/2 H2O.']
      },
      {
        id: '10-sci-6',
        chapterNumber: 6,
        title: 'Life Processes',
        pdfUrl: 'https://ncert.nic.in/textbook.php?jesc1=5-13',
        summary: 'Nutrition in plants and animals, respiration (aerobic and anaerobic), transportation in human beings and plants, excretion in human beings and plants.',
        highYieldPoints: ['Xylem transports water and minerals; phloem transports food (translocation).', 'Nephron is the basic structural and functional filtration unit of kidneys.']
      },
      {
        id: '10-sci-9',
        chapterNumber: 9,
        title: 'Light — Reflection and Refraction',
        pdfUrl: 'https://ncert.nic.in/textbook.php?jesc1=9-13',
        summary: 'Reflection of light by spherical mirrors, mirror formula, magnification, refraction of light, Snell’s law, refractive index, lenses, lens formula, power of lens.',
        keyFormulas: ['\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}', '\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}', 'P = \\frac{1}{f(\\text{m})}'],
        highYieldPoints: ['Convex lens has positive focal length; concave lens has negative focal length.', 'Power of lens is measured in Dioptres (D) where D = 1/m.']
      },
      {
        id: '10-sci-11',
        chapterNumber: 11,
        title: 'Electricity',
        pdfUrl: 'https://ncert.nic.in/textbook.php?jesc1=11-13',
        summary: 'Electric current and circuit, electric potential and potential difference, Ohm’s law, resistance, factors affecting resistance, series and parallel combination, heating effect, electric power.',
        keyFormulas: ['V = I R', 'R_s = R_1 + R_2', '\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2}', 'H = I^2 R t', 'P = V I = I^2 R = \\frac{V^2}{R}'],
        highYieldPoints: ['Ammeter is connected in series (low resistance); Voltmeter is connected in parallel (high resistance).', 'Joule heating H = I^2 R t shows heat is proportional to square of current.']
      }
    ]
  },

  // ===================== CLASS 9 =====================
  {
    id: 'ncert-9-sci',
    classLevel: 'Class 9',
    subject: 'Science',
    title: 'Science (Class 9)',
    code: 'iesc1',
    coverColor: '#d97706',
    officialPortalUrl: 'https://ncert.nic.in/textbook.php?iesc1=0-12',
    chapters: [
      {
        id: '9-sci-1',
        chapterNumber: 1,
        title: 'Matter in Our Surroundings',
        pdfUrl: 'https://ncert.nic.in/textbook.php?iesc1=1-12',
        summary: 'Physical nature of matter, states of matter (solid, liquid, gas), change of state, latent heat of fusion and vaporization, evaporation factors.',
        highYieldPoints: ['Evaporation causes cooling due to absorption of latent heat from surroundings.', 'Temperature in Kelvin = Temperature in Celsius + 273.15.']
      },
      {
        id: '9-sci-7',
        chapterNumber: 7,
        title: 'Motion',
        pdfUrl: 'https://ncert.nic.in/textbook.php?iesc1=7-12',
        summary: 'Distance and displacement, speed and velocity, uniform and non-uniform motion, acceleration, graphical representation, equations of motion.',
        keyFormulas: ['v = u + at', 's = ut + \\frac{1}{2}at^2', 'v^2 = u^2 + 2as'],
        highYieldPoints: ['Distance is a scalar (always >= 0); displacement is a vector (can be zero or negative).', 'Slope of distance-time graph gives speed.']
      },
      {
        id: '9-sci-8',
        chapterNumber: 8,
        title: 'Force and Laws of Motion',
        pdfUrl: 'https://ncert.nic.in/textbook.php?iesc1=8-12',
        summary: 'Balanced and unbalanced forces, first law of motion (inertia), second law of motion (F=ma), third law of motion (action-reaction), momentum conservation.',
        keyFormulas: ['F = m a', 'p = m v', 'm_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2'],
        highYieldPoints: ['Inertia depends directly on the mass of the body.', 'Impulse equals change in momentum: J = F * \\Delta t = \\Delta p.']
      },
      {
        id: '9-sci-9',
        chapterNumber: 9,
        title: 'Gravitation',
        pdfUrl: 'https://ncert.nic.in/textbook.php?iesc1=9-12',
        summary: 'Universal law of gravitation, free fall, value of g, mass vs weight, thrust and pressure, Archimedes’ principle, relative density.',
        keyFormulas: ['F = G \\frac{M m}{r^2}', 'g = \\frac{G M}{R^2}', 'W = m g'],
        highYieldPoints: ['G is a universal constant: 6.67 * 10^-11 N m^2 / kg^2.', 'Weight of an object on the Moon is 1/6th of its weight on Earth.']
      }
    ]
  }
];
