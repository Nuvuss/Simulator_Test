import { ExamState } from '@/types';

const STORAGE_KEY = 'bm-exam-state';

export function saveExamState(state: ExamState): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

export function loadExamState(): ExamState | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as ExamState;
  } catch {
    return null;
  }
}

export function clearExamState(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
