export function isValidCoordinate(lat?: number | null, lng?: number | null): boolean {
  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    return false;
  }
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(6)}°, ${lng.toFixed(6)}°`;
}
