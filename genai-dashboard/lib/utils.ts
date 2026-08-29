import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind CSS class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ═══════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS FOR OPTIONS
// ═══════════════════════════════════════════════════════════════════
export interface BehavioralOption {
  id: 'A' | 'B' | 'C' | 'D';
  label: string;
  description: string;
  tone?: string;
  consequences_hint?: string;
  hint?: string; // Alternative field name from backend
}

export interface OptionsPayload {
  scene_id: number;
  options: BehavioralOption[];
  scene_summary: string;
  timestamp: string;
}

// ═══════════════════════════════════════════════════════════════════
// VALIDATION HELPERS
// ═══════════════════════════════════════════════════════════════════
export function isValidChoice(choice: string): choice is 'A' | 'B' | 'C' | 'D' | 'Custom' {
  return ['A', 'B', 'C', 'D', 'Custom'].includes(choice);
}

export function sanitizePrompt(prompt: string): string {
  // Remove potentially dangerous characters for shell execution
  return prompt
    .replace(/[`$\\]/g, '')
    .replace(/[<>|&;]/g, '')
    .trim()
    .slice(0, 2000); // Limit length
}

// ═══════════════════════════════════════════════════════════════════
// FORMATTING HELPERS
// ═══════════════════════════════════════════════════════════════════
export function formatTimestamp(date: Date = new Date()): string {
  return date.toISOString().replace(/[:.]/g, '-');
}

export function generateSceneId(): string {
  return `scene_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function parseVideoFilename(filename: string): {
  timestamp: number;
  sceneId: string;
} | null {
  // Expected format: infinilife_<timestamp>_<sceneId>.mp4
  const match = filename.match(/infinilife_(\d+)_(.+)\.mp4$/);
  if (!match) return null;
  return {
    timestamp: parseInt(match[1], 10),
    sceneId: match[2],
  };
}

// ═══════════════════════════════════════════════════════════════════
// ASYNC UTILITIES
// ═══════════════════════════════════════════════════════════════════
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Attempt ${attempt}/${maxAttempts} failed:`, lastError.message);
      
      if (attempt < maxAttempts) {
        await sleep(delayMs * attempt); // Exponential backoff
      }
    }
  }
  
  throw lastError;
}

// ═══════════════════════════════════════════════════════════════════
// CHARACTER STATE UTILITIES
// ═══════════════════════════════════════════════════════════════════
export function getDispositionLabel(disposition: number): string {
  if (disposition <= -75) return 'Villainous';
  if (disposition <= -50) return 'Hostile';
  if (disposition <= -25) return 'Unfriendly';
  if (disposition < 25) return 'Neutral';
  if (disposition < 50) return 'Friendly';
  if (disposition < 75) return 'Benevolent';
  return 'Heroic';
}

export function calculateLoraWeight(disposition: number): number {
  // Map disposition (-100 to 100) to LoRA weight (0.3 to 0.9)
  return 0.3 + ((disposition + 100) / 200) * 0.6;
}
