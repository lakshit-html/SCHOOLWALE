import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService, getInitialData } from '../services/storage';

describe('StudyForge Local Storage & Persistence Service', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('loads default initial seed data when storage is empty', () => {
    // Act
    const data = StorageService.loadData();

    // Assert
    expect(data).toBeDefined();
    expect(data.profile.name).toBe('Aarav Sharma');
    expect(data.subjects.length).toBeGreaterThan(0);
    expect(data.chapters.length).toBeGreaterThan(0);
  });

  it('persists and reloads modified state seamlessly', () => {
    // Arrange
    const original = getInitialData();
    const data = {
      ...original,
      profile: {
        ...original.profile,
        name: 'Rohan Verma',
        dailyTargetHours: 8.5
      }
    };

    // Act
    StorageService.saveData(data);
    const loaded = StorageService.loadData();

    // Assert
    expect(loaded.profile.name).toBe('Rohan Verma');
    expect(loaded.profile.dailyTargetHours).toBe(8.5);
  });

  it('exports valid JSON and imports it back without corruption', () => {
    // Arrange
    const original = getInitialData();
    const data = {
      ...original,
      profile: {
        ...original.profile,
        name: 'Diya Patel'
      }
    };

    // Act
    const jsonStr = StorageService.exportDataJson(data);
    const parsed = StorageService.importDataJson(jsonStr);

    // Assert
    expect(parsed.profile.name).toBe('Diya Patel');
    expect(parsed.tasks.length).toBe(original.tasks.length);
  });

  it('throws error when importing invalid JSON schema', () => {
    // Arrange
    const invalidJson = JSON.stringify({ randomField: 123 });

    // Act & Assert
    expect(() => StorageService.importDataJson(invalidJson)).toThrow(
      'Invalid StudyForge backup JSON file format.'
    );
  });

  it('resets to default sample data correctly', () => {
    // Arrange: clear all data
    StorageService.clearAllData();
    const emptyState = StorageService.loadData();
    expect(emptyState.subjects.length).toBe(0);

    // Act: reset to default
    const restored = StorageService.resetToDefault();

    // Assert
    expect(restored.subjects.length).toBeGreaterThan(0);
    expect(restored.profile.name).toBe('Aarav Sharma');
  });
});
