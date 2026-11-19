'use client';

import { useEffect, useState } from 'react';

interface TypingAnimationProps {
  words: string[];
  period?: number;
}

export default function TypingAnimation({
  words,
  period = 2000,
}: TypingAnimationProps) {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [delta, setDelta] = useState(200);

  useEffect(() => {
    const fullTxt = words[loopNum % words.length];
    if (fullTxt === undefined) return;

    const ticker = setTimeout(() => {
      const updatedText = isDeleting
        ? fullTxt.substring(0, text.length - 1)
        : fullTxt.substring(0, text.length + 1);

      setText(updatedText);

      let newDelta = 100 - Math.random() * 50;
      if (isDeleting) newDelta /= 3;

      if (!isDeleting && updatedText === fullTxt) {
        newDelta = period;
        setIsDeleting(true);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        newDelta = 300;
      }

      setDelta(newDelta);
    }, delta);

    return () => clearTimeout(ticker);
  }, [words, period, text, isDeleting, loopNum, delta]);

  return (
    <span className="inline-flex items-baseline">
      <span className="font-semibold">
        {text.split(' ').map((word, index) => {
          const isArticle = word === 'a' || word === 'an';
          return (
            <span key={index}>
              {index > 0 && ' '}
              <span className={isArticle ? 'text-muted' : 'text-primary'}>{word}</span>
            </span>
          );
        })}
      </span>
      <span className="ml-1 inline-block h-[0.8em] w-[2px] bg-primary"></span>
    </span>
  );
}
