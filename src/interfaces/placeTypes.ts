export type Place = {
   name: string,
   description: string,
   images: (File | string)[],
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

export type AddPlace = Omit<Place, '_createdBy'>

export type EditPlace = Omit<Place, '_createdBy'> & { newImages?: File[] }

