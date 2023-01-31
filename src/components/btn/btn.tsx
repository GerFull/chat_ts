import React from 'react'
import style from '../btn/btn.module.scss'


interface Props {
   disable: boolean
   onClick: () => void
   text: string
}

function Btn(props: Props) {
   const { disable, onClick,text } = props

   return (
      <div onClick={() => disable ? null : onClick()} style={disable ? { opacity: '0.5' } : undefined} className={style.btn}>{text}</div>
   )
}

export default Btn
