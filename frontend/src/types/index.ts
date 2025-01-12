export interface Song {
   _id: string,
   title:string,
   artist:string,
   albumId:string | null,
   imageUrl:string,
   audioUrl:string,
   duration:number,
   createAt:string,
   updateAt:string
}

export interface Album {
   _id: string,
   title:string,
   artist:string,
   imageUrl:string,
   releaseYear:number,
   songs:Song[],
}
