import type { Role, Social } from '@/interfaces/interfaces'

export type User = {
   _id: string,
   firstName: string,
   lastName: string,
   username: string,
   email: string,
   passwordHash: string,
   profilePicture?: string,
   bio?: string,
   country?: string,
   city?: string,
   socials?: Social[],
   role: string | Role,
   registerDate: Date
}

export type UpdateProfile = {
   firstName: string,
   lastName: string,
   username: string,
   profilePicture?: string,
   newImage?: string | File,
   bio?: string,
   country?: string,
   city?: string,
   socials?: Social[],
   role: string
}
