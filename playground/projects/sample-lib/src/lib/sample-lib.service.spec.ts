import { TestBed } from '@angular/core/testing';
import { SampleLibService } from './sample-lib.service';

describe('SampleLibService', () => {
  let service: SampleLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SampleLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('truncate', () => {
    it('should return the original string if shorter than maxLength', () => {
      expect(service.truncate('hello', 10)).toBe('hello');
    });

    it('should return the original string if equal to maxLength', () => {
      expect(service.truncate('hello', 5)).toBe('hello');
    });

    it('should truncate and add ellipsis when longer than maxLength', () => {
      expect(service.truncate('hello world', 5)).toBe('hello...');
    });

    it('should handle empty strings', () => {
      expect(service.truncate('', 5)).toBe('');
    });

    it('should handle maxLength of 0', () => {
      expect(service.truncate('hello', 0)).toBe('...');
    });

    it('should throw for negative maxLength', () => {
      expect(() => service.truncate('hello', -1)).toThrow('maxLength must be non-negative');
    });
  });

  describe('toDisplayLabel', () => {
    it('should convert camelCase to title case', () => {
      expect(service.toDisplayLabel('firstName')).toBe('First Name');
    });

    it('should convert snake_case to title case', () => {
      expect(service.toDisplayLabel('first_name')).toBe('First Name');
    });

    it('should convert kebab-case to title case', () => {
      expect(service.toDisplayLabel('first-name')).toBe('First Name');
    });

    it('should handle single word', () => {
      expect(service.toDisplayLabel('name')).toBe('Name');
    });

    it('should return empty string for empty input', () => {
      expect(service.toDisplayLabel('')).toBe('');
    });
  });
});
