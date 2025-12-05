export class Place {
  name: string;
  description: string;
  longitude: number;
  latitude: number;
  image: string;

  constructor({
    name,
    description,
    longitude,
    latitude,
    image,
  }: {
    name: string;
    description: string;
    longitude: number;
    latitude: number;
    image: string;
  }) {
    this.name = name;
    this.description = description;
    this.longitude = longitude;
    this.latitude = latitude;
    this.image = image;
  }
}
