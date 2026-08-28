"use client";

import { useEffect, useState } from "react";

const CHAR_DELAY = 30;
const INITIAL_DELAY = 200;
const CHAR_DURATION = 500;
const NBSP = " ";

export default function AnimatedHeading({
  text,
  className = "",
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [started, setStarted] = useState(false);
  const lines = text.split("\n");
  const lineLength = Math.max(...lines.map((l) => l.length));

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), INITIAL_DELAY);
    return () => clearTimeout(t);
  }, []);

  return (
    <h1 className={className} style={style}>
      {lines.map((line, lineIndex) => {
        const words = line.split(" ");
        let charIndex = -1;

        return (
          <span key={lineIndex} style={{ display: "block" }}>
            {words.map((word, wordIndex) => (
              <span key={wordIndex} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                {word.split("").map((char, i) => {
                  charIndex += 1;
                  const delay = lineIndex * lineLength * CHAR_DELAY + charIndex * CHAR_DELAY;
                  return (
                    <span
                      key={i}
                      style={{
                        display: "inline-block",
                        opacity: started ? 1 : 0,
                        transform: started ? "translateX(0)" : "translateX(-18px)",
                        transition: `opacity ${CHAR_DURATION}ms ease, transform ${CHAR_DURATION}ms ease`,
                        transitionDelay: `${delay}ms`,
                      }}
                    >
                      {char}
                    </span>
                  );
                })}
                {wordIndex < words.length - 1 ? NBSP : ""}
              </span>
            ))}
          </span>
        );
      })}
    </h1>
  );
}
