import React, { useEffect, useState } from 'react'
import { Room } from '../../types/data'
import Btn from '../../components/btn/btn'
import Input from '../../components/input/input'
import style from '../rooms/rooms.module.scss'

interface Props {
   setPage: React.Dispatch<React.SetStateAction<string>>
   setRoom: React.Dispatch<React.SetStateAction<number>>
}

function Rooms(props: Props) {
   const { setPage, setRoom } = props


   const [rooms, setRooms] = useState<Room[]>([])
   const [roomName, setRoomName] = useState('')
   const [currentRoom, setCurrentRoom] = useState<Room>()

   const addRoom = () => {
      const room: Room = {
         id: Date.now(),
         title: roomName,
         users: [{ user: sessionStorage.getItem('user') || '', status: false }],
         chat: []
      }

      setRooms(prev => [...prev, room])
      setRoomName('')
      localStorage.setItem('rooms', JSON.stringify([...rooms, room]))
   }


   useEffect(() => {
      if (localStorage.getItem('rooms') !== null) {
         setRooms(JSON.parse(localStorage.getItem('rooms') || ''))
      }
   }, [])

   window.addEventListener('storage', () => {
      if (JSON.parse(localStorage.getItem('rooms') || '') === null) {
         setRooms([])
      } else {
         setRooms(JSON.parse(localStorage.getItem('rooms') || ''))
      }
   })

   const openRoom = (id: number) => {

      const localrooms: Room[] = JSON.parse(localStorage.getItem('rooms') || '')

      localrooms.forEach(item => {
         if (item.id === id) {

            if (item.users.find(item => item.user === sessionStorage.getItem('user')) === undefined) {

               item.users = [...item.users, { user: sessionStorage.getItem('user') || '', status: true }]

            } else {
               const user = item.users.find(item => item.user === sessionStorage.getItem('user'))
               if (user !== undefined) {
                  user.status = true
               }

            }

         }
      }
      )

      localStorage.setItem('rooms', JSON.stringify(localrooms))
      setPage('chat')
      setRoom(id)


   }

   return (
      <div className={style.rooms}>
         <img className={style.rooms__logo} src='../images/logo.png' alt='logo' />
         <div className={style.rooms__container}>
            <div className={style.rooms__itemContainer}>
               {
                  rooms.map(item =>
                     <div key={item.id} onClick={() => setCurrentRoom(item)} className={style.rooms__item}>
                        <p className={style.rooms__item_title}>{item.title}</p>
                        <p className={style.rooms__item_text}><span className={style.rooms__item_online}>{item.users.filter(el => el.status === true).length}</span> / {item.users.length}</p>
                     </div>
                  )
               }
            </div>
            <div className={style.rooms__nameContainer}>
               <Input value={roomName} onChange={setRoomName} />
               <Btn text='добавить комнату' onClick={addRoom} disable={false} />
            </div>
         </div>
         {
            currentRoom ? <div className={style.rooms__roomContainer}>
               <p className={style.rooms__item_title}>{currentRoom.title}</p>
               <div className={style.rooms__usersContainer}>
                  <div className={style.rooms__usersContainer_online}>
                     {
                        currentRoom.users.filter(el => el.status === true).map(item =>
                           <p className={style.rooms__userName}>{item.user}</p>
                        )
                     }
                  </div>
                  <div className={style.rooms__usersContainer_offline}>
                     {
                        currentRoom.users.filter(el => el.status === false).map(item =>
                           <p className={style.rooms__userName}>{item.user}</p>
                        )
                     }
                  </div>
               </div>
               <div className={style.rooms__btnRoomContainer}>
                  <div className={style.rooms__btnRoom}>
                     <Btn text='Войти' onClick={() => openRoom(currentRoom.id)} disable={false} />
                  </div>
               </div>
            </div> : null
         }
      </div>
   )
}

export default Rooms
