import React, { useEffect, useState } from "react";

const WelcomeOverlay = ({ onComplete }) => {
  const firstLine = "Welcome to StayLux";
  const secondLine = "Enjoy Your Journey";

  const [displayedFirst, setDisplayedFirst] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [showSecond, setShowSecond] = useState(false);
  const [secondVisible, setSecondVisible] = useState(false);

  // Typewriter for first line
  useEffect(() => {
    if (charIndex < firstLine.length) {
      const timeout = setTimeout(() => {
        setDisplayedFirst((prev) => prev + firstLine[charIndex]);
        setCharIndex(charIndex + 1);
      }, 80);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => setShowSecond(true), 300);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, firstLine]);

  // Animate second line (slide up + fade)
  useEffect(() => {
    if (showSecond) {
      const timeout = setTimeout(() => setSecondVisible(true), 50);
      return () => clearTimeout(timeout);
    }
  }, [showSecond]);

  // Finish after second line is fully visible
  useEffect(() => {
    if (secondVisible) {
      const timeout = setTimeout(() => onComplete(), 2000);
      return () => clearTimeout(timeout);
    }
  }, [secondVisible, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
      <div className="text-center px-6 max-w-3xl mx-auto">
        {/* First line – typewriter with premium serif font */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-wide font-serif">
          {displayedFirst}
          <span className="inline-block w-0.5 h-10 md:h-14 bg-gray-900 ml-1 animate-pulse align-middle"></span>
        </h1>

        {/* Second line – slide-up + fade */}
        <div
          className={`overflow-hidden transition-all duration-700 ease-out ${
            showSecond ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <p
            className={`text-xl md:text-2xl lg:text-3xl text-gray-500 mt-5 font-light tracking-wide transition-all duration-700 ${
              secondVisible ? "translate-y-0" : "translate-y-8"
            }`}
          >
            {secondLine}
          </p>
        </div>

        {/* Optional subtle loader while typing */}
        {!secondVisible && (
          <p className="text-gray-400 text-sm mt-8 animate-pulse">Please wait...</p>
        )}
      </div>
    </div>
  );
};

export default WelcomeOverlay;