import type { User } from '@/interfaces/userTypes'

export type Place = {
   _id: string,
   name: string,
   description: string,
   images: (File | string)[],
   location: {
      continent: string,
      country: string,
      city?: string,
      street?: string,
      streetNumber?: string
   },
   upvotes: number,
   tags: string[],
   approved: boolean,
   _createdBy: string | User
}

export type AddPlace = Omit<Place, '_id' | '_createdBy'> & { _createdBy?: string }

export type EditPlace = Omit<Place, '_id' | '_createdBy'> & { newImages?: File[], _createdBy?: string }

