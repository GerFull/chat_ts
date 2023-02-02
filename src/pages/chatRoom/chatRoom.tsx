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
      localrooms.forEach(item => {
         if (item.id === room) {
            const user = item.users.find(item => item.user === sessionStorage.getItem('user'))
            if (user !== undefined) {
               user.status = true
            }
         }
      }
      )
      setChatRoom(localrooms.find(item => item.id === room))
      localStorage.setItem('rooms', JSON.stringify(localrooms))
   }, [])

   useEffect(() => {
      const localrooms: Room[] = JSON.parse(localStorage.getItem('rooms') || '')
      setChatRoom(localrooms.find(item => item.id === room))
   }, [room])


   window.addEventListener('beforeunload', function () {
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
      setChatRoom(localrooms.find(item => item.id === room))
      localStorage.setItem('rooms', JSON.stringify(localrooms))
   })




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
      setMessage((prevInput) => prevInput + emojiObject.emoji)
   };

   const sendMessage = () => {

      const localrooms: Room[] = JSON.parse(localStorage.getItem('rooms') || '')
      localrooms.forEach(item => {
         if (item.id === room) {
            if (item.chat && forward === undefined) {
               item.chat = [...item.chat, { user: sessionStorage.getItem('user') || '', message: message }]
            } else if (item.chat && forward !== undefined) {
               item.chat = [...item.chat, { user: sessionStorage.getItem('user') || '', message: message, sendOn: forward }]
            }
         }
      }
      )
      setMessage('')
      setShowPicker(false)
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
      setForward(undefined)
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


   return (
      <div className={style.chat}>
         <img className={style.chat__logo} src='../images/logo.png' alt='logo' />
         <div className={style.chat__back}>
            <Btn disable={false} text={'Назад'} onClick={offline} />
         </div>
         <div className={style.chat__container}>
            <div className={style.chat__window}>
               <DropDownInput openRoom={openRoom} rooms={rooms} chatRoom={chatRoom} />
               <div className={style.chat__dialog}>
                  {
                     chatRoom?.chat?.map(item =>
                        <div className={style.chat__message} style={item.user === sessionStorage.getItem('user')?.toLocaleLowerCase() ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }} >
                           <div onClick={() => setForward(item)} className={item.user === sessionStorage.getItem('user')?.toLocaleLowerCase() ? style.chat__message_itemMain : style.chat__message_item}>
                              <p className={style.chat__userName}>{item.user}</p>
                              <div>
                                 {item.sendOn !== undefined &&
                                    <div className={style.chat__forwardMessage}>
                                       <p className={style.chat__userName}>{item.sendOn.user}</p>
                                       <p className={style.chat__userText}>{item.sendOn.message}</p>
                                    </div>}
                              </div>
                              <p className={style.chat__userText}>{item.message}</p>
                           </div>
                        </div>
                     )
                  }
               </div>
               <div>
                  {
                     forward !== undefined &&
                     <div className={style.chat__currentMessage}>
                        <p className={style.chat__currentMessage_title}>Пересланное сообщение</p>
                        <p className={style.chat__currentMessage_name}>{forward.user}</p>
                        <p className={style.chat__currentMessage_text}>{forward.message}</p>
                        <img onClick={() => setForward(undefined)} className={style.chat__currentMessage_close} src='../images/close.png' alt='close' />
                     </div>
                  }
                  <div className={style.chat__input}>
                     <Input value={message} onChange={setMessage} />
                     <div onClick={sendMessage} className={style.chat__btnSend}>
                        <img src='../images/send.png' alt='send' />
                     </div>
                     <img onClick={() => setShowPicker(!showPicker)} className={style.chat__emoji} src='../images/smile.png' alt='smile' />
                     <div className={style.chat__picker}>
                        {showPicker && (
                           <Picker theme={Theme.DARK} width={300} onEmojiClick={onEmojiClick} />
                        )}
                     </div>
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
