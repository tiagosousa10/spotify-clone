import { axiosInstance } from "@/lib/axios"
import { useAuthStore } from "@/stores/useAuthStore"
import { useChatStore } from "@/stores/useChatStore"
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
  const {getToken, userId} = useAuth() //get current user from clerk
  const [loading,setLoading] = useState(true)
  const {checkAdminStatus} = useAuthStore()
  const {initSocket, disconnectSocket} =  useChatStore()


  useEffect(() => {
   const initAuth = async () => {
      try {
         const token = await getToken() //get api token
         updateApiToken(token) //update api token

         //if you have token
         if(token) {
            await checkAdminStatus() //check if user is admin
            //init socket
            if(userId) initSocket(userId)
         }
         
      } catch(error) {
         updateApiToken(null)
         console.log("Error in auth provider", error)
         
      } finally {
         setLoading(false)
      }
   }

   initAuth()

   //cleanup
   return () => {
      disconnectSocket()
   }
  }, [getToken, userId, checkAdminStatus, initSocket, disconnectSocket])

  if(loading) {
   return (
      <div className="h-screen w-full flex items-center justify-center">
         <Loader className="size-8 text-emerald-500 animate-spin"/>
      </div>
   )
 }

   return (
    <div>{children}</div>
  )
}

export default AuthProvider
