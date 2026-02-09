import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SampleLibService {
  /**
   * Truncates a string to the given max length, appending an ellipsis if truncated.
   */
  truncate(value: string, maxLength: number): string {
    if (maxLength < 0) {
      throw new Error('maxLength must be non-negative');
    }
    if (value.length <= maxLength) {
      return value;
    }
    return value.slice(0, maxLength) + '...';
  }

  /**
   * Converts a value to a display-friendly label (e.g. camelCase -> "Camel Case").
   */
  toDisplayLabel(value: string): string {
    if (!value) {
      return '';
    }
    return value
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
