import React, { useEffect, useState } from 'react'
import Rooms from '../../components/rooms/rooms'
import User from '../../components/user/user'
import ChatRoom from '../../pages/chatRoom/chatRoom';


function HomePage() {

   const [page, setPage] = useState('chat')
   const [room, setRoom] = useState<number>(1675084990287)


   // useEffect(()=>{
   //    if (sessionStorage.getItem('user') === null){
   //       setPage('user')
   //    } else{
   //       setPage('rooms')
   //    }
   // },[])

   return (
      <>
         {page === 'user' && <User setPage={setPage} />}
         {page === 'rooms' && <Rooms setPage={setPage} setRoom={setRoom} />}
         {page === 'chat' && <ChatRoom setPage={setPage} room={room} setRoom={setRoom} />}
      </>
   )
}

export default HomePage
