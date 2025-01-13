import { axiosInstance } from "@/lib/axios"
import { useAuthStore } from "@/stores/useAuthStore"
import { useAuth } from "@clerk/clerk-react"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"

const updateApiToken = (token: string | null) => { //update api token
   if(token) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}` // set api token
   } else {
      delete axiosInstance.defaults.headers.common["Authorization"] // delete api token
   }
}


const AuthProvider = ({children} : {children:React.ReactNode}) => {
  const {getToken} = useAuth() //get current user from clerk
  const [loading,setLoading] = useState(true)
   const {checkAdminStatus} = useAuthStore()

  useEffect(() => {
   const initAuth = async () => {
      try {
         const token = await getToken() //get api token
         updateApiToken(token) //update api token

         //if you have token
         if(token) {
            await checkAdminStatus() //check if user is admin
         }
         
      } catch(error) {
         updateApiToken(null)
         console.log("Error in auth provider", error)
         
      } finally {
         setLoading(false)
      }
   }

   initAuth()
  }, [getToken])

  if(loading) return (
   <div className="h-screen w-full flex items-center justify-center">
      <Loader className="size-8 text-emerald-500 animate-spin"/>
   </div>
  )

   return (
    <div>{children}</div>
  )
}

export default AuthProvider
