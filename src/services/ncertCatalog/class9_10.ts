import { NCERTBook } from './types';

export const CLASS_9_10_BOOKS: NCERTBook[] = [
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
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/jesc101.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?jesc1=1-13',
        summary: 'Balancing chemical equations, combination, decomposition, displacement, double displacement, redox, rancidity and corrosion.',
        highYieldPoints: [
          'Balancing chemical equations adheres to the Law of Conservation of Mass.',
          'Respiration is an exothermic reaction, whereas photosynthesis is endothermic.'
        ]
      },
      {
        id: '10-sci-10',
        chapterNumber: 10,
        title: 'Light — Reflection and Refraction',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/jesc109.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?jesc1=9-13',
        summary: 'Spherical mirrors, mirror formula, magnification, refraction, Snell’s law, refractive index, lenses, lens formula, power of lens.',
        keyFormulas: [
          '\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u} \\text{ (Mirror)}',
          '\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u} \\text{ (Lens)}',
          'P = \\frac{1}{f(\\text{m})}'
        ],
        highYieldPoints: [
          'Convex lens has positive focal length ($+f$); concave lens has negative focal length ($-f$).',
          'Power of lens is measured in Dioptres ($1\\text{ D} = 1\\text{ m}^{-1}$).'
        ]
      },
      {
        id: '10-sci-12',
        chapterNumber: 12,
        title: 'Electricity',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/jesc111.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?jesc1=11-13',
        summary: 'Electric current, potential difference, Ohm’s law, resistance, series and parallel circuits, Joule’s heating, electric power.',
        keyFormulas: [
          'V = I R',
          'R_s = R_1 + R_2',
          '\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2}',
          'H = I^2 R t',
          'P = V I = I^2 R = \\frac{V^2}{R}'
        ],
        highYieldPoints: [
          'Ammeter is connected in series; voltmeter in parallel.',
          'Parallel wiring ensures equal voltage across home appliances.'
        ]
      }
    ]
  },
  {
    id: 'ncert-10-math',
    classLevel: 'Class 10',
    subject: 'Mathematics',
    title: 'Mathematics (Class 10)',
    code: 'jemh1',
    coverColor: '#047857',
    officialPortalUrl: 'https://ncert.nic.in/textbook.php?jemh1=0-14',
    chapters: [
      {
        id: '10-math-1',
        chapterNumber: 1,
        title: 'Real Numbers',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/jemh101.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?jemh1=1-14',
        summary: 'Fundamental Theorem of Arithmetic, prime factorization, proof of irrationality for $\\sqrt{2}, \\sqrt{3}, \\sqrt{5}$.',
        keyFormulas: ['\\text{HCF}(a,b) \\times \\text{LCM}(a,b) = a \\times b'],
        highYieldPoints: [
          'Product of two positive integers equals the product of their HCF and LCM.'
        ]
      },
      {
        id: '10-math-4',
        chapterNumber: 4,
        title: 'Quadratic Equations',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/jemh104.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?jemh1=4-14',
        summary: 'Standard form $ax^2 + bx + c = 0$, quadratic formula, discriminant $D = b^2 - 4ac$, nature of roots.',
        keyFormulas: [
          'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
          'D = b^2 - 4ac'
        ],
        highYieldPoints: [
          'If $D > 0$, two distinct real roots exist; if $D = 0$, two equal real roots exist; if $D < 0$, no real roots exist.'
        ]
      },
      {
        id: '10-math-8',
        chapterNumber: 8,
        title: 'Introduction to Trigonometry',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/jemh108.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?jemh1=8-14',
        summary: 'Trigonometric ratios of acute angles, standard angles ($0^\\circ, 30^\\circ, 45^\\circ, 60^\\circ, 90^\\circ$), fundamental identities.',
        keyFormulas: [
          '\\sin^2\\theta + \\cos^2\\theta = 1',
          '1 + \\tan^2\\theta = \\sec^2\\theta',
          '1 + \\cot^2\\theta = \\csc^2\\theta'
        ],
        highYieldPoints: [
          '$\\sin\\theta$ and $\\cos\\theta$ values can never exceed 1.'
        ]
      }
    ]
  },
  {
    id: 'ncert-10-soc',
    classLevel: 'Class 10',
    subject: 'Social Science',
    title: 'Social Science — India & Contemporary World II',
    code: 'jess3',
    coverColor: '#b45309',
    officialPortalUrl: 'https://ncert.nic.in/textbook.php?jess3=0-5',
    chapters: [
      {
        id: '10-soc-1',
        chapterNumber: 1,
        title: 'The Rise of Nationalism in Europe',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/jess301.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?jess3=1-5',
        summary: 'French Revolution, Napoleonic Code of 1804, Romanticism, Revolutions of 1848, unification of Germany and Italy, Marianne and Germania.',
        highYieldPoints: [
          'Civil Code of 1804 (Napoleonic Code) established equality before law and secured the right to property.',
          'Giuseppe Mazzini founded the secret societies Young Italy in Marseilles and Young Europe in Berne.'
        ]
      },
      {
        id: '10-soc-2',
        chapterNumber: 2,
        title: 'Nationalism in India',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/jess302.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?jess3=2-5',
        summary: 'Rowlatt Act, Jallianwala Bagh massacre, Non-Cooperation Movement, Khilafat issue, Salt March, Civil Disobedience Movement, Poona Pact.',
        highYieldPoints: [
          'Mahatma Gandhi launched the Salt March from Sabarmati Ashram to Dandi on 12 March 1930.',
          'Poona Pact (September 1932) gave reserved seats to the Depressed Classes in provincial and central legislative councils.'
        ]
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
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/iesc101.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?iesc1=1-12',
        summary: 'States of matter, kinetic theory, latent heat of fusion and vaporization, sublimation, evaporation factors.',
        highYieldPoints: [
          'Evaporation is a surface phenomenon that causes cooling due to absorption of latent heat.',
          'Conversion between Celsius and Kelvin: $K = ^\\circ\\text{C} + 273.15$.'
        ]
      },
      {
        id: '9-sci-8',
        chapterNumber: 8,
        title: 'Force and Laws of Motion',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/iesc108.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?iesc1=8-12',
        summary: 'Balanced and unbalanced forces, first law (inertia), second law ($F=ma$), third law (action-reaction), momentum conservation.',
        keyFormulas: [
          'F = m a',
          'p = m v',
          'm_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2'
        ],
        highYieldPoints: [
          'Mass is the quantitative measure of an object’s inertia.',
          'Rate of change of momentum is directly proportional to applied force.'
        ]
      },
      {
        id: '9-sci-9',
        chapterNumber: 9,
        title: 'Gravitation',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/iesc109.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?iesc1=9-12',
        summary: 'Universal law of gravitation, acceleration due to gravity $g$, mass vs weight, thrust and pressure, Archimedes’ principle.',
        keyFormulas: [
          'F = G \\frac{M m}{R^2}',
          'g = \\frac{G M}{R^2}',
          'W = m g'
        ],
        highYieldPoints: [
          'Universal gravitational constant $G = 6.67 \\times 10^{-11}\\text{ N m}^2/\\text{kg}^2$.',
          'Weight of an object on the Moon is one-sixth ($1/6$) of its weight on Earth.'
        ]
      }
    ]
  },
  {
    id: 'ncert-9-math',
    classLevel: 'Class 9',
    subject: 'Mathematics',
    title: 'Mathematics (Class 9)',
    code: 'iemh1',
    coverColor: '#92400e',
    officialPortalUrl: 'https://ncert.nic.in/textbook.php?iemh1=0-12',
    chapters: [
      {
        id: '9-math-1',
        chapterNumber: 1,
        title: 'Number Systems',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/iemh101.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?iemh1=1-12',
        summary: 'Rational and irrational numbers, decimal expansions, operations on real numbers, laws of exponents.',
        keyFormulas: [
          'a^m \\cdot a^n = a^{m+n}',
          '(a^m)^n = a^{mn}',
          '\\frac{1}{\\sqrt{a} + \\sqrt{b}} = \\frac{\\sqrt{a} - \\sqrt{b}}{a - b}'
        ],
        highYieldPoints: [
          'A rational number has a terminating or repeating decimal representation.',
          'An irrational number has a non-terminating and non-repeating decimal representation.'
        ]
      },
      {
        id: '9-math-2',
        chapterNumber: 2,
        title: 'Polynomials',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/iemh102.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?iemh1=2-12',
        summary: 'Zeros of a polynomial, Remainder Theorem, Factor Theorem, algebraic identities.',
        keyFormulas: [
          '(x + y + z)^2 = x^2 + y^2 + z^2 + 2xy + 2yz + 2zx',
          'x^3 + y^3 + z^3 - 3xyz = (x + y + z)(x^2 + y^2 + z^2 - xy - yz - zx)'
        ],
        highYieldPoints: [
          'If $x + y + z = 0$, then $x^3 + y^3 + z^3 = 3xyz$.'
        ]
      }
    ]
  },
  {
    id: 'ncert-9-soc',
    classLevel: 'Class 9',
    subject: 'Social Science',
    title: 'Social Science — India & Contemporary World I',
    code: 'iess3',
    coverColor: '#78350f',
    officialPortalUrl: 'https://ncert.nic.in/textbook.php?iess3=0-5',
    chapters: [
      {
        id: '9-soc-1',
        chapterNumber: 1,
        title: 'The French Revolution',
        pdfUrl: 'https://ncert.nic.in/textbook/pdf/iess301.pdf',
        portalUrl: 'https://ncert.nic.in/textbook.php?iess3=1-5',
        summary: 'French society during the late 18th century, outbreak of the revolution, storming of the Bastille, abolition of monarchy, Reign of Terror.',
        highYieldPoints: [
          'The storming of the Bastille fortress on 14 July 1789 marked the commencement of the French Revolution.',
          'Declaration of the Rights of Man and of the Citizen proclaimed liberty, equality, and fraternity.'
        ]
      }
    ]
  }
];
