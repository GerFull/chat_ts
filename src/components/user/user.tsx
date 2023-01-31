import React, { useState } from 'react'
import style from '../user/user.module.scss'
import { UserLocal } from '../../types/data'
import Btn from '../btn/btn'
import Input from '../input/input'

interface Props {
   setPage: React.Dispatch<React.SetStateAction<string>>
}




function User(props: Props) {
   const { setPage } = props

   const [name, setName] = useState('')
   const [disable, setDisable] = useState(true)



   const addName = () => {
      sessionStorage.setItem('user', name.toLocaleLowerCase()) // добавление пользователя в сессию

      if (localStorage.getItem('users') === null) {
         localStorage.setItem('users', JSON.stringify([{ id: Date.now(), user: name.toLocaleLowerCase() }])) // если нет пользователей то добавляем
      }
      else {
         const users: UserLocal[] = JSON.parse(localStorage.getItem('users') || '')

         if (users.find(item => item.user === name.toLocaleLowerCase()) === undefined) {
            localStorage.setItem('users', JSON.stringify([...users, { user: name.toLocaleLowerCase() }])) // есть другие пользователи, но он не один из них и добавляем еще
         }
      }
      setPage('rooms')
   }

   const changeName = (value: string) => {
      setName(value)
      if (name.length > 0) {
         setDisable(false)
      }
   }



   return (
      <div className={style.user__background}>
         <div className={style.user__signIn}>
            <img src='../images/logo.png' />
            <Input value={name} onChange={changeName}/>
            <Btn disable={disable} onClick={addName} text={'Войти'} />
         </div>
      </div>
   )
}

export default User
