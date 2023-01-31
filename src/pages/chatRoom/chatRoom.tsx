import React, { useEffect, useState } from 'react'
import { Message, Room } from '../../types/data'
import Picker from "emoji-picker-react";
import { Theme, EmojiClickData } from "emoji-picker-react";
import style from '../chatRoom/chatRoom.module.scss'
import DropDownInput from '../../components/input/dropDown';
import Btn from '../../components/btn/btn';
import Input from '../../components/input/input';

interface Props {
   setPage: React.Dispatch<React.SetStateAction<string>>
   setRoom: React.Dispatch<React.SetStateAction<number>>
   room: number
}


function ChatRoom(props: Props) {
   const { setRoom, setPage, room } = props


   const [chatRoom, setChatRoom] = useState<Room>()
   const [rooms, setRooms] = useState<Room[]>([])
   const [message, setMessage] = useState<string>('')
   const [showPicker, setShowPicker] = useState(false);
   const [forward, setForward] = useState<Message>()

   window.addEventListener('storage', () => {
      const localrooms: Room[] = JSON.parse(localStorage.getItem('rooms') || '')
      if (localrooms.find(item => item.id === room) !== undefined) {
         setChatRoom(localrooms.find(item => item.id === room))
      }
   })
   useEffect(() => {
      const localrooms: Room[] = JSON.parse(localStorage.getItem('rooms') || '')
      setChatRoom(localrooms.find(item => item.id === room))
      setRooms(localrooms)

   }, [])

   useEffect(() => {
      const localrooms: Room[] = JSON.parse(localStorage.getItem('rooms') || '')
      setChatRoom(localrooms.find(item => item.id === room))
   }, [room])


   window.onbeforeunload = function () {
      const localrooms: Room[] = JSON.parse(localStorage.getItem('rooms') || '')
      localrooms.forEach(item => {
         if (item.id === room) {
            const user = item.users.find(item => item.user === sessionStorage.getItem('user'))
            if (user !== undefined) {
               user.status = false
            }
         }
      }
      )
      setChatRoom(localrooms.find(item => item.id === props.room))
      localStorage.setItem('rooms', JSON.stringify(localrooms))
   };


   const offline = () => {
      const localrooms: Room[] = JSON.parse(localStorage.getItem('rooms') || '')
      localrooms.forEach(item => {
         if (item.id === props.room) {
            const user = item.users.find(item => item.user === sessionStorage.getItem('user'))
            if (user !== undefined) {
               user.status = false
            }
         }
      }
      )
      setChatRoom(localrooms.find(item => item.id === room))
      localStorage.setItem('rooms', JSON.stringify(localrooms))
      setPage('rooms')


   }


   const onEmojiClick = (emojiObject: EmojiClickData, event: MouseEvent) => {
      setMessage((prevInput) => prevInput + emojiObject.emoji);
      //setShowPicker(false);
      //console.log(emojiObject.emoji)
   };

   const sendMessage = () => {

      const localrooms: Room[] = JSON.parse(localStorage.getItem('rooms') || '')

      localrooms.forEach(item => {
         if (item.id === room) {
            if (item.chat) {
               item.chat = [...item.chat, { user: sessionStorage.getItem('user') || '', message: message }]
            }
         }
      }
      )
      setMessage('')


      if (chatRoom) {
         if (forward !== undefined) {
            setChatRoom({
               ...chatRoom, chat: [...chatRoom?.chat, { user: sessionStorage.getItem('user') || '', message: message, sendOn: forward }]
            })
         } else {
            setChatRoom({
               ...chatRoom, chat: [...chatRoom?.chat, { user: sessionStorage.getItem('user') || '', message: message }]
            })
         }
      }

      localStorage.setItem('rooms', JSON.stringify(localrooms))

   }

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
      setRoom(id)
   }



   // <button onClick={sendMessage}>Отпрвить</button>
   // <button onClick={() => setShowPicker(!showPicker)}>Emoj</button>


   return (


      <div className={style.chat}>
         <img className={style.chat__logo} src='../images/logo.png' />
         <div className={style.chat__back}>
            <Btn disable={false} text={'Назад'} onClick={offline} />
         </div>


         <div className={style.chat__container}>
            <div className={style.chat__window}>
               <DropDownInput openRoom={openRoom} rooms={rooms} chatRoom={chatRoom} setChatRoom={setChatRoom} />
               <div>
                  {
                     chatRoom?.chat?.map(item =>
                        <div onClick={() => setForward(item)} className={style.chat__message}>
                           <p>{item.user}</p>
                           <div>
                              {item.sendOn !== undefined &&
                                 <div>
                                    <p>{item.sendOn.user}</p>
                                    <p>{item.sendOn.message}</p>
                                 </div>}
                           </div>
                           <p>{item.message}</p>
                        </div>)
                  }
               </div>
               <div>
                  <div>
                     {
                        forward !== undefined &&
                        <div>
                           <p>Пересланное сообщение</p>
                           <p>{forward.user}</p>
                           <p>{forward.message}</p>
                           <p onClick={() => setForward(undefined)}>Отменить</p>
                        </div>
                     }
                  </div>
                  <div className={style.chat__input}>
                     <Input value={message} onChange={setMessage} />
                     <div className={style.chat__btnSend}>
                        <img src='../images/send.png'/>
                     </div>
                  </div>

                  {/* <input value={message} onChange={(e) => setMessage(e.target.value)} type='text' /> */}

                  <div className={style.chat__picker}>
                     {showPicker && (
                        <Picker theme={Theme.DARK} width={300} onEmojiClick={onEmojiClick} />
                     )}
                  </div>

               </div>

            </div>
            <div className={style.chat__usersContainer}>
               {
                  chatRoom?.users?.map(item =>
                     <div key={item.user}>
                        <p className={style.chat__userItem}>{item.user}</p>
                        {
                           item.status === true ? <p className={style.chat__userStatus}>online</p> : <p className={style.chat__userStatus}>offline</p>
                        }

                     </div>
                  )
               }
            </div>
         </div>

      </div>
   )
}

export default ChatRoom
