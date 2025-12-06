export class Place {
  name: string;
  description: string;
  longitude: number;
  latitude: number;

  constructor({
    name,
    description,
    longitude,
    latitude,
  }: {
    name: string;
    description: string;
    longitude: number;
    latitude: number;
  }) {
    this.name = name;
    this.description = description;
    this.longitude = longitude;
    this.latitude = latitude;
  }
}
