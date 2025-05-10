import type { User } from '@/interfaces/userTypes'
import type { Place } from '@/interfaces/placeTypes'

export type Recommendation = {
   _id: string,
   _createdBy: string | User,
   place: string | Place,
   title: string,
   content: string,
   dateOfVisit: string,
   dateOfWriting: string,
   rating: number,
   upvotes: number
}

export type AddRecommendation = Omit<Recommendation, '_id' | '_createdBy' | 'place' | 'dateOfWriting'>