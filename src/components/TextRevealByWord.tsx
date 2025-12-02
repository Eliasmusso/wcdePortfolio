import { motion } from "framer-motion";
import { cn } from "../lib/utils";

type TextRevealByWordProps = {
  text: string;
  className?: string;
  delayPerWord?: number;
  highlightWord?: string;
  highlightWords?: string[];
  highlightClassName?: string;
};

// Sehr einfache Basis-Variante, die jedes Wort nacheinander einblendet.
// Du kannst später Timing, Easing und Viewport-Trigger feintunen.
export function TextRevealByWord({
  text,
  className,
  delayPerWord = 0.06,
  highlightWord,
  highlightWords,
  highlightClassName,
}: TextRevealByWordProps) {
  const words = text.split(" ");

  return (
    <span className={cn("inline-block overflow-hidden align-baseline", className)}>
      {words.map((word, index) => {
        const clean = word.replace(/[.,!?]/g, "");
        const shouldHighlight = (target: string | undefined) =>
          target &&
          clean.localeCompare(target, undefined, {
            sensitivity: "base",
          }) === 0;

        const isHighlighted =
          shouldHighlight(highlightWord) ||
          (Array.isArray(highlightWords) &&
            highlightWords.some((w) => shouldHighlight(w)));

        return (
          <motion.span
            key={`${word}-${index}`}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              delay: index * delayPerWord,
              duration: 0.35,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className={cn(
              "inline-block will-change-transform",
              isHighlighted && (highlightClassName || "text-red-500")
            )}
          >
            {word}
            {index < words.length - 1 ? "\u00A0" : null}
          </motion.span>
        );
      })}
    </span>
  );
}


