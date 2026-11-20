import { NCERTBook } from './types';

export const CLASS_12_BOOKS: NCERTBook[] = [
  // Physics Part I
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
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/leph101.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?leph1=1-8',
        summary: 'Coulomb’s law, electric field lines, electric dipole, Gauss’s law and applications to line, sheet, and spherical charges.',
        detailedTheory: 'Electrostatics deals with forces, fields, and potentials arising from static charges. Charges are quantized ($q = ne$) and conserved. Coulomb\'s law gives mutual force $F = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q_1 q_2}{r^2}$. Gauss\'s Law states that total flux through a closed surface equals enclosed charge divided by $\\varepsilon_0$.',
        keyFormulas: [
          'F = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q_1 q_2}{r^2}',
          '\\oint \\vec{E} \\cdot d\\vec{A} = \\frac{q_{enc}}{\\varepsilon_0}',
          'E_{line} = \\frac{\\lambda}{2\\pi\\varepsilon_0 r}',
          'E_{sheet} = \\frac{\\sigma}{2\\varepsilon_0}',
          '\\vec{\\tau} = \\vec{p} \\times \\vec{E}'
        ],
        highYieldPoints: [
          'Electric field inside a uniformly charged conducting spherical shell is zero.',
          'Electric field lines never cross each other.',
          'Gauss law is only valid for closed Gaussian surfaces.'
        ]
      },
      {
        id: '12-phy-2',
        chapterNumber: 2,
        title: 'Electrostatic Potential and Capacitance',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/leph102.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?leph1=2-8',
        summary: 'Electric potential, equipotential surfaces, potential energy of charges, parallel plate capacitors, dielectrics.',
        keyFormulas: [
          'V = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q}{r}',
          'C = \\frac{\\varepsilon_0 A}{d}',
          'U = \\frac{1}{2} C V^2 = \\frac{Q^2}{2C}',
          'C_{parallel} = C_1 + C_2',
          '\\frac{1}{C_{series}} = \\frac{1}{C_1} + \\frac{1}{C_2}'
        ],
        highYieldPoints: [
          'Equipotential surfaces never intersect.',
          'Dielectrics reduce internal electric field by $E = E_0 / K$.'
        ]
      },
      {
        id: '12-phy-3',
        chapterNumber: 3,
        title: 'Current Electricity',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/leph103.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?leph1=3-8',
        summary: 'Electric current, drift velocity, Ohm’s law, resistivity, Kirchhoff’s laws, Wheatstone bridge, internal resistance.',
        keyFormulas: [
          'I = n A e v_d',
          'v_d = \\frac{e E \\tau}{m}',
          'V = I R',
          '\\frac{P}{Q} = \\frac{R}{S} \\text{ (Wheatstone)}',
          'P = V I = I^2 R = \\frac{V^2}{R}'
        ],
        highYieldPoints: [
          'Kirchhoff\'s loop law is based on conservation of energy.',
          'Kirchhoff\'s junction law is based on conservation of electric charge.'
        ]
      },
      {
        id: '12-phy-4',
        chapterNumber: 4,
        title: 'Moving Charges and Magnetism',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/leph104.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?leph1=4-8',
        summary: 'Biot-Savart law, circular coil magnetic field, Ampere’s circuital law, solenoid, magnetic force, moving coil galvanometer.',
        keyFormulas: [
          '\\vec{F} = q(\\vec{v} \\times \\vec{B})',
          'dB = \\frac{\\mu_0}{4\\pi} \\frac{I dl \\sin\\theta}{r^2}',
          'B_{axis} = \\frac{\\mu_0 I R^2}{2(R^2 + x^2)^{3/2}}',
          '\\oint \\vec{B} \\cdot d\\vec{l} = \\mu_0 I_{enc}',
          'S = \\frac{I_g R_g}{I - I_g}'
        ],
        highYieldPoints: [
          'Magnetic Lorentz force does zero work on a charged particle ($W = 0$).',
          'A galvanometer is converted to an ammeter by connecting a low shunt resistance in parallel.'
        ]
      }
    ]
  },

  // Physics Part II
  {
    id: 'ncert-12-phy-2',
    classLevel: 'Class 12',
    subject: 'Physics',
    title: 'Physics — Part II',
    code: 'leph2',
    coverColor: '#0369a1',
    officialPortalUrl: 'https://ncert.nic.in/textbook.php?leph2=0-6',
    chapters: [
      {
        id: '12-phy-9',
        chapterNumber: 9,
        title: 'Ray Optics and Optical Instruments',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/leph201.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?leph2=1-6',
        summary: 'Reflection, refraction, total internal reflection, prism, lens formula, microscopes, astronomical telescopes.',
        keyFormulas: [
          '\\frac{1}{f} = (\\mu - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)',
          '\\mu = \\frac{\\sin\\left(\\frac{A + D_m}{2}\\right)}{\\sin(A/2)}',
          'm_{micro} = \\frac{L}{f_o}\\left(1 + \\frac{D}{f_e}\\right)',
          'm_{tele} = \\frac{f_o}{f_e}'
        ],
        highYieldPoints: [
          'Critical angle condition: light travels from denser to rarer medium and angle of incidence exceeds $i_c$.',
          'In normal adjustment of an astronomical telescope, the length of the tube is $L = f_o + f_e$.'
        ]
      },
      {
        id: '12-phy-11',
        chapterNumber: 11,
        title: 'Dual Nature of Radiation and Matter',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/leph203.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?leph2=3-6',
        summary: 'Photoelectric effect, Einstein’s photoelectric equation, threshold frequency, de Broglie wavelength.',
        keyFormulas: [
          'K_{max} = h\\nu - \\phi_0 = e V_0',
          '\\lambda = \\frac{h}{p} = \\frac{h}{mv} = \\frac{1.227}{\\sqrt{V}}\\text{ nm}'
        ],
        highYieldPoints: [
          'Photoelectric emission is instantaneous ($< 10^{-9}\\text{ s}$).',
          'Stopping potential depends only on frequency of incident light, not intensity.'
        ]
      },
      {
        id: '12-phy-14',
        chapterNumber: 14,
        title: 'Semiconductor Electronics',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/leph206.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?leph2=6-6',
        summary: 'Intrinsic and extrinsic semiconductors, p-n junction diode, forward and reverse bias, half and full wave rectifiers.',
        keyFormulas: [
          'n_e n_h = n_i^2',
          '\\eta = \\frac{P_{dc}}{P_{ac}} = 81.2\\% \\text{ (Full Wave)}'
        ],
        highYieldPoints: [
          'In forward bias, depletion layer width decreases; in reverse bias, it increases.',
          'Full-wave rectifier ripple frequency is $2f$, while half-wave is $f$.'
        ]
      }
    ]
  },

  // Chemistry Part I
  {
    id: 'ncert-12-chem-1',
    classLevel: 'Class 12',
    subject: 'Chemistry',
    title: 'Chemistry — Part I',
    code: 'lech1',
    coverColor: '#7c3aed',
    officialPortalUrl: 'https://ncert.nic.in/textbook.php?lech1=0-5',
    chapters: [
      {
        id: '12-chem-1',
        chapterNumber: 1,
        title: 'Solutions',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/lech101.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?lech1=1-5',
        summary: 'Raoult’s law, ideal and non-ideal solutions, colligative properties (relative lowering of VP, boiling elevation, freezing depression, osmotic pressure), van’t Hoff factor.',
        keyFormulas: [
          '\\frac{P^\\circ - P}{P^\\circ} = i \\cdot X_B',
          '\\Delta T_b = i \\cdot K_b \\cdot m',
          '\\Delta T_f = i \\cdot K_f \\cdot m',
          '\\Pi = i \\cdot C R T',
          'i = 1 + (n - 1)\\alpha'
        ],
        highYieldPoints: [
          'Osmotic pressure is the most suitable colligative property for determining molecular masses of polymers and biomolecules.',
          'Azeotropes are constant boiling mixtures that boil at a constant temperature without change in composition.'
        ]
      },
      {
        id: '12-chem-2',
        chapterNumber: 2,
        title: 'Electrochemistry',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/lech102.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?lech1=2-5',
        summary: 'Galvanic cells, Nernst equation, standard electrode potentials, Kohlrausch’s law, Faraday’s laws of electrolysis, batteries.',
        keyFormulas: [
          'E_{cell} = E^\\circ_{cell} - \\frac{0.0591}{n}\\log Q',
          '\\Delta G^\\circ = -n F E^\\circ_{cell}',
          '\\Lambda_m = \\frac{\\kappa \\times 1000}{M}',
          '\\Lambda^\circ_m = \\nu_+ \\lambda_+^\circ + \\nu_- \\lambda_-^\circ'
        ],
        highYieldPoints: [
          'Kohlrausch law applies to calculate molar conductivity of weak electrolytes at infinite dilution.',
          'Lead storage battery uses $PbO_2$ cathode and $Pb$ anode with $38\\%\\text{ } H_2SO_4$.'
        ]
      },
      {
        id: '12-chem-3',
        chapterNumber: 3,
        title: 'Chemical Kinetics',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/lech103.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?lech1=3-5',
        summary: 'Reaction rates, rate law, integrated rate equations for zero and first order, half-life, Arrhenius equation, activation energy.',
        keyFormulas: [
          'k = \\frac{2.303}{t}\\log\\left(\\frac{[A]_0}{[A]}\\right) \\text{ (1st Order)}',
          't_{1/2} = \\frac{0.693}{k}',
          'k = A e^{-E_a / RT}',
          '\\log\\left(\\frac{k_2}{k_1}\\right) = \\frac{E_a}{2.303R}\\left(\\frac{T_2 - T_1}{T_1 T_2}\\right)'
        ],
        highYieldPoints: [
          'Half-life of a first order reaction is independent of initial concentration.',
          'Molecularity cannot be zero or non-integer, but order of reaction can be zero, fractional, or negative.'
        ]
      }
    ]
  },

  // Chemistry Part II
  {
    id: 'ncert-12-chem-2',
    classLevel: 'Class 12',
    subject: 'Chemistry',
    title: 'Chemistry — Part II (Organic)',
    code: 'lech2',
    coverColor: '#6d28d9',
    officialPortalUrl: 'https://ncert.nic.in/textbook.php?lech2=0-5',
    chapters: [
      {
        id: '12-chem-6',
        chapterNumber: 6,
        title: 'Haloalkanes and Haloarenes',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/lech201.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?lech2=1-5',
        summary: 'SN1 and SN2 mechanisms, stereochemistry, inversion of configuration, Grignard reagents, elimination reactions, polyhalogen compounds.',
        keyFormulas: [
          '\\text{Rate}_{SN1} = k[RX] \\text{ (Racemization)}',
          '\\text{Rate}_{SN2} = k[RX][Nu^-] \\text{ (Walden Inversion)}'
        ],
        highYieldPoints: [
          'SN2 follows order: methyl > 1° > 2° > 3° halide with complete Walden inversion.',
          'SN1 follows carbocation stability: 3° > 2° > 1° halide with partial racemization.'
        ]
      },
      {
        id: '12-chem-8',
        chapterNumber: 8,
        title: 'Aldehydes, Ketones and Carboxylic Acids',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/lech203.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?lech2=3-5',
        summary: 'Nucleophilic addition, aldol condensation, Cannizzaro reaction, Clemmensen reduction, Wolff-Kishner reduction, Tollens and Fehling tests.',
        highYieldPoints: [
          'Aldehydes with alpha-hydrogen undergo Aldol condensation; aldehydes lacking alpha-hydrogen undergo Cannizzaro reaction.',
          'Tollens\' test yields silver mirror with aldehydes but gives negative test with ketones.'
        ]
      },
      {
        id: '12-chem-10',
        chapterNumber: 10,
        title: 'Biomolecules',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/lech205.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?lech2=5-5',
        summary: 'Carbohydrates, glucose structure, peptide bond, primary/secondary/tertiary protein structure, denaturation, DNA/RNA nucleic acids.',
        highYieldPoints: [
          'Denaturation destroys 2° and 3° structures of proteins, leaving 1° structure intact.',
          'DNA contains Adenine, Guanine, Cytosine, Thymine; RNA contains Uracil in place of Thymine.'
        ]
      }
    ]
  },

  // Mathematics Part I
  {
    id: 'ncert-12-math-1',
    classLevel: 'Class 12',
    subject: 'Mathematics',
    title: 'Mathematics — Part I',
    code: 'lemh1',
    coverColor: '#059669',
    officialPortalUrl: 'https://ncert.nic.in/textbook.php?lemh1=0-6',
    chapters: [
      {
        id: '12-math-1',
        chapterNumber: 1,
        title: 'Relations and Functions',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/lemh101.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?lemh1=1-6',
        summary: 'Reflexive, symmetric, transitive relations, equivalence relations, one-one (injective), onto (surjective), bijective functions.',
        highYieldPoints: [
          'A relation is an equivalence relation iff it is reflexive, symmetric, and transitive.',
          'A function is invertible iff it is both one-one and onto (bijective).'
        ]
      },
      {
        id: '12-math-3',
        chapterNumber: 3,
        title: 'Matrices',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/lemh103.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?lemh1=3-6',
        summary: 'Matrix multiplication, symmetric and skew-symmetric matrices, elementary row operations, inverse matrix.',
        keyFormulas: [
          '(A B)^T = B^T A^T',
          'A = \\frac{1}{2}(A + A^T) + \\frac{1}{2}(A - A^T)',
          'A A^{-1} = I'
        ],
        highYieldPoints: [
          'Matrix multiplication is generally non-commutative ($AB \\ne BA$).',
          'Any square matrix can be uniquely expressed as the sum of a symmetric and skew-symmetric matrix.'
        ]
      },
      {
        id: '12-math-4',
        chapterNumber: 4,
        title: 'Determinants',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/lemh104.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?lemh1=4-6',
        summary: 'Minors, cofactors, adjoint of matrix, Cramer’s rule, inverse using adjoint, solving systems of linear equations.',
        keyFormulas: [
          'A^{-1} = \\frac{1}{\\det A}\\text{adj}(A)',
          '\\det(\\text{adj } A) = (\\det A)^{n-1}',
          '\\det(k A) = k^n \\det(A)'
        ],
        highYieldPoints: [
          'System of linear equations $AX = B$ has a unique solution if $\\det(A) \\ne 0$.',
          'If two rows or columns of a determinant are identical, its value is 0.'
        ]
      }
    ]
  },

  // Mathematics Part II
  {
    id: 'ncert-12-math-2',
    classLevel: 'Class 12',
    subject: 'Mathematics',
    title: 'Mathematics — Part II',
    code: 'lemh2',
    coverColor: '#047857',
    officialPortalUrl: 'https://ncert.nic.in/textbook.php?lemh2=0-7',
    chapters: [
      {
        id: '12-math-7',
        chapterNumber: 7,
        title: 'Integrals',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/lemh201.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?lemh2=1-7',
        summary: 'Integration by substitution, partial fractions, integration by parts, definite integrals and properties.',
        keyFormulas: [
          '\\int u v \\, dx = u \\int v \\, dx - \\int \\left(u\' \\int v \\, dx\\right) dx',
          '\\int_a^b f(x)\\,dx = \\int_a^b f(a + b - x)\\,dx',
          '\\int_{-a}^a f(x)\\,dx = 2\\int_0^a f(x)\\,dx \\text{ (if even)}'
        ],
        highYieldPoints: [
          '$\\int_{-a}^a f(x)\\,dx = 0$ if $f(x)$ is an odd function.',
          'King’s property: $\\int_0^a f(x)\\,dx = \\int_0^a f(a - x)\\,dx$.'
        ]
      },
      {
        id: '12-math-10',
        chapterNumber: 10,
        title: 'Vector Algebra',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/lemh204.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?lemh2=4-7',
        summary: 'Dot product, cross product, projection of vectors, direction cosines, scalar triple product.',
        keyFormulas: [
          '\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta',
          '|\\vec{a} \\times \\vec{b}| = |\\vec{a}||\\vec{b}|\\sin\\theta',
          '\\text{proj}_{\\vec{b}}\\vec{a} = \\frac{\\vec{a}\\cdot\\vec{b}}{|\\vec{b}|}'
        ],
        highYieldPoints: [
          'Two non-zero vectors $\\vec{a}$ and $\\vec{b}$ are perpendicular iff $\\vec{a} \\cdot \\vec{b} = 0$.',
          'Two non-zero vectors are parallel iff $\\vec{a} \\times \\vec{b} = \\vec{0}$.'
        ]
      }
    ]
  },

  // Biology Class 12
  {
    id: 'ncert-12-bio',
    classLevel: 'Class 12',
    subject: 'Biology',
    title: 'Biology (Class 12)',
    code: 'lebo1',
    coverColor: '#16a34a',
    officialPortalUrl: 'https://ncert.nic.in/textbook.php?lebo1=0-13',
    chapters: [
      {
        id: '12-bio-2',
        chapterNumber: 2,
        title: 'Sexual Reproduction in Flowering Plants',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/lebo102.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?lebo1=2-13',
        summary: 'Microsporogenesis, megasporogenesis, pollination mechanisms, double fertilization, endosperm, seed development.',
        highYieldPoints: [
          'Double fertilization produces diploid zygote ($2n$) and triploid primary endosperm nucleus PEN ($3n$).',
          'Mature female gametophyte (embryo sac) is 8-nucleate and 7-celled.'
        ]
      },
      {
        id: '12-bio-5',
        chapterNumber: 5,
        title: 'Principles of Inheritance and Variation',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/lebo105.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?lebo1=5-13',
        summary: 'Mendelian genetics, monohybrid and dihybrid crosses, incomplete dominance, chromosomal theory, genetic disorders.',
        highYieldPoints: [
          'Mendelian dihybrid phenotypic ratio in $F_2$ generation is 9:3:3:1.',
          'Sickle cell anaemia is caused by substitution of Glutamic acid by Valine at 6th position of beta-globin.'
        ]
      }
    ]
  }
];
