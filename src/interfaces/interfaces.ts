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
