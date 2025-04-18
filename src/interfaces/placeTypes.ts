export type Place = {
   name: string,
   description: string,
   images: string[],
   location: {
      continent: string,
      country: string,
      city: string,
      street: string,
      streetNumber: string
   },
   upvotes: number,
   tags: string[],
   approved: boolean,
   _createdBy: string
}

export type EditPlaceRequest = Omit<Place, 'upvotes' | '_createdBy'>