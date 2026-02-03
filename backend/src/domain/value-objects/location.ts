import { InvalidCoordinatesError } from '../errors/domain-errors';

export class Location {
  private readonly latitude: number;
  private readonly longitude: number;

  private constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  static create(latitude: number, longitude: number): Location {
    if (!this.isValidLatitude(latitude)) {
      throw new InvalidCoordinatesError(latitude, longitude);
    }
    if (!this.isValidLongitude(longitude)) {
      throw new InvalidCoordinatesError(latitude, longitude);
    }
    return new Location(latitude, longitude);
  }

  static isValidLatitude(latitude: number): boolean {
    return latitude >= -90 && latitude <= 90;
  }

  static isValidLongitude(longitude: number): boolean {
    return longitude >= -180 && longitude <= 180;
  }

  getLatitude(): number {
    return this.latitude;
  }

  getLongitude(): number {
    return this.longitude;
  }

  /**
   * Calcula a distância em metros entre duas localizações usando a fórmula de Haversine
   */
  distanceTo(other: Location): number {
    const R = 6371e3; // Raio da Terra em metros
    const φ1 = (this.latitude * Math.PI) / 180;
    const φ2 = (other.latitude * Math.PI) / 180;
    const Δφ = ((other.latitude - this.latitude) * Math.PI) / 180;
    const Δλ = ((other.longitude - this.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distância em metros
  }

  /**
   * Calcula a distância em quilômetros
   */
  distanceToKm(other: Location): number {
    return this.distanceTo(other) / 1000;
  }

  equals(other: Location): boolean {
    return this.latitude === other.latitude && this.longitude === other.longitude;
  }

  toString(): string {
    return `${this.latitude}, ${this.longitude}`;
  }
}
