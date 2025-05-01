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
   socials?: Array<object>,
   role: string | Array<object>,
   registerDate: Date
}

export type UpdateProfile = {
   firstName: string,
   lastName: string,
   username: string,
   profilePicture?: string,
   bio?: string,
   country?: string,
   city?: string,
   socials?: Array<object>,
   role: string
}
