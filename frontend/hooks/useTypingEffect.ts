import { useState, useEffect } from "react";

export function useTypingEffect(
  codeBlocks: string[],
  speed: number = 50,
  pauseBetweenBlocks: number = 2000
) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const currentBlock = codeBlocks[currentBlockIndex];

    if (currentCharIndex < currentBlock.length) {
      const charTimer = setTimeout(() => {
        setDisplayedText((prev) => prev + currentBlock[currentCharIndex]);
        setCurrentCharIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(charTimer);
    } else {
      const blockTimer = setTimeout(() => {
        setCurrentBlockIndex((prev) => (prev + 1) % codeBlocks.length);
        setCurrentCharIndex(0);
        setDisplayedText("");
      }, pauseBetweenBlocks);

      return () => clearTimeout(blockTimer);
    }
  }, [
    codeBlocks,
    currentBlockIndex,
    currentCharIndex,
    speed,
    pauseBetweenBlocks,
  ]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500); // Blink every 500ms

    return () => clearInterval(cursorTimer);
  }, []);

  return displayedText + (showCursor ? "▋" : " ");
}
