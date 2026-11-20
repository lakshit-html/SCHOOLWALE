import '../models/ncert_book.dart';

class NCERTCatalog {
  static final List<NCERTBook> books = [
    // Class 12 Physics Part 1
    NCERTBook(
      id: '12-phy-1',
      classLevel: 'Class 12',
      subject: 'Physics',
      title: 'Physics — Part I',
      code: 'leph1',
      coverColorHex: 0xFF0284C7,
      officialPortalUrl: 'https://ncert.nic.in/textbook.php?leph1=0-8',
      chapters: [
        NCERTChapter(
          id: '12-phy-ch-1',
          chapterNumber: 1,
          title: 'Electric Charges and Fields',
          pdfUrl: 'https://ncert.nic.in/textbook/pdf/leph101.pdf',
          portalUrl: 'https://ncert.nic.in/textbook.php?leph1=1-8',
          summary: 'Coulomb’s law, electric field lines, electric dipole, Gauss’s law and applications to line, sheet, and spherical charges.',
          detailedTheory: 'Charges are quantized (q = ne) and conserved. Coulomb\'s law gives mutual force F = (1/4πε₀)(q₁q₂/r²). Gauss\'s Law states that total flux equals enclosed charge divided by ε₀.',
          keyFormulas: [
            'F = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q_1 q_2}{r^2}',
            '\\oint \\vec{E} \\cdot d\\vec{A} = \\frac{q_{enc}}{\\varepsilon_0}',
            'E_{line} = \\frac{\\lambda}{2\\pi\\varepsilon_0 r}',
            '\\vec{\\tau} = \\vec{p} \\times \\vec{E}'
          ],
          highYieldPoints: [
            'Electric field inside a uniformly charged conducting spherical shell is zero.',
            'Electric field lines never intersect.',
            'Gauss law is valid only for closed surfaces.'
          ],
        ),
        NCERTChapter(
          id: '12-phy-ch-2',
          chapterNumber: 2,
          title: 'Electrostatic Potential and Capacitance',
          pdfUrl: 'https://ncert.nic.in/textbook/pdf/leph102.pdf',
          portalUrl: 'https://ncert.nic.in/textbook.php?leph1=2-8',
          summary: 'Potential difference, equipotential surfaces, potential energy of charges, parallel plate capacitors, dielectrics.',
          keyFormulas: [
            'V = \\frac{1}{4\\pi\\varepsilon_0}\\frac{q}{r}',
            'C = \\frac{\\varepsilon_0 A}{d}',
            'U = \\frac{1}{2} C V^2'
          ],
          highYieldPoints: [
            'Work done in moving charge along equipotential surface is zero.',
            'Dielectric slab of constant K multiplies capacitance by K.'
          ],
        ),
        NCERTChapter(
          id: '12-phy-ch-3',
          chapterNumber: 3,
          title: 'Current Electricity',
          pdfUrl: 'https://ncert.nic.in/textbook/pdf/leph103.pdf',
          portalUrl: 'https://ncert.nic.in/textbook.php?leph1=3-8',
          summary: 'Drift velocity, Ohm’s law, resistivity, Kirchhoff’s junction & loop laws, Wheatstone bridge, internal resistance.',
          keyFormulas: [
            'I = n A e v_d',
            'V = I R',
            '\\frac{P}{Q} = \\frac{R}{S}'
          ],
          highYieldPoints: [
            'Kirchhoff\'s 1st rule is charge conservation; 2nd rule is energy conservation.',
            'Wheatstone bridge is most sensitive when all arm resistances are nearly equal.'
          ],
        ),
      ],
    ),

    // Class 12 Chemistry Part 1
    NCERTBook(
      id: '12-chem-1',
      classLevel: 'Class 12',
      subject: 'Chemistry',
      title: 'Chemistry — Part I',
      code: 'lech1',
      coverColorHex: 0xFF7C3AED,
      officialPortalUrl: 'https://ncert.nic.in/textbook.php?lech1=0-5',
      chapters: [
        NCERTChapter(
          id: '12-chem-ch-1',
          chapterNumber: 1,
          title: 'Solutions',
          pdfUrl: 'https://ncert.nic.in/textbook/pdf/lech101.pdf',
          portalUrl: 'https://ncert.nic.in/textbook.php?lech1=1-5',
          summary: 'Raoult’s law, ideal and non-ideal solutions, colligative properties (VP lowering, elevation in boiling point, depression in freezing point, osmotic pressure), van’t Hoff factor.',
          keyFormulas: [
            '\\Delta T_b = i \\cdot K_b \\cdot m',
            '\\Delta T_f = i \\cdot K_f \\cdot m',
            '\\Pi = i \\cdot C R T'
          ],
          highYieldPoints: [
            'Osmotic pressure is the best method for measuring molecular masses of macromolecules.',
            'Azeotropes boil at constant temperature without change in vapor composition.'
          ],
        ),
        NCERTChapter(
          id: '12-chem-ch-2',
          chapterNumber: 2,
          title: 'Electrochemistry',
          pdfUrl: 'https://ncert.nic.in/textbook/pdf/lech102.pdf',
          portalUrl: 'https://ncert.nic.in/textbook.php?lech1=2-5',
          summary: 'Nernst equation, standard electrode potential, Kohlrausch’s law, Faraday’s laws of electrolysis, batteries.',
          keyFormulas: [
            'E_{cell} = E^\\circ_{cell} - \\frac{0.0591}{n}\\log Q',
            '\\Delta G^\\circ = -n F E^\\circ_{cell}'
          ],
          highYieldPoints: [
            'Kohlrausch law applies to calculate molar conductivity of weak electrolytes at infinite dilution.',
            'Lead storage battery uses PbO₂ cathode and Pb anode.'
          ],
        ),
      ],
    ),

    // Class 12 Mathematics Part 1
    NCERTBook(
      id: '12-math-1',
      classLevel: 'Class 12',
      subject: 'Mathematics',
      title: 'Mathematics — Part I',
      code: 'lemh1',
      coverColorHex: 0xFF059669,
      officialPortalUrl: 'https://ncert.nic.in/textbook.php?lemh1=0-6',
      chapters: [
        NCERTChapter(
          id: '12-math-ch-3',
          chapterNumber: 3,
          title: 'Matrices',
          pdfUrl: 'https://ncert.nic.in/textbook/pdf/lemh103.pdf',
          portalUrl: 'https://ncert.nic.in/textbook.php?lemh1=3-6',
          summary: 'Multiplication of matrices, transpose, symmetric and skew-symmetric matrices, elementary row operations, invertible matrices.',
          keyFormulas: [
            '(A B)^T = B^T A^T',
            'A = \\frac{1}{2}(A + A^T) + \\frac{1}{2}(A - A^T)'
          ],
          highYieldPoints: [
            'Matrix multiplication is non-commutative in general (AB ≠ BA).',
            'Any square matrix can be expressed uniquely as sum of symmetric and skew-symmetric matrices.'
          ],
        ),
        NCERTChapter(
          id: '12-math-ch-4',
          chapterNumber: 4,
          title: 'Determinants',
          pdfUrl: 'https://ncert.nic.in/textbook/pdf/lemh104.pdf',
          portalUrl: 'https://ncert.nic.in/textbook.php?lemh1=4-6',
          summary: 'Minors, cofactors, adjoint of matrix, inverse using adjoint, Cramer\'s rule, solving system of linear equations.',
          keyFormulas: [
            'A^{-1} = \\frac{1}{|A|}\\text{adj}(A)',
            '|\\text{adj}(A)| = |A|^{n-1}'
          ],
          highYieldPoints: [
            'If two rows or columns of a determinant are identical, the value is zero.',
            'System of linear equations AX = B has unique solution iff |A| ≠ 0.'
          ],
        ),
      ],
    ),

    // Class 11 Physics Part 1
    NCERTBook(
      id: '11-phy-1',
      classLevel: 'Class 11',
      subject: 'Physics',
      title: 'Physics — Part I (Class 11)',
      code: 'keph1',
      coverColorHex: 0xFF0284C7,
      officialPortalUrl: 'https://ncert.nic.in/textbook.php?keph1=0-7',
      chapters: [
        NCERTChapter(
          id: '11-phy-ch-2',
          chapterNumber: 2,
          title: 'Motion in a Straight Line',
          pdfUrl: 'https://ncert.nic.in/textbook/pdf/keph102.pdf',
          portalUrl: 'https://ncert.nic.in/textbook.php?keph1=2-7',
          summary: 'Kinematic equations, instantaneous velocity, position-time and velocity-time graphs.',
          keyFormulas: [
            'v = u + a t',
            's = u t + \\frac{1}{2} a t^2',
            'v^2 - u^2 = 2 a s'
          ],
          highYieldPoints: [
            'Area under velocity-time graph gives displacement.',
            'Slope of displacement-time graph gives instantaneous velocity.'
          ],
        ),
      ],
    ),

    // Class 10 Science
    NCERTBook(
      id: '10-sci-1',
      classLevel: 'Class 10',
      subject: 'Science',
      title: 'Science (Class 10)',
      code: 'jesc1',
      coverColorHex: 0xFF10B981,
      officialPortalUrl: 'https://ncert.nic.in/textbook.php?jesc1=0-13',
      chapters: [
        NCERTChapter(
          id: '10-sci-ch-10',
          chapterNumber: 10,
          title: 'Light — Reflection and Refraction',
          pdfUrl: 'https://ncert.nic.in/textbook/pdf/jesc109.pdf',
          portalUrl: 'https://ncert.nic.in/textbook.php?jesc1=9-13',
          summary: 'Spherical mirrors, mirror formula, magnification, refraction, Snell’s law, lens formula, power of lens.',
          keyFormulas: [
            '\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}',
            'P = \\frac{1}{f(\\text{m})}'
          ],
          highYieldPoints: [
            'Power of a convex lens is positive; power of a concave lens is negative.',
            'Unit of optical power is Dioptre (1 D = 1 m⁻¹).'
          ],
        ),
      ],
    ),

    // Class 9 Science
    NCERTBook(
      id: '9-sci-1',
      classLevel: 'Class 9',
      subject: 'Science',
      title: 'Science (Class 9)',
      code: 'iesc1',
      coverColorHex: 0xFFD97706,
      officialPortalUrl: 'https://ncert.nic.in/textbook.php?iesc1=0-12',
      chapters: [
        NCERTChapter(
          id: '9-sci-ch-8',
          chapterNumber: 8,
          title: 'Force and Laws of Motion',
          pdfUrl: 'https://ncert.nic.in/textbook/pdf/iesc108.pdf',
          portalUrl: 'https://ncert.nic.in/textbook.php?iesc1=8-12',
          summary: 'Inertia, momentum, Newton\'s laws of motion, conservation of momentum.',
          keyFormulas: [
            'F = m a',
            'p = m v'
          ],
          highYieldPoints: [
            'Inertia of an object depends directly on its mass.',
            'Action and reaction forces act on different bodies.'
          ],
        ),
      ],
    ),
  ];
}
