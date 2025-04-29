export type Role = {
  name: string,
  permissions: string[]
}

export type Recommendation = {
  _createdBy: string,
  place: string,
  title: string,
  content: string,
  dateOfVisit: string,
  dateOfWriting: string,
  rating: number,
  upvotes: number
}

export type Continent = {
  objectId: string
  name: string
}
export type ApiResponse = {
  results: Continent[]
}

export type Country = {
  objectId: string
  name: string
  emoji: string
  code: string
  capital?: string
  continent: {
    objectId: string
    name: string
  }
  cities: City[]
}

export type City = {
  objectId: string
  cityId: number
  name: string
  population: number
  country: {
    objectId: string
    name: string
  },
  adminCode: string
  places: Place[]
}

export type Place = {
  _id?: string
  name: string;
  description: string;
  images: string[];
  location: {
    continent: Continent[];
    country: string;
    city: string;
    street: string;
    streetNumber: string;
  };
  upvotes: number;
  tags: string[];
  approved: boolean;
  _createdBy: string;
}
