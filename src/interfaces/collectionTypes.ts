import type { Place } from '@/interfaces/placeTypes'
import type { User } from '@/interfaces/userTypes'

export type Collection = {
   _id: string,
   _createdBy: string | User,
   name: string,
   places?: string[] | Place[],
   visible: boolean
}

export type AddCollection = Omit<Collection, '_id' | '_createdBy'> & { _createdBy?: string }