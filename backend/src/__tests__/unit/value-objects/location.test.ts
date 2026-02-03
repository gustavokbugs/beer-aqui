import { Location } from '@/domain/value-objects/location';
import { InvalidCoordinatesError } from '@/domain/errors/domain-errors';

describe('Location Value Object', () => {
  describe('create', () => {
    it('should create a valid location', () => {
      const location = Location.create(-23.5505, -46.6333); // São Paulo
      expect(location.getLatitude()).toBe(-23.5505);
      expect(location.getLongitude()).toBe(-46.6333);
    });

    it('should throw error for invalid latitude', () => {
      expect(() => Location.create(-91, -46.6333)).toThrow(InvalidCoordinatesError);
      expect(() => Location.create(91, -46.6333)).toThrow(InvalidCoordinatesError);
    });

    it('should throw error for invalid longitude', () => {
      expect(() => Location.create(-23.5505, -181)).toThrow(InvalidCoordinatesError);
      expect(() => Location.create(-23.5505, 181)).toThrow(InvalidCoordinatesError);
    });

    it('should accept valid latitude extremes', () => {
      const location1 = Location.create(-90, 0);
      const location2 = Location.create(90, 0);
      expect(location1.getLatitude()).toBe(-90);
      expect(location2.getLatitude()).toBe(90);
    });

    it('should accept valid longitude extremes', () => {
      const location1 = Location.create(0, -180);
      const location2 = Location.create(0, 180);
      expect(location1.getLongitude()).toBe(-180);
      expect(location2.getLongitude()).toBe(180);
    });
  });

  describe('distanceTo', () => {
    it('should calculate distance between two locations in meters', () => {
      // São Paulo: -23.5505, -46.6333
      // Rio de Janeiro: -22.9068, -43.1729
      const saoPaulo = Location.create(-23.5505, -46.6333);
      const rio = Location.create(-22.9068, -43.1729);

      const distance = saoPaulo.distanceTo(rio);

      // Distância aproximada entre SP e RJ é ~360km
      expect(distance).toBeGreaterThan(350000); // 350km
      expect(distance).toBeLessThan(400000); // 400km
    });

    it('should return 0 for same location', () => {
      const location1 = Location.create(-23.5505, -46.6333);
      const location2 = Location.create(-23.5505, -46.6333);

      expect(location1.distanceTo(location2)).toBe(0);
    });
  });

  describe('distanceToKm', () => {
    it('should calculate distance in kilometers', () => {
      const saoPaulo = Location.create(-23.5505, -46.6333);
      const rio = Location.create(-22.9068, -43.1729);

      const distanceKm = saoPaulo.distanceToKm(rio);

      expect(distanceKm).toBeGreaterThan(350); // 350km
      expect(distanceKm).toBeLessThan(400); // 400km
    });
  });

  describe('equals', () => {
    it('should return true for equal locations', () => {
      const location1 = Location.create(-23.5505, -46.6333);
      const location2 = Location.create(-23.5505, -46.6333);
      expect(location1.equals(location2)).toBe(true);
    });

    it('should return false for different locations', () => {
      const location1 = Location.create(-23.5505, -46.6333);
      const location2 = Location.create(-22.9068, -43.1729);
      expect(location1.equals(location2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return location as string', () => {
      const location = Location.create(-23.5505, -46.6333);
      expect(location.toString()).toBe('-23.5505, -46.6333');
    });
  });
});
