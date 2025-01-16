import { axiosInstance } from '@/lib/axios'
import React, { ChangeEvent, useRef, useState } from 'react'
import toast from 'react-hot-toast'

const AddAlbumDialog = () => {
   const [albumDialogOpen,setAlbumDialogOpen] = useState(false)
   const [isLoading,setIsLoading] = useState(false)
   const fileInputRef = useRef<HTMLInputElement>(null)

   const [newAlbum,setNewAlbum] = useState<>({
      title: "",
      artist:"",
      releaseYear: new Date().getFullYear()
   })

   const [imageFile,setImageFile] = useState<File | null>(null)

   const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => { //handle image selection
      const file = e.target.files?.[0] //get file
      if(file) {
         setImageFile(file)
      }
   }

   const handleSubmit = async () => {
		setIsLoading(true);

		try {
			if (!imageFile) {
				return toast.error("Please upload an image");
			}

			const formData = new FormData();
			formData.append("title", newAlbum.title);
			formData.append("artist", newAlbum.artist);
			formData.append("releaseYear", newAlbum.releaseYear.toString());
			formData.append("imageFile", imageFile);

			await axiosInstance.post("/admin/albums", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			setNewAlbum({ //reset newAlbum
				title: "",
				artist: "",
				releaseYear: new Date().getFullYear(),
			});
			setImageFile(null); //reset image file
			setAlbumDialogOpen(false); //close dialog

			toast.success("Album created successfully");

		} catch (error: any) {
			toast.error("Failed to create album: " + error.message);
         
		} finally {
			setIsLoading(false);
		}
	};


  return (
    
  )
}

export default AddAlbumDialog
