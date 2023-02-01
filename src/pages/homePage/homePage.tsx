import React, { useEffect, useState } from 'react'
import Rooms from '../rooms/rooms'
import User from '../user/user'
import ChatRoom from '../../pages/chatRoom/chatRoom';


function HomePage() {

   const [page, setPage] = useState('user')
   const [room, setRoom] = useState<number>(0)


   useEffect(() => {
      if (sessionStorage.getItem('user') === null) {
         setPage('user')
      } else {
         setPage('rooms')
      }
   }, [])

   return (
      <>
         {page === 'user' && <User setPage={setPage} />}
         {page === 'rooms' && <Rooms setPage={setPage} setRoom={setRoom} />}
         {page === 'chat' && <ChatRoom setPage={setPage} room={room} setRoom={setRoom} />}
      </>
   )
}

export default HomePage
