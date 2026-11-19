import React from 'react';

interface MathFormulaProps {
  text: string;
  className?: string;
}

/**
 * Beautiful Math & Science Formula Formatter
 * Translates LaTeX expressions and mathematical notation into clean, accessible HTML typography
 * Eliminates raw $, \frac, \theta, and LaTeX artifacts for students.
 */
export const MathFormula: React.FC<MathFormulaProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Split text by $...$ math blocks
  const parts = text.split(/(\$[^$]+\$)/g);

  return (
    <span className={`inline font-sans ${className}`}>
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const rawMath = part.slice(1, -1);
          return <FormattedMathSegment key={index} expr={rawMath} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

const FormattedMathSegment: React.FC<{ expr: string }> = ({ expr }) => {
  // Clean \text{...} wrappers
  let cleaned = expr.replace(/\\text\{([^}]+)\}/g, '$1');

  // Handle \frac{numerator}{denominator}
  const fracRegex = /\\frac\{([^{}]+)\}\{([^{}]+)\}/g;
  if (fracRegex.test(cleaned)) {
    const segments: React.ReactNode[] = [];
    let lastIdx = 0;
    const re = /\\frac\{([^{}]+)\}\{([^{}]+)\}/g;
    let match;

    while ((match = re.exec(cleaned)) !== null) {
      if (match.index > lastIdx) {
        segments.push(
          <span key={`txt-${lastIdx}`}>
            {formatSymbols(cleaned.substring(lastIdx, match.index))}
          </span>
        );
      }

      const num = formatSymbols(match[1]);
      const den = formatSymbols(match[2]);

      segments.push(
        <span
          key={`frac-${match.index}`}
          className="inline-flex flex-col items-center align-middle mx-1 text-[0.88em] leading-tight font-serif"
        >
          <span className="border-b border-current px-1 pb-0.5 text-center">{num}</span>
          <span className="px-1 pt-0.5 text-center">{den}</span>
        </span>
      );

      lastIdx = match.index + match[0].length;
    }

    if (lastIdx < cleaned.length) {
      segments.push(
        <span key={`txt-end`}>{formatSymbols(cleaned.substring(lastIdx))}</span>
      );
    }

    return (
      <span className="inline-block align-middle font-serif text-[0.98em] text-teal-400 dark:text-teal-300 font-semibold px-0.5">
        {segments}
      </span>
    );
  }

  // Handle standard formula expressions (Greek letters, superscripts, subscripts, operators)
  return (
    <span className="inline font-serif font-semibold text-teal-400 dark:text-teal-300 px-0.5">
      {renderSupSub(formatSymbols(cleaned))}
    </span>
  );
};

function formatSymbols(str: string): string {
  return str
    .replace(/\\theta/g, 'θ')
    .replace(/\\pi/g, 'π')
    .replace(/\\varepsilon_0/g, 'ε₀')
    .replace(/\\varepsilon/g, 'ε')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\rho/g, 'ρ')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\delta/g, 'δ')
    .replace(/\\omega/g, 'ω')
    .replace(/\\infty/g, '∞')
    .replace(/\\oint/g, '∮')
    .replace(/\\int/g, '∫')
    .replace(/\\vec\{([^}]+)\}/g, '$1⃗')
    .replace(/\\cdot/g, ' · ')
    .replace(/\\times/g, ' × ')
    .replace(/\\pm/g, ' ± ')
    .replace(/\\approx/g, ' ≈ ')
    .replace(/\\propto/g, ' ∝ ')
    .replace(/\\neq/g, ' ≠ ')
    .replace(/\\le(q)?/g, ' ≤ ')
    .replace(/\\ge(q)?/g, ' ≥ ')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\,/g, ' ')
    .replace(/\\;/g, ' ')
    .replace(/\\!/g, '')
    .trim();
}

function renderSupSub(str: string): React.ReactNode {
  // Parse ^power and _subscript
  const tokenRegex = /(\^[0-9a-zA-Z+-]+|\^{[^{}]+}|_[0-9a-zA-Z+-]+|_{[^{}]+})/g;
  const parts = str.split(tokenRegex);

  return parts.map((part, i) => {
    if (part.startsWith('^')) {
      const content = part.startsWith('^{') ? part.slice(2, -1) : part.slice(1);
      return <sup key={i} className="text-[0.75em] leading-none ml-0.5">{content}</sup>;
    }
    if (part.startsWith('_')) {
      const content = part.startsWith('_{') ? part.slice(2, -1) : part.slice(1);
      return <sub key={i} className="text-[0.75em] leading-none ml-0.5">{content}</sub>;
    }
    return <span key={i}>{part}</span>;
  });
}
