"use client";

import { useTypingEffect } from "../hooks/useTypingEffect";
import { useRef, useEffect, useState } from "react";

export function TerminalTyping({
  className,
  codeBlocks,
  speed,
  pauseBetweenBlocks,
}: {
  className?: string;
  codeBlocks: string[];
  speed: number;
  pauseBetweenBlocks?: number;
}) {
  const displayedText = useTypingEffect(codeBlocks, speed, pauseBetweenBlocks);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  const fullTextRef = useRef<HTMLPreElement>(null);
  const typingTextRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (fullTextRef.current) {
      const heights = codeBlocks.map((block) => {
        fullTextRef.current!.textContent = block;
        return fullTextRef.current!.offsetHeight;
      });
      setMaxHeight(Math.max(...heights));
    }
  }, [codeBlocks]);

  return (
    <div className={`col-span-3 flex flex-col justify-center ${className}`}>
      <div className="rounded-lg border border-gray-800 bg-black p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
        </div>
        <div className="relative">
          <pre
            ref={fullTextRef}
            className="invisible absolute top-0 left-0 mt-4 font-mono text-sm text-gray-300"
            aria-hidden="true"
          >
            <code>{codeBlocks[0]}</code>
          </pre>
          <pre
            ref={typingTextRef}
            className="prevent-select mt-4 font-mono text-sm text-gray-300"
            style={{ minHeight: maxHeight ? `${maxHeight}px` : "auto" }}
          >
            <code>{displayedText}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
