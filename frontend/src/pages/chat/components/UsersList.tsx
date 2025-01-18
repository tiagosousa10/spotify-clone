import UsersListSkeleton from '@/components/skeletons/UsersListSkeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChatStore } from '@/stores/useChatStore'

const UsersList = () => {
   const {users, selectedUser,isLoading, setSelectedUser, onlineUsers} = useChatStore()

  return (
    <div className='border-r border-zinc-800'>
      <div className='flex flex-col h-full'>
         <ScrollArea className='h-[calc(100vh-280px]'>
            <div className='space-y-2 p-4'>
               {isLoading ? (
                  <UsersListSkeleton/>
               ) : (
                  users.map((user) => (
                     <div 
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`flex items-center justify-center lg:justify-start gap-3 p-3 
                           rounded-lg cursor-pointer transition-colors
                           ${selectedUser?.clerkId === user.clerkId ? "bg-zinc-800" : "hover:bg-zinc-800/50"}`}
                     >
                        {user.fullName}
                     </div>   
                  ))
               )}
            </div>
         </ScrollArea>
      </div>

    </div>
  )
}

export default UsersList
