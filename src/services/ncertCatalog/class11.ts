import { NCERTBook } from './types';

export const CLASS_11_BOOKS: NCERTBook[] = [
  // Physics Part I
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
        id: '11-phy-2',
        chapterNumber: 2,
        title: 'Motion in a Straight Line',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/keph102.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?keph1=2-7',
        summary: 'Position-time graphs, instantaneous velocity, acceleration, kinematic equations for constant acceleration.',
        keyFormulas: [
          'v = u + a t',
          's = u t + \\frac{1}{2} a t^2',
          'v^2 - u^2 = 2 a s',
          's_n = u + \\frac{a}{2}(2n - 1)'
        ],
        highYieldPoints: [
          'Area under velocity-time graph gives displacement.',
          'Slope of position-time graph gives instantaneous velocity.'
        ]
      },
      {
        id: '11-phy-3',
        chapterNumber: 3,
        title: 'Motion in a Plane (Vectors & Projectiles)',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/keph103.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?keph1=3-7',
        summary: 'Vectors, projectile motion, horizontal range, maximum height, centripetal acceleration.',
        keyFormulas: [
          'R = \\frac{u^2 \\sin(2\\theta)}{g}',
          'H = \\frac{u^2 \\sin^2\\theta}{2g}',
          'T = \\frac{2u \\sin\\theta}{g}',
          'a_c = \\frac{v^2}{r}'
        ],
        highYieldPoints: [
          'Maximum projectile range occurs at an angle of 45° with the horizontal.',
          'At maximum height, vertical velocity is zero but horizontal velocity remains $u\\cos\\theta$.'
        ]
      },
      {
        id: '11-phy-4',
        chapterNumber: 4,
        title: 'Laws of Motion',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/keph104.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?keph1=4-7',
        summary: 'Newton’s laws, impulse, momentum conservation, static and kinetic friction, banking of curves.',
        keyFormulas: [
          '\\vec{F} = m \\vec{a}',
          'f_s \\le \\mu_s N',
          'v_{banked} = \\sqrt{r g \\tan\\theta}'
        ],
        highYieldPoints: [
          'Limiting static friction is independent of contact area.',
          'Action and reaction always act on two different bodies simultaneously.'
        ]
      }
    ]
  },

  // Physics Part II
  {
    id: 'ncert-11-phy-2',
    classLevel: 'Class 11',
    subject: 'Physics',
    title: 'Physics — Part II (Class 11)',
    code: 'keph2',
    coverColor: '#0369a1',
    officialPortalUrl: 'https://ncert.nic.in/textbook.php?keph2=0-7',
    chapters: [
      {
        id: '11-phy-11',
        chapterNumber: 11,
        title: 'Thermodynamics',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/keph204.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?keph2=4-7',
        summary: 'First law of thermodynamics ($dQ = dU + dW$), isothermal and adiabatic processes, Carnot engine efficiency, second law.',
        keyFormulas: [
          '\\Delta Q = \\Delta U + \\Delta W',
          'W_{iso} = n R T \\ln\\left(\\frac{V_2}{V_1}\\right)',
          'P V^\\gamma = \\text{constant}',
          '\\eta = 1 - \\frac{T_2}{T_1}'
        ],
        highYieldPoints: [
          'In an adiabatic expansion, the internal temperature of the gas always decreases.',
          'Internal energy of an ideal gas depends solely on its absolute temperature.'
        ]
      },
      {
        id: '11-phy-14',
        chapterNumber: 14,
        title: 'Oscillations & Waves',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/keph206.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?keph2=6-7',
        summary: 'Simple harmonic motion (SHM), spring-mass system, simple pendulum time period, sound waves, Doppler effect.',
        keyFormulas: [
          'T = 2\\pi \\sqrt{\\frac{L}{g}} \\text{ (Pendulum)}',
          'T = 2\\pi \\sqrt{\\frac{m}{k}} \\text{ (Spring)}',
          'v = \\sqrt{\\frac{\\gamma P}{\\rho}} \\text{ (Laplace)}'
        ],
        highYieldPoints: [
          'In SHM, acceleration is directly proportional to displacement and directed towards mean position: $a = -\\omega^2 x$.',
          'Total mechanical energy in SHM is conserved: $E = \\frac{1}{2} m \\omega^2 A^2$.'
        ]
      }
    ]
  },

  // Chemistry Part I
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
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/kech101.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?kech1=1-6',
        summary: 'Mole concept, stoichiometry, molarity, molality, limiting reagent, empirical formula.',
        keyFormulas: [
          'n = \\frac{\\text{mass}}{\\text{molar mass}}',
          'M = \\frac{\\text{moles of solute}}{\\text{Volume of solution (L)}}',
          'm = \\frac{\\text{moles of solute}}{\\text{mass of solvent (kg)}}'
        ],
        highYieldPoints: [
          'One mole of ideal gas occupies 22.4 L at STP ($0^\\circ\\text{C}$ and 1 atm).',
          'Molality is temperature-independent, whereas molarity changes with temperature.'
        ]
      },
      {
        id: '11-chem-3',
        chapterNumber: 3,
        title: 'Chemical Bonding & Molecular Structure',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/kech103.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?kech1=3-6',
        summary: 'VSEPR theory, hybridization (sp, sp2, sp3, sp3d), Molecular Orbital Theory, bond order, hydrogen bonding.',
        keyFormulas: [
          '\\text{Bond Order} = \\frac{N_b - N_a}{2}'
        ],
        highYieldPoints: [
          'Oxygen $O_2$ has 2 unpaired electrons in antibonding orbitals and is paramagnetic.',
          'Higher bond order corresponds to greater bond stability and shorter bond length.'
        ]
      }
    ]
  },

  // Chemistry Part II
  {
    id: 'ncert-11-chem-2',
    classLevel: 'Class 11',
    subject: 'Chemistry',
    title: 'Chemistry — Part II (Class 11)',
    code: 'kech2',
    coverColor: '#7e22ce',
    officialPortalUrl: 'https://ncert.nic.in/textbook.php?kech2=0-4',
    chapters: [
      {
        id: '11-chem-8',
        chapterNumber: 8,
        title: 'Organic Chemistry: Basic Principles & Techniques',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/kech202.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?kech2=2-4',
        summary: 'IUPAC nomenclature, inductive effect, electromeric effect, resonance, hyperconjugation, carbocation stability.',
        highYieldPoints: [
          'Carbocation stability order: 3° > 2° > 1° > methyl (stabilized by hyperconjugation and +I effect).',
          'Hyperconjugation is a permanent electron displacement effect involving $\\sigma$-electrons of C-H bond.'
        ]
      },
      {
        id: '11-chem-9',
        chapterNumber: 9,
        title: 'Hydrocarbons',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/kech203.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?kech2=3-4',
        summary: 'Alkanes, alkenes, alkynes, Markovnikov addition, anti-Markovnikov peroxide effect, aromaticity, Huckel’s rule ($4n+2$).',
        keyFormulas: [
          '4n + 2 \\text{ } \\pi \\text{ electrons (Aromaticity)}'
        ],
        highYieldPoints: [
          'Markovnikov addition adds the negative part of the addendum to the carbon holding fewer hydrogen atoms.',
          'Peroxide effect (Kharasch effect) operates only with HBr, not with HCl or HI.'
        ]
      }
    ]
  },

  // Mathematics Class 11
  {
    id: 'ncert-11-math',
    classLevel: 'Class 11',
    subject: 'Mathematics',
    title: 'Mathematics (Class 11)',
    code: 'kemh1',
    coverColor: '#10b981',
    officialPortalUrl: 'https://ncert.nic.in/textbook.php?kemh1=0-14',
    chapters: [
      {
        id: '11-math-1',
        chapterNumber: 1,
        title: 'Sets & Relations',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/kemh101.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?kemh1=1-14',
        summary: 'Subsets, power sets, Venn diagrams, union, intersection, De Morgan’s laws.',
        keyFormulas: [
          'n(A \\cup B) = n(A) + n(B) - n(A \\cap B)',
          'n(P(A)) = 2^n'
        ],
        highYieldPoints: [
          'Number of subsets of a set with $n$ elements is $2^n$.',
          'De Morgan’s law: $(A \\cup B)\' = A\' \\cap B\'$.'
        ]
      },
      {
        id: '11-math-3',
        chapterNumber: 3,
        title: 'Trigonometric Functions',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/kemh103.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?kemh1=3-14',
        summary: 'Radian measure, trigonometric identities, compound angles, double and triple angle formulas.',
        keyFormulas: [
          '\\sin(A + B) = \\sin A \\cos B + \\cos A \\sin B',
          '\\cos(2A) = 2\\cos^2 A - 1 = 1 - 2\\sin^2 A',
          '\\tan(2A) = \\frac{2\\tan A}{1 - \\tan^2 A}'
        ],
        highYieldPoints: [
          '$\\sin x = 0 \\implies x = n\\pi$.',
          '$\\cos x = 0 \\implies x = (2n + 1)\\frac{\\pi}{2}$.'
        ]
      }
    ]
  },

  // Biology Class 11
  {
    id: 'ncert-11-bio',
    classLevel: 'Class 11',
    subject: 'Biology',
    title: 'Biology (Class 11)',
    code: 'kebo1',
    coverColor: '#059669',
    officialPortalUrl: 'https://ncert.nic.in/textbook.php?kebo1=0-19',
    chapters: [
      {
        id: '11-bio-8',
        chapterNumber: 8,
        title: 'Cell: The Unit of Life',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/kebo108.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?kebo1=8-19',
        summary: 'Cell theory, prokaryotic vs eukaryotic cells, fluid mosaic model, cell organelles, mitochondria, ribosomes.',
        highYieldPoints: [
          'Fluid mosaic model of cell membrane was proposed by Singer and Nicolson in 1972.',
          'Mitochondria and chloroplasts are semi-autonomous organelles possessing their own circular DNA and 70S ribosomes.'
        ]
      },
      {
        id: '11-bio-10',
        chapterNumber: 10,
        title: 'Cell Cycle and Cell Division',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/kebo110.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?kebo1=10-19',
        summary: 'Phases of cell cycle (G1, S, G2, M), stages of mitosis, meiosis I and II, synapsis, crossing over.',
        highYieldPoints: [
          'DNA replication occurs exclusively during the S (Synthesis) phase.',
          'Crossing over occurs between non-sister chromatids of homologous chromosomes during Pachytene stage of Prophase I.'
        ]
      }
    ]
  }
];
