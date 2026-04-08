import { useState, useEffect } from 'react';
import { getRandomQuote } from '../../utils/quotes';
import Card from '../common/Card';

/**
 * CodingQuote component
 * Displays a random inspirational coding quote using DaisyUI semantics
 */
function CodingQuote() {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  if (!quote) return null;

  return (
    <Card hover="true" className="text-center ">
      <div className="flex flex-col items-center gap-4">
        {/* The Quote Text */}
        <p className="text-xl md:text-2xl italic leading-relaxed text-base-content font-serif">
          "{quote.text}"
        </p>
        
        {/* The Author - Using DaisyUI 'accent' color */}
        <div className="divider divider-horizontal mx-auto w-24 h-1 bg-accent/30 rounded-full opacity-50"></div>
        
        <footer className="text-accent font-bold tracking-wide uppercase text-sm">
          — {quote.author}
        </footer>
      </div>
    </Card>
  );
}

export default CodingQuote;