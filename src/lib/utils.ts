import { twMerge } from "tailwind-merge";

// Schlanke cn-Utility ohne zusätzliche Abhängigkeiten:
// falsy Werte werden gefiltert, Klassen per tailwind-merge zusammengeführt.
export function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(inputs.filter(Boolean).join(" "));
}


