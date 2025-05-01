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

export type AddRecommendation = Omit<Recommendation, '_createdBy' | 'place' | 'dateOfWriting'>