// src/navigation/NavigationHistory.types.ts

export type HistoryEntry = {
  id: string;
  label: string;
  href: string;
  category?: string;
  timestamp: number;
};