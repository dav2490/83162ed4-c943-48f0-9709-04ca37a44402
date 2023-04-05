export interface AvailableCities {
  [key: string]: City;
}

export interface City {
  lat: number;
  lon: number;
}
