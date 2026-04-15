import { WritableSignal } from '@angular/core';

export function flashSuccess(
  target: WritableSignal<boolean>,
  durationMs = 2000
): void {
  target.set(true);
  setTimeout(() => target.set(false), durationMs);
}

export function flashError(
  target: WritableSignal<string | null>,
  message: string,
  durationMs = 2000
): void {
  target.set(message);
  setTimeout(() => target.set(null), durationMs);
}
