export type User = {
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  passwordHash: string,
  profilePicture?: string,
  bio?: string,
  country?: string,
  city?: string,
  socials?: string,
  role: string,
  registerDate: Date
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
}
